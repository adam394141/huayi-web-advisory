"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const GREETINGS = [
  "有什麼想了解的嗎？",
  "需要幫忙嗎？😊",
  "外包一直講不通？",
  "想建自己的行銷團隊？",
  "30 分鐘企業體檢，免費預約中",
  "品牌定位卡住了？",
  "歡迎隨時問我 👋",
  "AI 怎麼導入？問我就對了",
];

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

function renderWithLinks(text: string) {
  const parts = text.split(URL_REGEX);
  return parts.map((part, i) =>
    URL_REGEX.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline text-[#8B7355] hover:text-[#6d5a3e]">
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

interface Message {
  role: "user" | "assistant";
  text: string;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [showGreeting, setShowGreeting] = useState(false);
  const greetingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStart = useRef<{ x: number; y: number; bx: number; by: number } | null>(null);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (open) return;
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    const rect = el.getBoundingClientRect();
    dragStart.current = { x: e.clientX, y: e.clientY, bx: rect.left, by: rect.top };
    setDragging(false);
  }, [open]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragStart.current || open) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) setDragging(true);
    setDragPos({
      x: Math.max(0, Math.min(window.innerWidth - 60, dragStart.current.bx + dx)),
      y: Math.max(0, Math.min(window.innerHeight - 60, dragStart.current.by + dy)),
    });
  }, [open]);

  const handlePointerUp = useCallback(() => {
    if (!dragging && !open) setOpen(true);
    dragStart.current = null;
    setTimeout(() => setDragging(false), 0);
  }, [dragging, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: Message = { role: "user", text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: updated.slice(-6), sessionId }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "抱歉，目前無法連線。請直接透過 LINE 聯繫我們 👉 https://lin.ee/6r57uKZ" },
      ]);
    }
    setLoading(false);
  }

  const btnStyle: React.CSSProperties = dragPos && !open
    ? { position: "fixed", left: dragPos.x, top: dragPos.y, right: "auto", bottom: "auto" }
    : {};

  return (
    <>
      {/* 浮動按鈕 + 招呼語 */}
      {!open && (
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onMouseEnter={() => {
            setGreeting(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
            setShowGreeting(true);
            if (greetingTimer.current) clearTimeout(greetingTimer.current);
            greetingTimer.current = setTimeout(() => setShowGreeting(false), 3000);
          }}
          onMouseLeave={() => {
            if (greetingTimer.current) clearTimeout(greetingTimer.current);
            greetingTimer.current = setTimeout(() => setShowGreeting(false), 1000);
          }}
          style={{
            position: "fixed",
            right: dragPos ? "auto" : "24px",
            bottom: dragPos ? "auto" : "90px",
            zIndex: 9999,
            touchAction: "none",
            cursor: "grab",
            ...btnStyle,
          }}
        >
          {showGreeting && (
            <div
              className="absolute bottom-[62px] right-0 whitespace-nowrap rounded-xl bg-white px-4 py-2 text-[13px] text-[#1A1A1A] shadow-md"
              style={{ animation: "fadeIn 0.2s ease" }}
            >
              {greeting}
              <div className="absolute -bottom-1.5 right-5 h-3 w-3 rotate-45 bg-white" />
            </div>
          )}
          <button
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1A1A1A] shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{ animation: "breathe 3s ease-in-out infinite" }}
            aria-label="開啟聊天"
          >
            <img src="/brand/huayi-logo.svg" alt="華翼" width="32" height="32" className="h-7 w-auto" />
          </button>
          <style>{`
            @keyframes breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
          `}</style>
        </div>
      )}

      {/* 聊天視窗 */}
      {open && (
        <div
          className="fixed inset-x-0 bottom-0 z-[9999] flex flex-col overflow-hidden bg-white shadow-2xl md:inset-x-auto md:bottom-4 md:right-4 md:w-[380px] md:rounded-2xl md:border md:border-[#e5e2dd]"
          style={{ height: "min(100dvh, 100vh)", maxHeight: "100dvh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-[#1A1A1A] px-5 py-3.5">
            <div>
              <p className="text-[14px] font-semibold text-white">華翼品牌策略</p>
              <p className="text-[12px] text-white/50">通常在幾秒內回覆</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/60 transition-colors hover:text-white" aria-label="關閉聊天">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-[14px] text-[#8a8680] py-8">
                <p className="font-medium text-[#1A1A1A]">您好！👋</p>
                <p className="mt-2">有任何關於華翼服務的問題，歡迎詢問。</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#1A1A1A] text-white"
                      : "bg-[#f5f3ef] text-[#1A1A1A]"
                  }`}
                  style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  {renderWithLinks(msg.text)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-[#f5f3ef] px-4 py-2.5 text-[14px] text-[#8a8680]">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-[#e5e2dd] px-4 py-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)]">
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="輸入您的問題..."
                maxLength={500}
                className="flex-1 rounded-xl border border-[#e5e2dd] bg-[#fafaf8] px-4 py-2.5 text-[14px] text-[#1A1A1A] placeholder:text-[#c4c0ba] outline-none focus:border-[#8B7355]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1A1A1A] text-white transition-colors hover:bg-[#333] disabled:opacity-30"
                aria-label="送出"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
