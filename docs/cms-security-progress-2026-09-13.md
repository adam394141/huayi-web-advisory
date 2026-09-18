# 安全後台第一階段進度（未完成 CMS）

## Code

- 作品／文章詳細內容在伺服器端清洗 HTML；限定標籤、屬性、協定與圖片來源。JSON-LD 轉義 `<`，防止資料跳出 script。
- 公開資料讀取明列欄位，不再將來源備註等整筆資料送進瀏覽器。
- 新增 /admin Supabase Auth 登入與 TOTP 設定／驗證流程。憑證僅記憶體保存，重新整理須重新登入。不開放自行註冊，不搬用原密碼驗證。
- /api/cms 每次讀取驗證使用者、伺服器端 UUID 白名單及已驗證 JWT 的 aal2；僅 works、blog_posts 與固定欄位，使用使用者 JWT，不使用 service role。
- 缺少 CMS_ADMIN_USER_IDS 或 CMS_READ_ENABLED=true 時不開放管理讀取。所有寫入端點明確回 503，目前沒有編輯／排序／上傳／版本還原功能。
- 更新 sharp、js-yaml 相容修正版；npm audit 本次 0 已知漏洞，不等於無資安風險。

## 已執行測試

- npm test：7/7 通過（HTML、URL、JSON-LD、ID 白名單、Bearer 格式、表名白名單）。沒有把這些純函式測試當成登入端對端測試。
- npm run lint：通過；npm run build -- --webpack：通過（包含 TypeScript）。
- 本機 production server：GET /api/cms 未登入或舊式密碼返回 401；POST/PATCH/DELETE 返回 503；全部 private,no-store。
- 本機 /admin、/works、/works/gaoda-farm HTTP 200；/admin 可確認建置中標示。未進行本輪瀏覽器目視與手機 QA。
- Supabase 唯讀 HEAD count：works 未發布 service 3、anon 0；blog_posts 未發布 service 2、anon 0。這只是既有未發布資料不可匿名讀的抽樣證據，不證明匿名寫入／Storage／所有 RLS 正確。
- 唯讀 OpenAPI 確認 works、blog_posts 欄位與 content_revisions 結構；公開 schema 未列 RPC。未檢查或修改完整 SQL 權限、觸發器與交易。
- 原 Next.js repo HEAD 327206f7e45c056e47905257f3bad023b0c7de6e、tracked diff SHA256 6b16b7c2b787dd075f076b630e488289b8f2a1256141b2e8bbb5e38088fb493c，與基線相同。

## Deployed

本輪尚未 push／部署。既有可驗收外觀 Preview 仍是 ce6c358：
https://huayi-web-advisory-gc539feqn-adam394141s-projects.vercel.app/
該 Preview 不含本輪安全後台程式。既有 PR #2 未合併。

## 真正阻礙與下一步

缺少已連接的 Supabase SQL 管理介面／資料庫連接，目前僅有 REST 查證能力。需在現有專案 SQL Editor 執行 cms-database-preflight.sql（唯讀），確認 RLS、Storage、觸發器、關聯後，才能安全設計並驗證原子寫入與復原。不能使用擁有高權限 REST 金鑰作為已完成資料庫安全的替代。

管理員 Supabase Auth 身分與 MFA 實際註冊尚未驗收。帳號建立／邀請不會自行猜測密碼；使用者親自完成驗證器綁定。正式寫入前亦須驗證分散式限流、稽核防刪、草稿圖片保護、版本衝突及獨立備份還原。

舊 Next.js 通用高權限 /api/admin 仍未修改；若它可存取共用資料，將是新 CMS 之外的修改入口。後續正式安全驗收必須確認並限縮／退役這個端點，不能只保護新入口。此操作須確認與講師／ADS 的依賴後再做，不直接刪掉原部署。

沒有更改正式 DNS、ASP 舊站、講師頁、ADS 或任何線上資料；沒有執行破壞性／負载攻擊測試。
