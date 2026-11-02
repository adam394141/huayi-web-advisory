import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import {
  advisorySchema,
  isHumanTiming,
  isSameOrigin,
  type AdvisorySubmission,
} from "@/lib/advisory-schema";
import { calculateBGS, type BGSResult, type EnergyItem } from "@/lib/bgs/calculator";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const REQUEST_LIMIT = 20_000;
const BOOKING_URL = "https://calendar.app.google/32sGErGnZvAVGswV7";

function reply(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function requestFingerprint(request: Request) {
  const forwardedFor =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  return createHash("sha256")
    .update(`${forwardedFor}|${userAgent}`)
    .digest("hex");
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        ch
      ] || ch,
  );
}

function suggestPath(data: AdvisorySubmission): string {
  if (data.screen_flag === "是") return "轉介優先（暫不推付費方案）";
  if (data.pace === "我需要一位長期在身邊的顧問")
    return "01 深度評估 → 評估後邀請 03";
  if (
    data.impact === "尚未，但我不想等到那一天" ||
    data.duration === "未滿 3 個月"
  )
    return "01 系統深度評估";
  if (
    (data.impact?.startsWith("開始") ||
      data.impact?.startsWith("已明顯")) &&
    (data.pace?.startsWith("30 天") || data.pace?.startsWith("3 個月"))
  )
    return "02 12 週系統重建";
  return "01 系統深度評估";
}

const ENERGY_PROFILES: Record<
  string,
  { label: string; strength: string; blind: string }
> = {
  wind: {
    label: "策略型",
    strength: "你擅長全局分析，快速掌握脈絡與方向",
    blind: "壓力下容易陷入過度分析，反而讓決策癱瘓",
  },
  fire: {
    label: "行動型",
    strength: "你擅長快速推進、果斷出手，執行力極強",
    blind: "壓力下容易衝動決策，事後才發現遺漏關鍵面向",
  },
  water: {
    label: "連結型",
    strength: "你擅長感知人際動態，建立信任與深度連結",
    blind: "壓力下容易過度承擔他人情緒，模糊了自己的判斷邊界",
  },
  earth: {
    label: "穩定型",
    strength: "你擅長穩健布局，步步為營，風險控管到位",
    blind: "壓力下容易過度保守，錯失最佳行動時機",
  },
};

function areaConnection(area: string, typeLabel: string): string {
  if (area.includes("決策"))
    return `你提到決策正在失衡——這正是${typeLabel}能量失衡時的典型訊號。`;
  if (area.includes("關係"))
    return `你提到關係正在失衡——當${typeLabel}的能量失衡，人際判斷往往是最先受影響的區域。`;
  if (area.includes("壓力") || area.includes("節律"))
    return `你提到節律正在失衡——${typeLabel}在高壓狀態下，最容易從這裡開始鬆動。`;
  return `你感覺到系統正在鬆動——這是${typeLabel}能量需要重新校準的訊號。`;
}

