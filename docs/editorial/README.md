# HUAYI Editorial 2.0｜知識文章交付規格

> 正式規範來源：[Notion Editorial 2.0 母版 v1.0](https://app.notion.com/p/41092c7ccc9e8177bf5fc48bb4a669e2)
> SEO/AEO/GEO 規範：[Huayi SEO/AEO Article Standard](https://app.notion.com/p/3e892c7ccc9e811396ade144a83a835c)
> 視覺規範：[Huayi Design System](https://app.notion.com/p/3c692c7ccc9e81b3ad95d48960178b0e)

## 優先順序

1. **AI OS 治理 / Human Gate** — Adam 最終審核
2. **SEO/AEO/GEO Article Standard** — 內容規範（Active）
3. **Editorial 2.0 母版** — 視覺與編輯呈現
4. **Huayi Design System** — 品牌色彩、字體、間距

Editorial 2.0 是呈現層，不取代內容規範。衝突時以 SEO/AEO/GEO Standard 為準。

## 文章必備資料欄位

交給 Claude Code 的每篇文章必須包含：

| 欄位 | Supabase 對應 | 必填 |
|------|-------------|------|
| 標題（H1） | `title` | 是 |
| 網址 | `slug` | 是 |
| SEO Title | `seo_title` | 是 |
| Meta Description | `seo_description` | 是 |
| 摘要 | `excerpt` | 是 |
| 分類 | `category` | 是 |
| 作者 | `author` | 是 |
| 發布日期 | `published_at` | 是 |
| 正文 HTML | `content` | 是 |
| 封面圖 | `cover_image` | 建議 |
| OG 圖（1200×630） | `og_image` | 建議 |
| FAQ | `faq`（JSON） | 依需要 |
| 參考來源 | `sources`（JSON） | 依需要 |
| 標籤 | `tags`（Array） | 建議 |

## 可選用的內容元件

元件依文章內容選用，不強制每篇都出現。

### 核心觀點色塊（Insight）

用途：凸顯本篇最重要的一句判斷。
條件：文章有明確的核心論點時使用。
實作：在 `blog-content.tsx` 的 `EDITORIAL_EXTRAS` 中以 slug 為 key 設定 `insight` 欄位。

### 雙欄比較（Compare）

用途：兩種立場、做法或方案的對照。
條件：文章討論兩個可並列的概念時使用。
實作：在 `EDITORIAL_EXTRAS` 中設定 `compare` 欄位，含 `title` 和 `items` 陣列。

### 章節側欄導覽（Rail）

用途：桌機長文的章節跳轉。
條件：文章有 H2 時自動出現（≥1100px）。無 H2 時自動切換為置中單欄。

### FAQ

用途：常見問題展開收合。
條件：Supabase `faq` JSON 有內容時自動顯示。用原生 `<details>` 不用 JavaScript。

### 參考資料

用途：新聞、官方來源的連結清單。
條件：正文 HTML 中有 `<h3>參考資料` 或 `<h3>資料來源` 時自動分離到獨立區塊。

### CTA

用途：引導讀者至服務頁或聯絡頁。
條件：正文 HTML 中有 `<h2>你的企業` 或 `<h2>你的餐廳` 時自動分離並以深色卡片呈現。

## 圖片規格

| 項目 | 規格 |
|------|------|
| 格式 | WebP 優先 |
| 封面圖 | 1600×900（16:9） |
| OG 圖 | 1200×630 |
| 內文圖 | 寬度 1600px 以內，品質 80 |
| 存放位置 | `public/blog/{slug}/` |
| 載入方式 | 原生 `<img>`（不走 Vercel Image Optimization） |
| Alt | 描述實際畫面內容，不堆砌關鍵字 |
| 圖說 | `<figure>` + `<figcaption>`，緊接圖片下方 |
| 首屏 | `loading="eager"` |
| 非首屏 | `loading="lazy"` |

## SEO / Schema 規則

- 頁面只有一個 H1（從 `post.title` 渲染）
- H2/H3 語意正確，跟著內容結構
- Canonical 指向 `https://huayi.tw/blog/{slug}`
- Article + BreadcrumbList JSON-LD（由 `page.tsx` 自動產生）
- FAQ Schema（由 `page.tsx` 從 `post.faq` 自動產生）
- 正式文章禁止 `noindex`

## RWD 驗收

至少測試：360 / 390 / 430 / 768 / 1024 / 1100 / 1440px

| 項目 | 要求 |
|------|------|
| 橫向溢出 | 不允許 |
| 手機正文字級 | 16-17px |
| 桌機正文寬度 | 720-790px |
| 側欄 | ≤1024px 隱藏，≥1100px 顯示 |
| 比較區塊 | 手機自動單欄 |
| 圖片 | 保持原始比例，不裁切 |
| CTA | 足夠觸控區域 |
| FAQ | 可觸控展開收合 |

## 文章發布前檢查表

- [ ] H1 唯一
- [ ] SEO Title + Meta Description 設定
- [ ] Canonical 正確
- [ ] OG Image 設定（1200×630）
- [ ] 圖片 WebP、有 Alt 和圖說
- [ ] 參考來源保留、連結可點
- [ ] 內部連結有效（/services, /contact 等）
- [ ] FAQ 內容與文章一致
- [ ] 免責聲明（如涉及第三方品牌）
- [ ] `speak-human-tw` 語氣檢查（Testing）
- [ ] GEO Original Information Unit 或標記 Gap
- [ ] Build 通過
- [ ] 桌機 + 手機截圖
- [ ] 無橫向溢出、無破圖、無 console error
- [ ] Adam 審核通過

## ChatGPT → Claude Code 交付格式

ChatGPT 完成文章後，應提供：

```
# 文章標題
## SEO 設定
- Title / Description / Slug / Category / Tags / Date
## 正文（HTML）
- H2/H3 結構、<figure>/<figcaption>、<strong>、<a>
- 圖片位置標記 + 檔名 + Alt
## FAQ（JSON）
## 參考來源
## 圖片檔案（WebP）
## Claude Code 上稿注意事項
```

Claude Code 收到後：
1. 圖片放入 `public/blog/{slug}/`
2. INSERT 或 UPDATE `blog_posts` 表
3. Build + RWD 測試
4. 提供 Preview + 截圖
5. 等待 Adam 核准後合併
