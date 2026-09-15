# Supabase 線上權限核對與最小修補

## 範圍與 evidence

由使用者開啟已登入 SQL Editor，專案 rhkmzcyfzemlobznltyz。查詢編號 380a0535-ed14-480f-8615-f9a54ca967e3。透過 SQL Editor UI 執行並讀取結果；沒有擷取瀏覽器憑證。

## 已觀察

- works、blog_posts、content_revisions 皆啟用 RLS，未 FORCE。
- works／blog_posts 公開 SELECT 依 is_published=true；另有 auth.role()='service_role' 的 ALL 規則。表級授權 anon 包含 CRUD，實際是否可執行仍受 RLS 限制，不能單看表級授權就宣稱作品可匿名修改。
- sync_is_published() 於作品／文章 INSERT OR UPDATE 把 is_published 同步成 status='published'；先前欄位相容性疑問已有資料庫函式證據。
- 作品／文章有 updated_at 觸發器；未見自動建立版本紀錄的觸發器。
- 查詢這三表進出 foreign key，結果未列關聯；這不代表程式端或其他系統沒有相依性。
- published-assets 為公開 bucket，未設定 bucket 層檔案大小與 MIME 限制；此輪未修改。
- 指定 adam394141@gmail.com 在 auth.users 查得 0 筆。不能把原簡易密碼帳號當作已存在的 Supabase Auth 使用者。

## 已修補的權限缺口（實際線上變更）

content_revisions 原規則 service_role_full_access 實際為 roles={public}, cmd=ALL, qual=true, with_check=true，加上 anon CRUD grants，形成過寬權限。名稱不代表權限被限制。

在核對基線後，只執行 ALTER POLICY ... TO service_role。未删除紀錄，未修改作品／文章內容，未撤銷其他表權限，未動講師頁／ADS／DNS。

```sql
begin;
set local lock_timeout = '3s';
do $$ begin
 if not exists (select 1 from pg_policies where schemaname='public' and tablename='content_revisions' and policyname='service_role_full_access' and roles=array['public']::name[] and qual='true' and with_check='true') then
  raise exception 'Policy differs from reviewed baseline; stopped';
 end if;
end $$;
alter policy service_role_full_access on public.content_revisions to service_role;
commit;
```

結果：roles={service_role}, qual=true, with_check=true；owner 查詢仍有 14 筆。隨後 begin read only + set local role anon + count(*) 查得 0 筆。沒有執行破壞性 INSERT／UPDATE／DELETE 漏洞測試。未判定過去是否遭讀取或竄改。

這是收緊復原紀錄的訪問，不是完整防竄改方案；service role／原後台通用 API 仍須後續限縮。不得為新 UI 方便而把此政策改回 public=true。

## 下一棒與必要人工作業

已開啟 Authentication → Add user → Create new user，停在空白 Email／User Password 表單。由使用者親自建立指定帳號並設定全新密碼；未填密碼、未提交、未建立／授予新管理員權限。之後核對 UID，再在準備實際授權時取得確認，範圍限定作品／觀點，不含講師／ADS。

CMS 原子寫入、版本還原、圖片上傳、限流與備份演練仍未完成。新官網程式仍未部署，本輪線上變更僅上述單一 RLS 政策。