function buildApplicantEmail(
  name: string,
  area: string,
  dominant: EnergyItem,
) {
  const profile = ENERGY_PROFILES[dominant.element] ?? ENERGY_PROFILES.wind;
  const connection = areaConnection(area, profile.label);

  return `
<div style="margin:0;padding:0;background:#111315;font-family:'Noto Sans TC','PingFang TC','Microsoft JhengHei',system-ui,sans-serif">
<div style="max-width:580px;margin:0 auto;padding:48px 24px">

<div style="border-bottom:1px solid #2A2E34;padding-bottom:20px;margin-bottom:40px">
  <span style="font-size:18px;font-weight:600;color:#EDE9E2;letter-spacing:0.08em">華翼企業諮詢</span>
  <span style="float:right;font-size:12px;letter-spacing:0.24em;color:#A9A49B">PRIVATE ADVISORY</span>
</div>

<p style="font-size:16px;color:#EDE9E2;line-height:1.75;margin:0 0 32px">
  ${escapeHtml(name)}，感謝你的信任。
</p>

<p style="font-size:13px;letter-spacing:0.28em;color:#C9AE7C;margin:0 0 12px">你的核心決策能量</p>
<h1 style="font-size:32px;font-weight:600;color:#EDE9E2;margin:0 0 20px;font-family:'Noto Serif TC',serif">${profile.label}</h1>
<p style="font-size:16px;color:#C9C4BB;line-height:1.75;margin:0 0 8px">
  <strong style="color:#EDE9E2">${profile.strength}。</strong>
</p>
<p style="font-size:16px;color:#A9A49B;line-height:1.75;margin:0 0 32px">
  然而，${profile.blind}。
</p>

<div style="border-top:1px solid #2A2E34;border-bottom:1px solid #2A2E34;padding:24px 0;margin:0 0 32px">
  <p style="font-size:13px;letter-spacing:0.24em;color:#A9A49B;margin:0 0 12px">與你的狀態對照</p>
  <p style="font-size:17px;color:#EDE9E2;line-height:1.8;margin:0;font-family:'Noto Serif TC',serif">
    ${escapeHtml(connection)}
  </p>
</div>

<p style="font-size:13px;letter-spacing:0.28em;color:#C9AE7C;margin:0 0 16px">下一步</p>
<p style="font-size:16px;color:#C9C4BB;line-height:1.75;margin:0 0 28px">
  在 30 分鐘的免費諮詢中，Rosie 會讓你看見這個模式如何影響你的決策與關係，以及第一個該調整的槓桿在哪裡。
</p>
<div style="text-align:center;margin:0 0 16px">
  <a href="${BOOKING_URL}" style="display:inline-block;background:#C9AE7C;color:#111315;text-decoration:none;font-weight:700;letter-spacing:0.12em;padding:16px 40px;font-size:16px;font-family:inherit">
    預約 30 分鐘免費諮詢
  </a>
</div>
<p style="font-size:14px;color:#A9A49B;text-align:center;margin:0 0 48px">
  此建議與名額保留 7 天。
</p>

<p style="font-size:12px;color:#8C887F;border-top:1px solid #2A2E34;padding-top:20px;line-height:1.6">
  本服務為決策與關係系統顧問，不提供醫療診斷、心理治療或命運預測。如有需要，顧問會協助轉介合適的專業資源。
</p>

</div>
</div>`;
}

function buildNotificationEmail(
  data: AdvisorySubmission,
  suggestedPath: string,
  bgs: BGSResult,
) {
  const energyBreakdown = bgs.energy.sorted
    .map(
      (e) =>
        `${ENERGY_PROFILES[e.element]?.label ?? e.element}: ${e.pct}%`,
    )
    .join(" ｜ ");

  return `
<div style="font-family:sans-serif;padding:24px;max-width:600px">
  <h2 style="margin:0 0 16px">新的私人評估申請</h2>
  <table style="border-collapse:collapse;width:100%">
    <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold">稱呼</td><td style="padding:8px 12px;border:1px solid #ddd">${escapeHtml(data.name)}</td></tr>
    <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold">回覆方式</td><td style="padding:8px 12px;border:1px solid #ddd">${escapeHtml(data.contact)}</td></tr>
    <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold">城市</td><td style="padding:8px 12px;border:1px solid #ddd">${escapeHtml(data.city || "未填寫")}</td></tr>
    <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold">出生日期</td><td style="padding:8px 12px;border:1px solid #ddd">${escapeHtml(data.birth_date)}</td></tr>
    <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold">失衡領域</td><td style="padding:8px 12px;border:1px solid #ddd">${escapeHtml(data.area || "未選擇")}</td></tr>
    <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold">持續時間</td><td style="padding:8px 12px;border:1px solid #ddd">${escapeHtml(data.duration || "未選擇")}</td></tr>
    <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold">影響程度</td><td style="padding:8px 12px;border:1px solid #ddd">${escapeHtml(data.impact || "未選擇")}</td></tr>
    <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold">期待節奏</td><td style="padding:8px 12px;border:1px solid #ddd">${escapeHtml(data.pace || "未選擇")}</td></tr>
    <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold">篩選題</td><td style="padding:8px 12px;border:1px solid #ddd">${escapeHtml(data.screen_flag || "否")}</td></tr>
    <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold">系統建議路徑</td><td style="padding:8px 12px;border:1px solid #ddd">${escapeHtml(suggestedPath)}</td></tr>
    <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold">核心能量</td><td style="padding:8px 12px;border:1px solid #ddd">${escapeHtml(energyBreakdown)}</td></tr>
    <tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold">備註</td><td style="padding:8px 12px;border:1px solid #ddd">${escapeHtml(data.note || "無")}</td></tr>
  </table>
  <p style="margin-top:16px;font-size:13px;color:#888">送出時間：${new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}</p>
</div>`;
}

