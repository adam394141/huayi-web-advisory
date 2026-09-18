import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import {
  contactInquirySchema,
  isHumanTiming,
  isSameOrigin,
  type ContactInquiry,
} from "@/lib/contact-inquiry";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const REQUEST_LIMIT = 20_000;

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
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  return createHash("sha256").update(`${forwardedFor}|${userAgent}`).digest("hex");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] || character);
}

async function sendNotification(id: string, inquiry: ContactInquiry) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_NOTIFICATION_EMAIL || "888@huayi.tw";
  if (!apiKey || !from) return { attempted: false };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `huayi-contact-${id}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: inquiry.email,
      subject: `華翼官網新詢問｜${inquiry.type}`,
      html: `
        <h1>華翼官網新詢問</h1>
        <p><strong>姓名：</strong>${escapeHtml(inquiry.name)}</p>
        <p><strong>Email：</strong>${escapeHtml(inquiry.email)}</p>
        <p><strong>公司／品牌：</strong>${escapeHtml(inquiry.company || "未填寫")}</p>
        <p><strong>諮詢類型：</strong>${escapeHtml(inquiry.type)}</p>
        <p><strong>訊息：</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(inquiry.message)}</p>
        <hr />
        <p>詢問編號：${escapeHtml(id)}</p>
      `,
    }),
  });

  if (!response.ok) throw new Error(`RESEND_${response.status}`);
  return { attempted: true };
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  try {
    if (process.env.CONTACT_FORM_ENABLED !== "true") {
      return reply({ error: "聯絡表單目前尚未開放，請改寄 888@huayi.tw。" }, 503);
    }
    if (!isSameOrigin(request.url, request.headers.get("origin"))) {
      return reply({ error: "無法驗證表單來源。" }, 403);
    }
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return reply({ error: "表單格式不正確。" }, 415);
    }
    const declaredLength = Number(request.headers.get("content-length") || "0");
    if (declaredLength > REQUEST_LIMIT) return reply({ error: "表單內容過長。" }, 413);

    const rawBody = await request.text();
    if (rawBody.length > REQUEST_LIMIT) return reply({ error: "表單內容過長。" }, 413);

    let raw: unknown;
    try {
      raw = JSON.parse(rawBody);
    } catch {
      return reply({ error: "表單格式不正確。" }, 400);
    }

    const parsed = contactInquirySchema.safeParse(raw);
    if (!parsed.success || !isHumanTiming(parsed.data.startedAt)) {
      return reply({ error: "請確認必填欄位與訊息內容後再送出。" }, 400);
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return reply({ error: "聯絡服務暫時無法使用。" }, 503);

    const inquiry = parsed.data;
    const client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    const { data, error } = await client.rpc("submit_contact_inquiry", {
      p_name: inquiry.name,
      p_email: inquiry.email,
      p_company: inquiry.company || null,
      p_inquiry_type: inquiry.type,
      p_message: inquiry.message,
      p_fingerprint_hash: requestFingerprint(request),
    });

    if (error) {
      const limited = error.message?.includes("rate_limited");
      console.warn("[contact] storage-failed", { requestId, limited, code: error.code || null });
      return reply(
        { error: limited ? "送出次數過於頻繁，請稍後再試。" : "訊息暫時無法送出，請稍後再試。" },
        limited ? 429 : 503,
      );
    }

    const inquiryId = typeof data === "string" ? data : requestId;
    try {
      const notification = await sendNotification(inquiryId, inquiry);
      console.info("[contact] accepted", { requestId, notificationAttempted: notification.attempted });
    } catch (notificationError) {
      console.error("[contact] notification-failed", {
        requestId,
        error: notificationError instanceof Error ? notificationError.message : "unknown",
      });
    }

    return reply({ ok: true, reference: inquiryId }, 201);
  } catch (error) {
    console.error("[contact] unexpected", {
      requestId,
      error: error instanceof Error ? error.message : "unknown",
    });
    return reply({ error: "聯絡服務暫時無法使用。" }, 503);
  }
}
