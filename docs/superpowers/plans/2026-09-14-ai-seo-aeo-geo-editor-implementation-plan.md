# 華翼後台 AI SEO／AEO／GEO 文章優化系統實作計畫

- 日期：2026-09-14
- 依據：[AI SEO／AEO／GEO 文章優化系統規格](../specs/2026-09-14-ai-seo-aeo-geo-editor-design.md)
- 狀態：Adam 已於 2026-09-15 確認，實作中
- 實作模型：gpt-5.6-sol，推理強度 high
- 變更範圍：Advisory 新官網的「觀點」後台與文章前台
- 部署原則：只建立 Preview；不得合併 main、不得修改正式 DNS

## 0. 完成定義

本階段完成時，Adam 可以在華翼後台：

1. 新增或開啟一篇「觀點」草稿。
2. 貼入自己的原始文章、事實素材及圖片。
3. 按一次「AI 優化」，讓系統產生 SEO／AEO／GEO 版本。
4. 在左右對照畫面確認改寫、標題、摘要、FAQ、標籤、圖片替代文字與內部連結建議。
5. 看見所有可能新增事實、缺少資料及技術檢核結果。
6. 只選擇接受的項目；未確認前不得覆蓋原稿或公開發布。
7. 通過發布檢查後人工發布，並可查看或還原舊版本。

同時，公開文章頁具有 canonical、Open Graph、Article／Breadcrumb 結構化資料、sitemap、robots 與舊網址 301 轉址等必要技術基礎。

## 1. 硬性邊界

- 只改 Advisory 新官網專案，不碰 ASP 舊官網。
- 不修改第一網站、`/adam`、`/adam_cpc`、ADS、Cloudflare 或正式網域設定。
- 第一階段只接 `blog_posts`；作品後台只做回歸測試，不加入 AI 改寫。
- 不直接把外部 Python CLI 或 WordPress 外掛塞進 Next.js。
- AI 不得新增原文沒有的客戶、成果、數字、日期、報價、經歷、引用與案例。
- AI 金鑰只存在 Vercel 伺服器環境，瀏覽器與資料庫紀錄都不可出現完整金鑰。
- 所有寫入仍須通過 Supabase Auth、MFA、管理員 UUID allowlist、RLS 與資料庫函式。
- 非正式環境一律 `noindex`，避免 Preview 被搜尋引擎收錄。

## 2. 實作策略

採用「既有輕型 CMS + 伺服器 AI 任務」：保留目前 Next.js、Supabase、Vercel 架構，不導入另一套 CMS。

AI 任務以資料庫留下狀態與輸入／輸出快照。API 先回傳任務編號，再由 Next.js `after()` 在回應後處理，管理畫面短暫輪詢任務狀態。這能避免使用者一直停在「儲存中」，也不需要第一階段就新增昂貴的訊息佇列。

限制：`after()` 不是永久佇列。若 Vercel 執行個體在處理途中終止，任務可能逾時。介面會把超過期限的任務標成可重試；如果未來文章量或同時使用人數明顯增加，再把相同的 job processor 換成 durable workflow，不重寫編輯器。

## 3. 逐步實作

### 階段 A：基線、測試與資料庫預檢

**目標：先證明現有功能與資料邊界，避免 AI 功能造成舊後台回歸。**

1. 記錄目前 Preview、分支、commit、Supabase project ref 與已知警告。
2. 執行現有 lint、build、單元測試；保存尚未修改前的結果。
3. 檢查 `blog_posts`、`content_revisions`、管理員 allowlist、MFA 與 RLS 實際狀態。
4. 建立 AI 功能的測試 fixture，只使用虛構文章，不修改現有華翼文章。
5. 補上失敗案例測試：未登入、非管理員、無 MFA、過期 `updated_at`、惡意 HTML。

**涉及檔案**

- `docs/cms-database-preflight.sql`
- `docs/cms-db-verification-2026-09-13.md`
- 新增 `docs/ai-content-database-preflight.sql`
- 新增對應測試檔

**驗收**

- 既有作品與觀點列表、編輯、封面上傳、內文圖片、儲存與前台預覽皆可用。
- 測試 fixture 不會出現在公開前台。
- 發現資料庫欄位或政策不符時先停在此階段，不猜測 schema。

### 階段 B：資料表、稽核與安全 RPC

**目標：所有 AI 工作與發布動作都可追查、可還原。**

新增 migration SQL，內容至少包含：

