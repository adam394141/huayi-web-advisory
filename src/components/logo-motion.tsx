"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { shouldAnimate } from "@/lib/motion";

// 每次進首頁都播放；等待實際 Logo 載入，不用 sessionStorage 靜默跳過。
export function LogoMotion() {
  const [phase, setPhase] = useState<"off" | "loading" | "reveal" | "fade">("off");
  const [reduced, setReduced] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearTimers = () => timers.current.forEach(clearTimeout);
  const finish = () => {
    clearTimers();
    setPhase("off");
    document.documentElement.dataset.intro = "done";
  };
  const play = () => {
    clearTimers();
    // 按下「播放完整動態」代表訪客主動選擇，首次載入仍尊重系統設定。
    document.documentElement.dataset.motion = "force";
    setReduced(false);
    document.documentElement.dataset.intro = "playing";
    setPhase("loading");
    timers.current = [setTimeout(finish, 6000)];
  };
  const reveal = () => {
    clearTimers();
    setPhase("reveal");
    timers.current = [setTimeout(() => setPhase("fade"), 2000), setTimeout(finish, 2800)];
  };

  useEffect(() => {
    const start = setTimeout(() => {
      setReduced(!shouldAnimate());
      if (shouldAnimate()) {
        document.documentElement.dataset.intro = "playing";
        setPhase("loading");
        timers.current = [setTimeout(() => {
          setPhase("off");
          document.documentElement.dataset.intro = "done";
        }, 6000)];
      }
    }, 0);
    return () => {
      clearTimeout(start);
      timers.current.forEach(clearTimeout);
      delete document.documentElement.dataset.intro;
    };
  }, []);

  return (
    <>
      <div className="motion-controls">
        <button type="button" onClick={play} className="motion-replay">
          {reduced ? "播放完整動態" : "重播品牌開場"} <span aria-hidden="true">↺</span>
        </button>
        {!reduced && <button type="button" className="motion-reduce" onClick={() => {
          document.documentElement.dataset.motion = "reduce";
          setReduced(true);
          finish();
        }}>減少動態</button>}
      </div>
      {phase !== "off" && (
        <div className="brand-intro" data-phase={phase}>
          <div className="brand-intro-mark">
            <Image src="/brand/huayi-logo.svg" alt="華翼 HUAYI" width={276} height={96} priority onLoad={reveal} onError={finish} />
            <p>品牌決定方向，AI 決定速度。</p>
            <span className="brand-intro-line" aria-hidden="true" />
          </div>
          <button type="button" onClick={finish} className="brand-intro-skip">略過開場 →</button>
        </div>
      )}
    </>
  );
}
