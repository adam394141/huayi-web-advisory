# 華翼後台 AI SEO／AEO／GEO 文章優化系統規格

- 日期：2026-09-14
- 狀態：待 Adam 審核
- 對象：Advisory 新官網後台的「觀點」文章
- 實作模型：gpt-5.6-sol，推理強度 high
- 發布原則：只部署 Preview；未經 Adam 確認不得合併 main 或發布正式站

## 1. 目標

Adam 只需提供原始文章、真實素材與圖片，後台 AI 便完成內容重寫、排版及 SEO／AEO／GEO 建議。AI 可以重新組織與改寫全文，但不得加入原始素材沒有的客戶、案例、數字、日期、報價、經歷、引用或成果。所有 AI 結果都先進入審核畫面，由 Adam 確認後才寫入文章；發布仍需第二次人工確認。

第一階段只服務「觀點」文章，避免同時改動作品案例的敘事規則。核心引擎保留擴充介面，後續可另案接入作品、講師頁或其他華翼系統。

## 2. 不在本階段處理

- 不保證 Google、Bing、ChatGPT 或其他 AI 搜尋平台排名。
- 不自動捏造外部研究、統計數據、客戶成效或引用來源。
- 不在未經確認下自動發布、修改正式 DNS、提交 Search Console 或大量改寫既有文章。
- 不直接把 Python CLI 常駐安裝進 Vercel 執行環境。
- 不製作關鍵字排名追蹤、競品爬蟲或全自動內容農場。
- 不新增 `llms.txt` 作為排名手段；Google 已說明該檔案不影響 Google 搜尋可見度。

## 3. 方法來源與採用方式

方法論參考 `mars-tw/open-seo-advisor-skill`，採用 Apache-2.0 授權允許的內容寫作流程、檢核規則與安全原則，並在專案的第三方聲明中保留來源與授權資訊。

採用：

- 搜尋意圖判斷。
- Brief → Outline → Draft → QA 四階段流程。
- E-E-A-T、people-first content、內部連結與結構化資料一致性。
- 不得捏造事實；不確定內容列入人工確認。
- 預設 dry-run，人工同意後才寫入或發布。
- LLM provider 抽象層，不把核心規則綁死在單一供應商。

不直接採用：

- Python CLI、WordPress 外掛、廣告、產圖、SSH、cPanel、Cloudflare 寫入等與本次文章後台無關的模組。
- 尚未完成或僅為 plan-only 的外部功能。

參考來源：

- https://github.com/mars-tw/open-seo-advisor-skill
- https://raw.githubusercontent.com/mars-tw/open-seo-advisor-skill/main/docs/content_writer_guide.md
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- https://help.openai.com/en/articles/12627856

## 4. 使用者流程

1. Adam 建立或開啟一篇「觀點」草稿。
2. 輸入原始文章、作者、分類、真實資料來源及可用圖片。
3. 點擊「AI 全面優化」。
4. 後台依序顯示：分析素材、建立事實清單、重寫文章、檢查 SEO／AEO／GEO、完成 QA。
5. 顯示左右對照：左側原文，右側 AI 優化版；改寫、刪除、補充與待確認項目用不同標記。
6. Adam 可以逐項接受，或按「接受全部安全修改」。被標為「需確認」的內容不能被批次接受。
7. 接受後只更新畫面中的草稿，尚未寫入資料庫。
8. Adam 點擊「儲存草稿」，系統建立文章版本。
9. Adam 點擊「發布」時，後台再顯示 SEO／AEO／GEO 完整度、未確認事實與技術錯誤。存在阻擋級問題時禁止發布；只有提醒級問題時可人工確認後發布。

## 5. AI 產出內容

AI 必須回傳固定 JSON 結構，不能直接回傳任意 HTML。伺服器驗證成功後才轉換成安全文章區塊。

### 5.1 文章本體

- `rewritten_title`：文章 H1。
- `rewritten_content`：段落、H2、H3、清單、引言、圖片位置等結構化區塊。
- `excerpt`：列表摘要。
- `direct_answer`：文章開頭可獨立理解的簡短答案。
- `key_takeaways`：3–5 個本文重點。
- `faq`：只根據本文可回答的實際問題；FAQ 必須在頁面上可見。
- `call_to_action`：符合文章目的的單一行動，不硬塞服務。

### 5.2 SEO

