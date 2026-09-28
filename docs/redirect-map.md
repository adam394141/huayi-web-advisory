# 華翼舊站 → 新站轉址對照表

> 搬站時設定 301 永久轉址，保留 SEO 權重
> 舊站技術：ASP 動態頁面（e7way 製作）
> 新站技術：Next.js App Router（Vercel）
> 建立日期：2026-09-28

## 主要頁面

| 舊站路徑 | 新站路徑 | 說明 |
|----------|----------|------|
| `/` | `/` | 首頁 |
| `/intro.asp` | `/about` | 關於華翼 |
| `/product-list.asp` | `/works` | 精選案例（作品列表） |
| `/article-list.asp` | `/blog` | 知識新知（部落格列表） |
| `/contact.asp` | `/contact` | 聯絡我們 |
| `/online-class.asp` | `/services` | 線上課程 → 導到服務頁 |

## 作品分類頁

| 舊站路徑 | 新站路徑 | 說明 |
|----------|----------|------|
| `/product-list.asp?type=289` | `/works` | 品牌形象設計 |
| `/product-list.asp?type=290` | `/works` | 禮贈品客製化 |
| `/product-list.asp?type=291` | `/works` | 行銷社群 |

## 作品詳情頁（全部已對應）

| 舊站路徑 | 新站路徑 | 舊站名稱 |
|----------|----------|----------|
| `/product-info.asp?id=26` | `/works/fiti-program` | FITI Program 創新創業激勵計畫 |
| `/product-info.asp?id=29` | `/works/gaoda-farm-line` | 高大牧場 LINE@ |
| `/product-info.asp?id=28` | `/works/fangyun-chilu-home` | 芳雲齊魯家牛肉麵 CIS |
| `/product-info.asp?id=27` | `/works/taichung-startup-event` | 台中新創回娘家 活動主視覺 |
| `/product-info.asp?id=25` | `/works/bazhi-yoga-line` | 八肢瑜珈 LINE@ |
| `/product-info.asp?id=24` | `/works/clawson-line` | 客羅升 LINE@ |
| `/product-info.asp?id=23` | `/works/chengshi-nuts-marketing` | 誠實堅果 品牌行銷設計 |
| `/product-info.asp?id=22` | `/works/other-items` | 其他品項 |
| `/product-info.asp?id=21` | `/works/glass-cup` | 杯子/玻璃杯 |
| `/product-info.asp?id=20` | `/works/gift-box` | 手提禮盒 |
| `/product-info.asp?id=19` | `/works/packaging-box` | 包裝盒類 |
| `/product-info.asp?id=18` | `/works/paper-bag` | 手提紙袋 |

## 文章詳情頁（全部已對應）

| 舊站路徑 | 新站路徑 | 標題 |
|----------|----------|------|
| `/article-info.asp?id=24` | `/blog/ai-agent-not-human-org` | 大家都在瘋AI agent，但為什麼不該用人類組織框架限制 AI？ |
| `/article-info.asp?id=23` | `/blog/financial-decision-vs-life` | 會做財務決策的人，為什麼做不了自己的人生決策？ |
| `/article-info.asp?id=22` | `/blog/claude-design` | Claude Design |
| `/article-info.asp?id=21` | `/blog/ai-memory-migration-gemini` | AI 記憶搬去 Gemini |

## 其他路徑

| 舊站路徑 | 新站路徑 | 說明 |
|----------|----------|------|
| `/contact_updateCnt.asp?v=line` | `/contact` | LINE 諮詢入口 |
| `/contact_updateCnt.asp?v=facebookmsg` | `/contact` | Messenger 諮詢入口 |

## 實作方式

搬站時在 `next.config.ts` 加入 redirects，所有舊路徑 301 轉到新路徑：

```js
async redirects() {
  return [
    // 主要頁面
    { source: '/intro.asp', destination: '/about', permanent: true },
    { source: '/product-list.asp', destination: '/works', permanent: true },
    { source: '/article-list.asp', destination: '/blog', permanent: true },
    { source: '/contact.asp', destination: '/contact', permanent: true },
    { source: '/online-class.asp', destination: '/services', permanent: true },
    // 作品詳情
    { source: '/product-info.asp', destination: '/works/:id', permanent: true, has: [{ type: 'query', key: 'id' }] },
    // 文章詳情
    { source: '/article-info.asp', destination: '/blog/:id', permanent: true, has: [{ type: 'query', key: 'id' }] },
    // 其他
    { source: '/contact_updateCnt.asp', destination: '/contact', permanent: true },
  ];
}
```

注意：作品和文章的 query string 轉址需要用 middleware 處理 id → slug 的對應，
因為 next.config redirects 無法做動態查表。建議用一個靜態 map 在 middleware 中處理。