1. `content_ai_runs`
   - `id`、`content_type`、`content_id`、`requested_by`
   - `status`：`pending | running | needs_review | completed | failed`
   - `input_snapshot`、`fact_ledger`、`output_snapshot`
   - `prompt_version`、`model`、`input_hash`
   - `error_code`、`error_message`
   - provider 回傳的 token 使用量（有資料才記）
   - `created_at`、`started_at`、`completed_at`
2. `content_versions`
   - 保存每次套用 AI、人工修改與發布前後的完整快照。
   - 不保存密碼、session、API key 或不可逆敏感資料。
3. `content_redirects`
   - 保存文章 slug 變更前後路徑，供 301 使用。
4. `blog_posts` 補充欄位
   - `tags text[]`
   - `ai_summary text`
   - `faq jsonb`
   - `reviewed_at`、`reviewed_by`
   - 必要的 SEO 欄位與索引；已存在欄位不得重建或丟資料。

新增 security-definer RPC：

- `cms_create_blog_post`
- `cms_start_ai_run`
- `cms_claim_ai_run`
- `cms_complete_ai_run`
- `cms_fail_ai_run`
- `cms_apply_ai_result`
- `cms_publish_blog_post`
- `cms_restore_content_version`

每個 RPC 都必須檢查 `auth.uid()`、`aal2`、管理員 UUID、內容型別、狀態轉換與 optimistic lock。AI 任務限制每位管理員每小時 5 次、每日 20 次；相同文章、輸入雜湊與 prompt 版本已有成功結果時直接提示可重用，不重複呼叫模型。

**涉及檔案**

- 新增 `docs/ai-content-schema.sql`
- 新增 `docs/ai-content-verification.sql`
- 更新 `docs/cms-admin-update-function.sql`（僅追加相容函式，不破壞既有 RPC）

**驗收**

- anon 與一般已登入使用者無法讀取或寫入 AI 稽核資料。
- 管理員未完成 MFA 時所有新 RPC 都拒絕。
- 同一筆文章同時編輯時，較舊版本收到衝突而非覆蓋新資料。
- 還原版本會再產生一筆稽核紀錄，不刪除歷史。

### 階段 C：文章新增與版本操作

**目標：補齊真正可用的文章生命週期，再接 AI。**

1. 在管理首頁增加「新增觀點文章」。
2. 新文章預設為 `draft`，slug 只接受英文小寫、數字與連字號。
3. slug 重複時即時顯示錯誤，不靜默覆蓋。
4. 編輯頁增加版本紀錄入口，顯示修改者、時間、來源（人工／AI／發布／還原）。
5. 還原前顯示差異與二次確認。

**涉及檔案**

- `src/app/api/cms/route.ts`
- `src/app/admin/admin-console.tsx`
- 新增 `src/app/admin/article-editor.tsx`
- 新增 `src/app/admin/content-version-panel.tsx`
- `src/lib/cms-update.ts`
- 新增 `src/lib/content-version.ts`

**驗收**

- 可新增草稿、儲存、重新整理後再開啟。
- 不合法或重複 slug 無法送出。
- 版本可預覽及還原；作品編輯流程不受影響。

### 階段 D：AI provider、固定輸出與事實護欄

**目標：模型可以改寫，但輸出必須可解析、可檢查、不可直接發布。**

1. 新增 server-only provider adapter，第一個 provider 使用 OpenAI。
2. 使用環境變數：
   - `CONTENT_AI_ENABLED`
   - `OPENAI_API_KEY`
   - `CONTENT_AI_MODEL`
   - `CONTENT_AI_PROMPT_VERSION`
3. 未設定或停用時，後台顯示「AI 優化尚未啟用」，按鈕不可操作；不得 fallback 到瀏覽器金鑰或固定金鑰。
4. 輸入限制：文章與素材總長度、圖片數量、單次輸出上限皆在伺服器驗證。
5. 原始素材包在明確資料邊界中；任何素材內的指令都只當內容，不得改變 system rules。
6. 使用固定 JSON schema，至少回傳：
   - `fact_ledger`
   - `article`
   - `seo`
   - `aeo`
   - `geo`
   - `internal_links`
   - `image_alt_suggestions`
   - `human_review_notes`
   - `blocking_issues`
7. 模型不得輸出任意可執行 HTML。文章先輸出結構化內容區塊，再由伺服器用 allowlist 轉成安全 HTML。
8. 模型回傳不符合 schema 時，只允許一次格式修復；仍失敗就標記 `failed`，不無限重試。
9. 伺服器比對原文與結果中的數字、百分比、金額、日期、網址、引用與命名實體；新出現的精確事實一律列為 blocker 或人工確認，不自動套用。

**涉及檔案**