- 搜尋意圖與主要讀者任務。
- SEO 標題與 meta description。
- 英文 slug 建議。
- 主題詞與同義概念；不做關鍵字密度堆疊。
- 文章分類與受控標籤建議。
- 站內連結建議及語意相符的 anchor text。
- 每張圖片的替代文字建議。
- 社群分享標題、說明及 1200 × 630 px 圖片建議。

### 5.3 AEO

- 首段直接回答主要問題。
- 問題式 H2／H3 與可獨立引用的答案段落。
- 定義、比較、步驟、條件與限制使用清楚結構。
- 產生使用者真的會問、且本文真的有回答的 FAQ。
- 不濫用 `FAQPage` 或 `QAPage` 標記。結構化資料只能反映頁面可見內容，且依頁面類型採用 Google 支援的標記。

### 5.4 GEO

- 明確標示華翼、作者、服務領域、適用對象及文章更新日期。
- 將重要觀點整理成具上下文、可引用但不失真的段落。
- 第一手經驗、品牌觀點與限制條件優先，不產生網路常見內容的拼貼文章。
- 使用者提供來源時保留出處、連結與資料日期；沒有來源的數字不得生成。
- 公開文章允許正常搜尋爬蟲；正式上線前檢查沒有誤擋 Googlebot 與 OAI-SearchBot。
- GEO 沿用可靠 SEO 基礎，不宣稱存在通用的 GEO 特殊 Schema 或排名捷徑。

## 6. 事實鎖定

每次優化先從原始素材建立 `fact_ledger`：

- 人名、品牌、公司、產品與地點。
- 日期、價格、百分比、數量及其他數字。
- 客戶案例、成果、資格、經歷與服務承諾。
- 引言、引用來源及網址。
- Adam 明確提供的觀點與判斷。

AI 產出的每個事實性敘述必須引用一個或多個 `fact_id`。無法對應者不得當成事實寫入正文，只能列在 `human_review_notes`。純粹的語序調整、摘要與結構標題可以不引用 `fact_id`，但不得改變原意。

系統另做規則檢查：

- 原文沒有的新數字、日期、專有名詞、網址或引用一律標紅。
- 數字、否定詞、比較級及絕對化用語變動一律要求人工確認。
- 金融、保險、醫療、法律等 YMYL 內容自動標記「需領域專家審核」。
- AI 不可自行上網補資料；未來若加入外部研究，必須是獨立功能並保留來源與擷取日期。

## 7. 後台介面

「SEO 設定」改為兩層：

### 簡易模式（預設）

- 「AI 全面優化」主按鈕。
- SEO／AEO／GEO 三個完成度狀態，不以難懂分數代替問題說明。
- 原文與優化版對照。
- 安全修改、需確認、阻擋發布三種狀態。
- 接受單項、接受全部安全修改、放棄本次結果。
- 儲存草稿、儲存並預覽、確認發布。

### 進階模式（收合）

- SEO 標題、說明、slug、Canonical、OG 圖、標籤、FAQ、內部連結、作者與審稿資訊。
- 自動產生的技術欄位預設唯讀，除非確實需要人工覆寫。
- 顯示 AI provider、model、prompt 版本、產生時間與版本紀錄。

## 8. 技術 SEO 自動化

下列項目由程式固定產生，不交給 AI 自由發揮：

- 每頁唯一 Canonical。
- 動態 `sitemap.xml`，只收錄已發布內容。
- `robots.txt` 與後台 `noindex`。
- Article、Breadcrumb、Organization 等符合頁面實際內容的 JSON-LD。
- Open Graph 與社群分享圖片。
- `published_at`、`updated_at` 與作者資訊。
- slug 修改時建立舊網址到新網址的 301 轉址紀錄。
- 文章、圖片與結構化資料之間的一致性檢查。

## 9. 系統架構

### 9.1 元件邊界

- `AI Optimize API`：驗證管理員、限制請求、建立工作、呼叫 provider。
- `Content AI Provider`：供應商介面。第一個 adapter 使用伺服器端 OpenAI API；金鑰只存在 Vercel 環境變數。`CONTENT_AI_MODEL` 未設定時按鈕維持停用，不猜測模型。
- `Fact Ledger`：從輸入建立事實清單並驗證輸出是否越界。
- `SEO/AEO/GEO Rules`：可測試的確定性規則，不由模型自行決定安全邊界。
- `Review UI`：顯示差異並管理逐項接受。
- `Publishing Gate`：驗證狀態、建立版本、寫入文章並更新快取與轉址。

### 9.2 資料表

