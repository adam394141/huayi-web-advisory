# CMS 文字編輯第一階段驗證

日期：2026-09-14。範圍：Advisory Preview 的作品／觀點文字、狀態、首頁顯示與排序值編輯。

## 已落地

- 列表可開啟兩種獨立表單；作品與觀點只共用登入與列表，不共用不相容欄位。
- API 僅接受明列欄位、固定兩表、UUID、合法狀態與大小限制；HTML 在伺服器清洗。
- `cms_update_content` 是 `SECURITY DEFINER` 且固定 `search_path`；只授權 `authenticated` 執行，函式內再次限定 Adam UUID 與 `aal2`。
- 每次更新先鎖定原資料、比對 `updated_at`，再把舊內容寫入 `content_revisions`，最後更新正式資料；同一交易失敗時全部回滾。
- Preview 分支設定 `CMS_WRITE_ENABLED=true`；Production 未開啟。

## 已驗證 evidence

- 單元測試 10/10、lint、TypeScript 與 Next.js production build 通過。
- SQL 回滾測試：Adam UUID + `aal2` 可執行更新，結果為 true；交易 rollback 後版本總數仍為 14，沒有留下測試內容。
- 權限核對：`anon_execute=false`、`authenticated_execute=true`。
- 其他 UUID + `aal2` 與 Adam UUID + `aal1` 均收到 `42501 CMS_FORBIDDEN`。

## 仍未完成

- 尚未用真實瀏覽器 session 儲存一筆由 Adam 指定的內容；部署後先做一筆可辨識且可還原的 Preview 驗收。
- 新增內容、圖片上傳、拖曳排序、版本瀏覽／還原、跨實例限流及備份還原演練尚未實作。
- 不修改 Production、DNS、ASP 舊站、講師頁或 ADS。
