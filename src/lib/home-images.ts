export interface HomeImage {
  id: string;
  section: string;
  alt: string;
  source_type: "real_work" | "ai_placeholder" | "ai_generated" | "real_portrait" | "diagram";
  file: string | null;
  replacement_status: "final" | "pending";
  crop_policy: "contain" | "cover";
  aspect: string;
  description?: string;
}

export const HOME_IMAGES: HomeImage[] = [
  {
    id: "hero-main",
    section: "hero",
    alt: "品牌策略顧問與企業團隊協作的專業場景",
    source_type: "ai_generated",
    file: "/home/strategy.png",
    replacement_status: "final",
    crop_policy: "cover",
    aspect: "21/9",
    description: "亞洲企業顧問情境：自然的策略會議場景，溫暖專業氛圍",
  },
  {
    id: "challenges-scene",
    section: "challenges",
    alt: "企業面臨品牌與數位轉型挑戰的情境",
    source_type: "ai_generated",
    file: "/home/marketing.png",
    replacement_status: "final",
    crop_policy: "cover",
    aspect: "21/9",
    description: "橫向寬景：台灣中小企業辦公情境，展現需要策略支援的氣氛",
  },
  {
    id: "service-strategy",
    section: "services",
    alt: "品牌策略規劃的協作過程",
    source_type: "ai_generated",
    file: "/home/strategy-v2.png",
    replacement_status: "final",
    crop_policy: "cover",
    aspect: "4/3",
    description: "AI 生成情境：品牌策略卡片與定位規劃桌面，非實際客戶案例",
  },
  {
    id: "service-ai",
    section: "services",
    alt: "企業 AI 導入概念示意圖",
    source_type: "ai_generated",
    file: "/home/ai-v2.png",
    replacement_status: "final",
    crop_policy: "cover",
    aspect: "4/3",
    description: "數據螢幕、AI 工具應用、技術導入情境",
  },
  {
    id: "service-marketing",
    section: "services",
    alt: "品牌行銷策略執行與數據分析",
    source_type: "ai_generated",
    file: "/home/marketing-v2.png",
    replacement_status: "final",
    crop_policy: "cover",
    aspect: "4/3",
    description: "AI 生成情境：內容製作與商品攝影工作室，非實際客戶案例",
  },
  {
    id: "service-design",
    section: "services",
    alt: "品牌體驗情境示意：包裝、文具與帆布袋",
    source_type: "ai_generated",
    file: "/home/experience-v2.png",
    replacement_status: "final",
    crop_policy: "contain",
    aspect: "4/3",
  },
  {
    id: "ai-main",
    section: "ai",
    alt: "AI 技術整合與企業數位轉型",
    source_type: "ai_generated",
    file: "/home/ai.png",
    replacement_status: "final",
    crop_policy: "cover",
    aspect: "16/9",
    description: "AI 流程視覺、數據儀表、科技與人協作",
  },
  {
    id: "method-flow",
    section: "method",
    alt: "華翼顧問方法流程：診斷、策略、執行",
    source_type: "diagram",
    file: "/home/method.svg",
    replacement_status: "final",
    crop_policy: "cover",
    aspect: "21/9",
    description: "三段式流程視覺，簡潔的診斷→策略→執行圖示",
  },
  {
    id: "team-adam",
    section: "team",
    alt: "Adam 品牌顧問",
    source_type: "real_portrait",
    file: "/home/adam.jpg",
    replacement_status: "final",
    crop_policy: "cover",
    aspect: "3/4",
    description: "Adam 品牌顧問形象照",
  },
  {
    id: "team-rosie",
    section: "team",
    alt: "Rosie 品牌顧問",
    source_type: "ai_placeholder",
    file: null,
    replacement_status: "pending",
    crop_policy: "cover",
    aspect: "3/4",
    description: "Rosie 品牌顧問形象照",
  },
  {
    id: "cta-bg",
    section: "cta",
    alt: "米白與品牌黃的日光建築空間",
    source_type: "ai_generated",
    file: "/home/cta-v2.png",
    replacement_status: "final",
    crop_policy: "cover",
    aspect: "21/9",
    description: "AI 生成情境：日光建築走廊，中央留白供合作邀請文字使用",
  },
];

export function getImagesBySection(section: string) {
  return HOME_IMAGES.filter((img) => img.section === section);
}

export function getImageById(id: string) {
  return HOME_IMAGES.find((img) => img.id === id);
}
