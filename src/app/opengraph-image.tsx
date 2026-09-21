import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "華翼品牌策略 HUAYI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FDFCFA 0%, #F5F0EB 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#1A1A1A",
            letterSpacing: "0.02em",
          }}
        >
          華翼品牌策略
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#8B7355",
            marginTop: 16,
            letterSpacing: "0.15em",
          }}
        >
          HUAYI BRAND STRATEGY
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#666",
            marginTop: 32,
          }}
        >
          品牌決定方向，AI 決定速度
        </div>
      </div>
    ),
    { ...size }
  );
}
