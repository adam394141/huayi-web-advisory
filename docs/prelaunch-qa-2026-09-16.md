# Advisory 新官網｜正式上線前 QA｜2026-09-16

## 驗證範圍

Preview 分支 `fix/advisory-visual-polish`。只驗證 Advisory 新官網、作品、觀點與 CMS；未修改第一網站、`/adam`、`/adam_cpc`、ADS、Cloudflare 或正式 DNS。

## Observed｜實際部署觀察

- 管理員已完成 MFA 登入，作品／觀點資料可讀；單一圖文編輯器、AI 優化結果、儲存完成訊息與發布完成訊息均可見。
- 測試文章已公開於 Preview；文章只有一個 H1，正文有 H2／H3，canonical、SEO description、OG 圖、Article 與 FAQPage JSON-LD 皆存在。
- Preview 正確輸出 `noindex, nofollow`。
- 首頁 23 張圖片、觀點列表 8 張、作品列表 11 張在實際捲動載入後皆為 0 破圖；首頁初始未載入項目是正常 lazy loading。
- 首頁、作品、觀點、文章皆有內容、無 Next.js error overlay。
- Vercel Preview 必要環境變數名稱齊全；Gemini 金鑰為 Sensitive，沒有值被寫入此文件。
- 最近兩小時只有兩筆重複網址代稱 `23505`，介面已正確阻擋；使用者改用唯一 slug 後成功儲存與發布。

## Code｜程式與自動檢查

- 37 tests PASS。
- ESLint PASS。
- Next.js Webpack production build PASS。
- 管理 API 使用明確 collection／欄位白名單、MFA `aal2`、使用者 JWT、RLS、request size、timeout、no-store 與安全錯誤訊息。
- HTML 與圖片來源經清洗；上傳驗證檔案簽章、MIME、容量與使用位置。
- 新增全站安全標頭：CSP、frame ancestors／X-Frame-Options、nosniff、Referrer-Policy、Permissions-Policy、COOP；關閉 `X-Powered-By`。

## 未完成的人工 Gate

- Safari／Chrome 的手機與平板實機目視。
- Supabase Dashboard CPU、慢查詢與備份狀態需由有專案權限的管理者查看；本輪未宣稱平台 CPU 已恢復正常。
- 正式網域切換前，需另驗證 Cloudflare DNS、正式 Vercel Environment、`SITE_ALLOW_INDEXING=true`、robots／sitemap、SSL 與 rollback。
- 未取得 Adam 明確「可以 merge／可以上線」前，不得合併 `main`。
