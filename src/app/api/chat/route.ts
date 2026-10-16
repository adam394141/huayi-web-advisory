import { HUAYI_KNOWLEDGE, SYSTEM_PROMPT } from "@/lib/chat-knowledge";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const LINE_FALLBACK = "這個問題我目前無法回答，建議直接聯繫我們，會有專人為您說明 😊\n\n👉 LINE 諮詢：https://lin.ee/6r57uKZ\n👉 聯絡頁：https://huayi.tw/contact";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return Response.json({ reply: LINE_FALLBACK }, { status: 200 });

    const { message, history } = await request.json();
    if (!message || typeof message !== "string" || message.length > 500) {
      return Response.json({ reply: "請輸入您的問題，我會盡力為您解答 😊" });
    }

    const recentHistory = (history || []).slice(-6).map((h: { role: string; text: string }) =>
      `${h.role === "user" ? "訪客" : "助理"}：${h.text}`
    ).join("\n");

    const prompt = `${SYSTEM_PROMPT}\n\n以下是華翼的完整資訊：\n${HUAYI_KNOWLEDGE}\n\n${recentHistory ? `對話紀錄：\n${recentHistory}\n\n` : ""}訪客的問題：${message}\n\n請回答：`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 300,
            topP: 0.8,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          ],
        }),
      }
    );

    if (!response.ok) {
      console.error("[chat] gemini-error", response.status);
      return Response.json({ reply: LINE_FALLBACK });
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!reply) return Response.json({ reply: LINE_FALLBACK });

    return Response.json({ reply });
  } catch (error) {
    console.error("[chat] unexpected", error);
    return Response.json({ reply: LINE_FALLBACK });
  }
}