- 新增 `src/lib/content-ai/provider.ts`
- 新增 `src/lib/content-ai/openai-provider.ts`
- 新增 `src/lib/content-ai/schema.ts`
- 新增 `src/lib/content-ai/prompt.ts`
- 新增 `src/lib/content-ai/fact-guard.ts`
- 新增 `src/lib/content-ai/render-safe-html.ts`
- 更新 `package.json`（只加入必要且鎖版的 server-side 套件）
- 更新第三方授權聲明，註明 `mars-tw/open-seo-advisor-skill` 與 Apache-2.0

**驗收**

- 用含假指令、惡意 HTML、虛構數字誘惑的測試素材，AI 不能繞過規則。
- JSON 不完整、provider 逾時、限流與設定缺失都有中文可理解錯誤。
- 測試 log 不包含 API key、完整 JWT 或文章中的非必要私密素材。

### 階段 E：非同步 AI API 與狀態恢復

**目標：避免頁面一直卡在「處理中」，並提供安全重試。**

建立 API：

- `POST /api/cms/ai-optimize`：驗證管理員、建立 pending job、回傳 `202 + jobId`，再以 `after()` 啟動處理。
- `GET /api/cms/ai-optimize/[jobId]`：只允許建立者或同一管理員群組讀取狀態與結果。
- `POST /api/cms/ai-optimize/[jobId]/retry`：只允許 failed 或超時任務建立新 job，不覆寫舊 job。

API route 設定合理的 `maxDuration`，provider 本身另設較短 timeout。所有例外都在 `catch/finally` 更新 job；執行個體意外中止造成的 stale job，由介面顯示「已逾時，可重試」。不使用高頻輪詢：前幾次 2 秒，之後逐步退避，頁面切到背景時暫停。

**涉及檔案**

- 新增 `src/app/api/cms/ai-optimize/route.ts`
- 新增 `src/app/api/cms/ai-optimize/[jobId]/route.ts`
- 新增 `src/app/api/cms/ai-optimize/[jobId]/retry/route.ts`
- 新增 `src/lib/content-ai/job-processor.ts`
- `src/lib/admin-auth.ts`

**驗收**

- 開始 AI 工作後立即回到可操作狀態，不出現長時間鎖死的儲存按鈕。
- 重整或重開頁面仍能看到進行中／完成／失敗狀態。
- 快速連點只建立一個有效任務。
- provider 錯誤不影響一般文章儲存。

### 階段 F：AI 審核介面

**目標：Adam 看得懂、能選擇，不需要理解 SEO 術語。**

編輯器新增「AI 優化」區域：

1. 原始素材欄位：可貼文章、訪談筆記與真實資料；只存入受保護的 run snapshot。
2. 開始前顯示本次模型與「不新增事實」規則。
3. 結果分為：
   - 文章改寫對照
   - 搜尋標題與描述
   - 問答摘要（AEO）
   - 實體、作者與來源完整度（GEO）
   - 標籤、圖片替代文字與站內連結
   - 必須人工確認的事實
4. 每項可個別接受；另有「全部接受非阻擋項目」。
5. 有 blocker 時禁用「套用全部」與「發布」。
6. 套用結果前保存版本；套用後仍只是一筆草稿。
7. 完成通知包含「開啟前台預覽」，以真正 slug 產生網址。

**涉及檔案**

- 新增 `src/app/admin/ai-optimization-panel.tsx`
- 新增 `src/app/admin/ai-review-diff.tsx`
- 新增 `src/app/admin/ai-checklist.tsx`
- `src/app/admin/article-editor.tsx`
- `src/app/admin/admin-console.tsx`

**驗收**

- 1440px 桌機、768px 平板與 390px 手機可操作。
- 鍵盤可完成所有動作，狀態不只靠顏色表示。
- AI 結果不能在未按「套用」時改動資料庫文章。
- 前台預覽不再因中文 slug 或錯誤 slug 產生 404。

### 階段 G：發布閘門與技術 SEO

**目標：把 AI 建議轉成可驗證的公開頁面品質。**

1. 將「發布」從一般狀態下拉選單拆成獨立確認流程。
2. 發布前以 deterministic checklist 檢查：
   - 標題、摘要、slug、正文與封面齊全
   - SEO title／description 長度合理
   - canonical 唯一
   - H1 僅一個、標題層級合理
   - 圖片有替代文字且無失效來源
   - FAQ 顯示內容與結構化資料一致
   - Article／Breadcrumb／Organization JSON-LD 可解析
   - AI blocker 已處理