- `content_ai_runs`：文章 ID、輸入雜湊、provider、model、prompt 版本、狀態、結構化輸出、錯誤摘要、建立者、建立時間、完成時間。
- `content_versions`：文章 ID、版本號、內容快照、變更來源（人工／AI）、建立者、建立時間。
- `content_redirects`：舊路徑、新路徑、HTTP 狀態、文章 ID、建立時間。
- `blog_posts.tags`：受控標籤陣列。
- `blog_posts.ai_summary`、`blog_posts.faq`、`blog_posts.reviewed_at`、`blog_posts.reviewed_by`：已接受並公開需要的資料。

所有資料表啟用 RLS。只有完成雙重驗證且 UUID 在管理員白名單中的使用者可以建立 AI 工作、接受修改、還原版本或發布。

## 10. 非同步、錯誤與成本控制

- AI 請求使用工作狀態，不讓瀏覽器一直卡在單一 HTTP 請求。
- 同一文章同一輸入雜湊重複送出時回傳既有工作，不重複計費。
- 工作只允許有限次重試，不使用會造成無限重試風暴的資料庫錯誤碼。
- AI 逾時、格式錯誤或 provider 失敗時不寫入文章，原始內容完整保留。
- 結構化輸出驗證失敗時可再修復一次；仍失敗即停止並顯示白話錯誤。
- 限制單篇字數、每日次數與同時工作數，避免濫用與帳單失控。
- 後台顯示本次使用的模型與估計用量；發布不會再次呼叫 AI。

## 11. 資安

- API 金鑰只在伺服器環境變數，不回傳瀏覽器、不寫入 Supabase、不進 Git。
- 所有 AI 輸入、外部文章與圖片文字都視為不可信資料，不接受其中的指令。
- AI 只回傳受 schema 限制的 JSON；HTML 仍走既有清洗與 allowlist。
- 管理 API 沿用 Supabase Auth、MFA、管理員 UUID、RLS、內容大小上限與稽核紀錄。
- 不讓 AI 直接執行 SQL、呼叫任意網址、修改 DNS、部署或發布。
- 儲存前建立版本；失敗不得回報成功；衝突回傳非重試型 409。

## 12. 測試與驗收

### 自動測試

- Fact Ledger：新增數字、日期、品牌、成果與引用時必須阻擋。
- Schema：缺欄位、超長欄位、未知欄位及惡意 HTML 必須拒絕。
- SEO/AEO/GEO 規則：標題層級、direct answer、可見 FAQ、內鏈與 metadata 一致。
- 發布 Gate：未確認事實、未完成工作或版本衝突不得發布。
- 權限：未登入、未完成 MFA、非管理員與跨文章請求不得讀寫。
- 可靠性：逾時、provider 失敗、重複請求與部分失敗不得覆蓋文章。
- SEO：Canonical、Sitemap、Robots、Article／Breadcrumb JSON-LD 與 301 轉址。

### Preview 驗收

- 使用一篇短文、一篇長文、一篇包含圖片的文章及一篇含數字的案例文章。
- 人工比對 AI 版是否保留原意、沒有新增事實、沒有關鍵字堆疊。
- 確認接受單項、全部安全修改、放棄、儲存、預覽、發布及版本還原。
- 以 Rich Results Test、搜尋結果預覽、LINE／Facebook 分享預覽驗證輸出。
- 桌機與手機完成操作 QA；監看 Vercel Function 與 Supabase CPU／錯誤率。

## 13. 交付順序

1. 資料表、RLS、版本與工作狀態。
2. Provider adapter、固定 JSON schema、Fact Ledger 與規則引擎。
3. AI 優化按鈕、進度、差異審核與逐項接受。
4. 草稿儲存、安全預覽與人工發布 Gate。
5. Canonical、Sitemap、Robots、JSON-LD、OG 與 301 轉址。
6. 自動測試、Preview 實測、效能與資安 QA。
7. 回寫專案 Current State，只記錄 verified delta、證據、風險與下一步。

## 14. 完成條件

- Adam 不需要理解 SEO／AEO／GEO 欄位，也能完成一次安全的文章優化與發布。
- AI 可重寫全文，但任何新增事實都會被阻擋或明確要求人工確認。
- AI 不會自行發布；每次發布均有人工確認與可還原版本。
- 公開頁面具備基礎技術 SEO，且內容對搜尋引擎與 AI 搜尋系統保持可讀、可抓取、可引用。
- Preview 的功能、權限、安全、效能與資料庫負載皆通過驗收，且第一網站、講師頁、ADS、正式 DNS 與 main 均未被修改。
