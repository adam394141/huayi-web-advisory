# 第二網站視覺優化｜2026-09-12

## 邊界

- 基底：0a490fd73cb07106a5ef743d4ff6b5dad8c57fae，第二網站 huayi-web-advisory。
- 分支：fix/advisory-visual-polish；保留九區塊順序、品牌黃、暖白、深色 AI 區、字體家族、圓角架構。
- 不變更第一網站、ADS、講師頁、正式部署、DNS、資料庫與 Storage；內容仍只以 anon SELECT / Storage list 讀取。
- 第一網站觀測 HEAD：327206f7e45c056e47905257f3bad023b0c7de6e；既有 2 個修改檔與 2 個未追蹤檔原樣保留。既有 tracked diff SHA256 前後均 6b16b7c2b787dd075f076b630e488289b8f2a1256141b2e8bbb5e38088fb493c。

## 採用 Skill 與決策

這些 Notion 記錄部分為 Testing / Concept，只有規則摘要，並非全部有可執行 SKILL.md。此輪採用可確認且相容的規則，不聲稱已安裝或執行技能庫所有工具。

| 來源 | 本輪落地 |
| --- | --- |
| [Huayi Design System](https://www.notion.so/3c692c7ccc9e81b3ad95d48960178b0e) | 保留品牌顧問方向，不引進另一套 SaaS / dashboard 版型 |
| [Typography Intelligence](https://www.notion.so/3b792c7ccc9e812e8748c5d3145fd40c) | 沿用既有 Noto Serif TC / Noto Sans TC；不新增未確認授權字型 |
| [typography-semantic-roles](https://www.notion.so/3d692c7ccc9e8151907fde8eff6f8aea) | 標題宋體、操作／內文黑體；小標不再 10–11px，正文提高可讀性 |
| [visual-rhythm-system](https://www.notion.so/3d692c7ccc9e81468348ed402f197bd5) | 手機首圖 4:3、桌面 21:9；主次層级、留白、950ms 進場 |
| [machine-readable-design-system](https://www.notion.so/3d692c7ccc9e8176a8eacb607357733f) | 延用 globals.css canonical tokens 與 home-images.ts 圖片清單 |
| [design-decision-manifest](https://www.notion.so/3d692c7ccc9e8184ab49f87e08c887d7) | 本文件記錄不變項、圖片角色、已知缺口 |
| [frontend-aesthetic-benchmark](https://www.notion.so/3d992c7ccc9e81e5b9cece9eb435102e) | 真圖取代無意義 Placeholder、保持已核准 Design DNA |
| [Visual QA Gate](https://www.notion.so/3b792c7ccc9e81369f19f768c689c26e) | Build / Type / lint 與瀏覽器視覺驗收分開，不以宣告等同部署 |

圖表、報表、README 等非此輪介面任務所需規則未混入網站；不重複建立 Typography Workflow、不複製付費模板資產。

## 修改

- Header / Footer / favicon 使用既有華翼 SVG 圖形，不用文字冒充 Logo。
- 首頁 Logo 等待載入後再播放：900ms 顯現、至 2 秒開始淡出、2.8 秒結束。取消 session 靜默跳過；提供略過／重播。
- Reduced motion 預設仍尊重系統。訪客可主動按「播放完整動態」，亦可切回「減少動態」。
- 首頁大圖原 11 位置僅 1 個實際來源，現 10 個有素材、1 個 Rosie 正式肖像待補。
- 新素材只在第二網站：三張 AI 情境圖、一張既有 Adam 肖像、一份原生 SVG 方法示意。
- Homepage Works 的 fill 容器加上 relative，作品卡移除放大截邊；維持 contain。
- 圖片最佳化逾時或錯誤可回退原始圖片；真正原圖失效才顯示錯誤說明。
- 共用 SectionHeader / ScrollReveal 清楚分工，首頁與內頁字級一致改善；沒有改寫 Works / Blog 原文。

## 素材來源

- public/brand/huayi-logo.svg：唯讀複用第一網站 public/huayi-logo.svg，未重繪 Logo。
- public/home/adam.jpg：唯讀複用第一網站 public/adam/adam-professional.jpg。
- public/home/strategy.png、ai.png、marketing.png：內建 imagegen 生成，均為概念情境而非客戶紀錄；參見 image-prompts-2026-09-12.md。
- public/home/method.svg：依既有「診斷→策略→執行」用原生 SVG 製作，不含新增業績事實。
- AI 圖片是 Preview 素材，尚待 Adam 視覺核准；home-images 的 final 指已替換空位，不代表正式發布核准。
- Rosie 尚未取得確認肖像，因此以 R 識別與「正式肖像待補」呈現，不以假照片冒充本人。

## 驗證紀錄（部署前）

- 最終 TypeScript / Next.js build 與 ESLint 通過。
- 唯讀稽核：19 筆作品；167 個公開圖片 HEAD 檢查均成功且為 image MIME。
- 375px：首頁、about、services、works、blog、contact、高大牧場 LINE 內頁水平溢出均 0。
- 768 / 1440px：首頁水平溢出 0。
- 實測 reduce → 按播放 → force / reveal → done → 減少動態 → reduce。
- 手機高大牧場 LINE 內頁具備完整 8 圖元素（hero + 7 gallery）、上下皆有返回作品列表。
- 本機 1440px 測試曾觀測最佳化圖片請求卡住，因此新增原圖回退；需在最終 Preview 重驗。
- qa/ 截圖為本機 evidence，不是部署驗收；發布前需另看 Preview。

## 尚未通過的正式站 Gate

- Rosie 肖像待補、AI 概念圖需 Adam 視覺確認。
- Contact 原本仍是 Preview 假送出：不寫 DB、不寄信。
- 跨 Safari 真機測試、全頁最終視覺認可與正式網域切換不在本輪自動發布範圍。
- 此輪無 merge main、無 production deploy、無 DNS 變更。