3. 補齊 `metadataBase`、canonical、Open Graph、Twitter card、發布／更新時間。
4. 新增 `sitemap.ts` 與 `robots.ts`；Preview 與 Development 全站 `noindex`，Production 才允許索引。
5. slug 變更時保存舊路徑；文章頁找不到 slug 時查 `content_redirects` 並執行永久轉址。
6. 結構化資料只使用文章與站點已有事實，不把 AI 推測寫入 schema。

**涉及檔案**

- `src/app/layout.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/blog/[slug]/blog-content.tsx`
- 新增 `src/app/sitemap.ts`
- 新增 `src/app/robots.ts`
- 新增 `src/lib/site-url.ts`
- 新增 `src/lib/content-seo.ts`
- 新增 `src/lib/content-redirect.ts`
- `src/app/admin/article-editor.tsx`

**驗收**

- Preview 原始碼及 robots 都明確 noindex。
- 已發布文章的 metadata 與 JSON-LD 通過自動測試。
- 改 slug 後舊文章網址回 301 並到新網址。
- 未發布文章不進 sitemap。
- 沒有 FAQ 就不輸出 FAQ 結構化資料。

### 階段 H：效能、成本與 Supabase CPU 保護

**目標：避免再次出現不必要的 CPU 高用量。**

1. 列表查詢只取需要欄位，不在每次 render 下載全文與 AI 快照。
2. AI 狀態輪詢採退避、頁面背景暫停、完成立即停止。
3. 為 `content_ai_runs(content_id, created_at)`、status 與 redirect path 建必要索引。
4. 避免在 middleware／proxy 每次請求查 Supabase；轉址只在文章查無資料時查一次。
5. 重用相同 input hash 的成功結果，減少模型成本與資料庫寫入。
6. 圖片沿用現有 WebP 與保留原圖流程，不讓 AI 重複壓縮或重複上傳。
7. 在 Vercel 與 Supabase 觀察 Preview QA 期間的函式時間、錯誤率、慢查詢與 CPU。

**驗收**

- 一次 AI 工作只有必要的狀態查詢，完成後歸零。
- 一般前台瀏覽不讀 `content_ai_runs` 或 `content_versions`。
- CPU／慢查詢異常有可定位的 request/job id，但不記錄敏感內容。

### 階段 I：完整 QA、Preview 與交接

**自動檢查**

- lint
- production build
- 單元測試：schema、事實護欄、安全 HTML、SEO checklist、URL／slug
- API 測試：Auth、MFA、限流、重複 job、逾時、衝突、發布 gate
- 瀏覽器測試：新增草稿 → 上傳圖片 → AI 優化 → 選擇接受 → 儲存 → 預覽 → 發布 gate → 版本還原

**人工檢查**

- Safari 與 Chrome
- 桌機、平板、手機
- 圖片載入、圓角、不裁字、正文插圖順序
- 導覽、cookie、作品頁、觀點頁與後台既有功能回歸
- Preview 不被搜尋引擎索引

**交付物**

- Migration SQL 與驗證 SQL
- 環境變數清單（只列變數名，不寫值）
- 操作說明：如何提供素材、審核、發布、還原
- 安全與成本說明
- commit、PR、Preview、QA 結果與已知缺口
- Notion「華翼新官網｜品牌與講師頁」只回寫本輪 delta、evidence 與下一步，不貼長 log

## 4. Commit 切分

每個階段獨立 commit，方便回退：

1. `補齊AI文章系統資料庫與安全驗證`
2. `新增觀點草稿與版本還原功能`
3. `建立AI內容優化伺服器與事實護欄`
4. `新增AI審核與選擇套用介面`
5. `補齊發布閘門與技術SEO`
6. `完成效能保護與Preview QA`

任何階段測試不通過，不進入下一個 commit；不以一個巨大 commit 混合資料庫、安全、UI 與 SEO。

## 5. 回退方式

- 程式：逐階段 revert，不動 main。
- 功能：將 `CONTENT_AI_ENABLED=false`，一般 CMS 仍可使用。
- 資料：新表與新欄位保留但不公開讀取；禁止以 drop table 作為第一回退手段。
- 文章：以 `content_versions` 還原，不以部署回退代替內容復原。
- Preview：若 AI 失敗，保留錯誤 job 供查證，不把半成品寫入公開文章。

## 6. 需要 Adam 在實作前確認的唯一事項

確認本計畫後即可開始。實作會使用 **SOL + high**；只有遇到內容策略或介面方向需要重新發想時，才切換 Astra。AI provider 的實際模型名稱不寫死在程式碼，部署時由 `CONTENT_AI_MODEL` 決定。