async function sendEmail(
  id: string,
  to: string,
  subject: string,
  html: string,
  replyTo?: string,
) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) return { attempted: false };

  const payload: Record<string, unknown> = {
    from,
    to: [to],
    subject,
    html,
  };
  if (replyTo) payload.reply_to = replyTo;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `bgs-advisory-${id}-${to}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(`RESEND_${response.status}`);
  return { attempted: true };
}

function looksLikeEmail(contact: string): string | null {
  const match = contact.match(
    /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/,
  );
  return match ? match[0].toLowerCase() : null;
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  try {
    if (!isSameOrigin(request.url, request.headers.get("origin"))) {
      return reply({ error: "無法驗證表單來源。" }, 403);
    }
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return reply({ error: "表單格式不正確。" }, 415);
    }
    const declaredLength = Number(
      request.headers.get("content-length") || "0",
    );
    if (declaredLength > REQUEST_LIMIT)
      return reply({ error: "表單內容過長。" }, 413);

    const rawBody = await request.text();
    if (rawBody.length > REQUEST_LIMIT)
      return reply({ error: "表單內容過長。" }, 413);

    let raw: unknown;
    try {
      raw = JSON.parse(rawBody);
    } catch {
      return reply({ error: "表單格式不正確。" }, 400);
    }

    const parsed = advisorySchema.safeParse(raw);
    if (!parsed.success || !isHumanTiming(parsed.data.startedAt)) {
      return reply({ error: "請確認必填欄位後再送出。" }, 400);
    }

    const data = parsed.data;

    const bgsResult = calculateBGS(data.birth_date);
    const dominantEnergy = bgsResult.energy.sorted[0];
    const suggestedPath = suggestPath(data);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key)
      return reply({ error: "服務暫時無法使用。" }, 503);

    const client = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const { error: dbError } = await client
      .from("bgs_advisory_leads")
      .insert({
        id: requestId,
        name: data.name,
        contact: data.contact,
        city: data.city || null,
        birth_date: data.birth_date,
        note: data.note || null,
        area: data.area || null,
        duration: data.duration || null,
        impact: data.impact || null,
        pace: data.pace || null,
        screen_flag: data.screen_flag || null,
        suggested_path: suggestedPath,
        bgs_result: bgsResult,
        dominant_energy: dominantEnergy?.element || null,
        status: "待審閱",
        source_url: request.headers.get("referer") || null,
        browser_lang: null,
        fingerprint_hash: requestFingerprint(request),
        consent: true,
      });

    if (dbError) {
      console.error("[advisory] db-insert-failed", {
        requestId,
        code: dbError.code,
        message: dbError.message,
      });
      return reply({ error: "申請暫時無法送出，請稍後再試。" }, 503);
    }

    const applicantEmail = looksLikeEmail(data.contact);
    if (applicantEmail) {
      try {
        await sendEmail(
          requestId,
          applicantEmail,
          "你的決策能量分析｜華翼企業諮詢",
          buildApplicantEmail(data.name, data.area, dominantEnergy),
        );
        await client
          .from("bgs_advisory_leads")
          .update({ email_sent: true })
          .eq("id", requestId);
      } catch (emailError) {
        console.error("[advisory] applicant-email-failed", {
          requestId,
          error:
            emailError instanceof Error ? emailError.message : "unknown",
        });
      }
    }

    const notifyTo =
      process.env.CONTACT_NOTIFICATION_EMAIL || "888@huayi.tw";
    try {
      const flag = data.screen_flag === "是" ? "【需優先關懷】" : "";
      await sendEmail(
        requestId,
        notifyTo,
        `${flag}新的私人評估申請：${data.name}`,
        buildNotificationEmail(data, suggestedPath, bgsResult),
        applicantEmail || undefined,
      );
    } catch (notifyError) {
      console.error("[advisory] notification-failed", {
        requestId,
        error:
          notifyError instanceof Error ? notifyError.message : "unknown",
      });
    }

    console.info("[advisory] accepted", { requestId, emailSent: !!applicantEmail });
    return reply({ ok: true, reference: requestId }, 201);
  } catch (error) {
    console.error("[advisory] unexpected", {
      requestId,
      error: error instanceof Error ? error.message : "unknown",
    });
    return reply({ error: "服務暫時無法使用。" }, 503);
  }
}
