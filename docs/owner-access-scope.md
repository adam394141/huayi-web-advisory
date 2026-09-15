# Adam 最高管理權與系統權限邊界

## 使用者確認（2026-09-14）

Adam 明確同意帳號管理新官網，並要求其所有者權限涵蓋講師頁、ADS、其他系統與網域。這是所有者意圖，不代表每個服務的存取權都已開通。

已於 Supabase Authentication UI 觀察到 adam394141@gmail.com，UID 為 e5fc7b65-f73e-4aed-b98d-7bed15975539。密碼由使用者親自設定，未經代理讀取或保存。

## 實施原則

- 最高所有者為 Adam；新官網、講師頁、ADS、其他系統、網域各自驗證身分與管理權。
- 新官網後台不保存 GitHub／Vercel／Cloudflare／其他系統的超級金鑰，也不把 Supabase 所有表放開。
- 本輪先授予新官網 works／blog_posts 的 MFA 管理讀取；寫入仍須原子交易、紀錄、還原與限流驗收。先讀後寫不是撤回最高管理權，而是按功能安全上線。
- 講師／ADS／其他系統尚須盤點各自專案、登入、資料與既有管理帳號。網域仍由網站公司管理，待移交。不能宣稱單一 Supabase UID 已取得這些外部服務的權限。
- 不改正式 DNS、不刪原部署、不撤銷其他既有管理員、不影響其他系統的資料政策。

## 狀態

本文件為授權決策紀錄。各項實際套用、驗證與未完成部分另記本輪報告。

### 已套用與驗證

2026-09-14 已在現有 Supabase 對 works／blog_posts 新增 huayi_cms_owner_read SELECT 政策，僅指定 UID 且 aal2 的 authenticated 角色可取得額外管理讀取。未開放直接寫入，未改其他表或儲存區。SQL 見 cms-admin-read-policy.sql。

以 SQL Editor 在 read-only transaction 內 SET LOCAL ROLE authenticated 與模擬 JWT claims 驗證：指定 UID＋aal2 可讀未發布作品3／文章2；指定 UID＋aal1為0／0；其他 UID＋aal2為0／0。這是資料庫政策測試，不是真實 MFA 登入驗收；模擬 claims 不會簽发 token、不產生帳號或改動資料。
