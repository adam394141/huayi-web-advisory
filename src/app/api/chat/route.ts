import { createClient } from "@supabase/supabase-js";
import { HUAYI_KNOWLEDGE, SYSTEM_PROMPT } from "@/lib/chat-knowledge";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const LINE_FALLBACK = "這個問題我目前無法回答，建議直接聯繫我們，會有專人為您說明 😊\n\n👉 LINE 諮詢：https://lin.ee/6r57uKZ\n👉 聯絡頁：https://huayi.tw/contact";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function saveChat(sessionId: string, role: "user" | "assistant", message: string) {
  try {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.from("chat_conversations").insert({ session_id: sessionId, role, message });
  } catch {
    // 存檔失敗不影響回覆
  }
}

async function getRelevantArticles(question: string): Promise<string> {
  try {
    const supabase = getSupabase();
    if (!supabase) return "";

    const { data: articles } = await supabase
      .from("blog_posts")
      .select("title, slug, excerpt, category, tags, content")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(20);

    if (!articles || articles.length === 0) return "";

    const q = question.toLowerCase();
    const matched = articles.filter((a) => {
      const searchText = `${a.title} ${a.excerpt || ""} ${a.category || ""} ${(a.tags || []).join(" ")}`.toLowerCase();
      const words = q.split(/\s+/).filter((w) => w.length > 1);
      return words.some((w) => searchText.includes(w));
    });

    if (matched.length === 0) return "";

    const summaries = matched.slice(0, 3).map((a) => {
      const plainContent = (a.content || "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 500);
      return `【${a.title}】（${a.category}）\n網址：https://huayi.tw/blog/${a.slug}\n摘要：${a.excerpt || ""}\n內容節錄：${plainContent}`;
    });

    return "\n\n## 華翼的相關文章（可引用觀點並推薦連結）\n" + summaries.join("\n\n");
  } catch {
    return "";
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[chat] GEMINI_API_KEY not set");
    return Response.json({ reply: LINE_FALLBACK });
  }

  try {
    const { message, history, sessionId } = await request.json();
    if (!message || typeof message !== "string" || message.length > 500) {
      return Response.json({ reply: "請輸入您的問題，我會盡力為您解答 😊" });
    }

    const sid = sessionId || crypto.randomUUID();

    await saveChat(sid, "user", message);

    const [articleContext, recentHistory] = await Promise.all([
      getRelevantArticles(message),
      Promise.resolve(
        (history || []).slice(-6).map((h: { role: string; text: string }) =>
          `${h.role === "user" ? "訪客" : "助理"}：${h.text}`
        ).join("\n")
      ),
    ]);

    const prompt = `${SYSTEM_PROMPT}\n\n以下是華翼的完整資訊：\n${HUAYI_KNOWLEDGE}${articleContext}\n\n${recentHistory ? `對話紀錄：\n${recentHistory}\n\n` : ""}訪客的問題：${message}\n\n請回答：`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
        topP: 0.8,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[chat] gemini-error", response.status, JSON.stringify(data));
      const fallback = LINE_FALLBACK;
      await saveChat(sid, "assistant", fallback);
      return Response.json({ reply: fallback, sessionId: sid });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!reply) {
      console.error("[chat] no-reply", JSON.stringify(data));
      const fallback = LINE_FALLBACK;
      await saveChat(sid, "assistant", fallback);
      return Response.json({ reply: fallback, sessionId: sid });
    }

    await saveChat(sid, "assistant", reply);

    return Response.json({ reply, sessionId: sid });
  } catch (error) {
    console.error("[chat] unexpected", error instanceof Error ? error.message : error);
    return Response.json({ reply: LINE_FALLBACK });
  }
}
