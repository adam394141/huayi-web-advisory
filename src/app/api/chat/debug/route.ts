export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  const hasKey = !!apiKey;
  const keyPrefix = apiKey ? apiKey.substring(0, 8) + "..." : "none";

  if (!apiKey) {
    return Response.json({ hasKey, keyPrefix, error: "no key" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "回答：你好" }] }],
          generationConfig: { maxOutputTokens: 50 },
        }),
      }
    );

    const data = await response.json();
    return Response.json({
      hasKey,
      keyPrefix,
      geminiStatus: response.status,
      geminiOk: response.ok,
      hasReply: !!data?.candidates?.[0]?.content?.parts?.[0]?.text,
      reply: data?.candidates?.[0]?.content?.parts?.[0]?.text?.substring(0, 50),
      error: data?.error?.message?.substring(0, 200),
    });
  } catch (e) {
    return Response.json({ hasKey, keyPrefix, error: String(e) });
  }
}
