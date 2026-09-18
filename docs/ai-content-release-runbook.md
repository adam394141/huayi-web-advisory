# 華翼 AI 文章優化：Preview 發布與回復手冊

## 安全邊界

- 僅套用於 Advisory 新官網及 `blog_posts`。
- 本輪只部署 Preview，不合併 `main`，不調整 Cloudflare 或正式 DNS。
- AI 模型預設直接呼叫 Gemini；金鑰只保存在 Vercel Sensitive 環境變數，不進入 Git、前端或資料庫。
- 正式啟用前，Preview 必須維持 `noindex`。

## 一次性資料庫安裝順序

在 Supabase SQL Editor 依序執行：

1. `docs/ai-content-database-preflight.sql`：唯讀檢查 owner、欄位與 RLS。
2. `docs/ai-content-schema.sql`：新增 AI 任務、內容版本、轉址與安全 RPC。
3. `docs/cms-admin-update-function.sql`：更新一般儲存規則，文章不得繞過發布閘門。
4. `docs/ai-content-verification.sql`：唯讀確認 RLS、政策、函式與索引。

任一步出錯即停止，不重複貼後續 SQL。腳本使用 transaction；失敗時不應留下半套 schema。

## Vercel Preview 環境變數

只在 Preview 環境加入或確認：

- `CMS_WRITE_ENABLED=true`
- `CONTENT_AI_ENABLED=true`
- `CONTENT_AI_PROVIDER=google`
- `GEMINI_API_KEY`：只設為 Vercel Sensitive；不得使用 `NEXT_PUBLIC_` 前綴
- `CONTENT_AI_MODEL=gemini-2.5-flash`：內容整理與結構化輸出的實作模型；Astra 僅保留策略發想
- `CONTENT_AI_PROMPT_VERSION=2026-09-15-v1`
- `SITE_CANONICAL_URL=https://huayi.tw`
- `SITE_ALLOW_INDEXING=false`

公開 Supabase 變數沿用既有專案設定。若 Gemini 暫時不可用，可將 `CONTENT_AI_PROVIDER` 與 `CONTENT_AI_MODEL` 切回 Gateway 相容值作為備援；Gateway 使用 Vercel 自動提供的 OIDC。不得把 Gemini、Gateway 或 service-role 金鑰加入前端或任何 `NEXT_PUBLIC_*` 變數。

## Preview 驗收流程

1. 以 Adam 管理員帳號登入並完成 MFA。
2. 新增一篇測試草稿；確認不會出現在公開觀點列表。
3. 貼入不含機密的測試素材，執行 AI 優化。
4. 確認頁面可離開、重新整理後可找回任務；失敗或逾時可重試。
5. 檢查改寫、SEO、AEO、GEO、FAQ、標籤、圖片替代文字與事實警示。
6. 只勾選要接受的欄位並套用；確認套用後仍不是公開狀態。
7. 人工補齊發布檢查，再用獨立按鈕發布。
8. 開啟前台文章，核對 canonical、OG、JSON-LD、FAQ 顯示及舊 slug 301。
9. 還原一個版本；確認內容回復到 Preview，而不是直接公開。
10. 回歸作品列表、作品編輯、圖片上傳、Cookie、首頁與觀點列表。

## 停用與回復

- 緊急停用 AI：將 `CONTENT_AI_ENABLED=false` 後重新部署；一般 CMS 繼續可用。
- 緊急停用所有後台寫入：將 `CMS_WRITE_ENABLED=false` 後重新部署。
- 回復文章：從後台版本紀錄還原；還原後必須重新人工發布。
- 程式回退：revert 對應功能 commit；不刪除新表與稽核紀錄。
- API 或模型異常時不得把 OIDC token、Gateway key 或其他憑證貼入錯誤訊息、GitHub issue 或 Notion。

## 成本與效能觀察

- AI 任務每位管理員最多每小時 5 次、每日 20 次。
- 同一文章、相同輸入、prompt 版本與模型會重用既有結果。
- 狀態輪詢會退避，分頁在背景時暫停，任務完成後停止。
- Preview QA 期間觀察 Supabase CPU、慢查詢及 Vercel Function 錯誤；一般前台不得讀取 AI 任務或版本資料表。
