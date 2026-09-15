-- 華翼 Advisory CMS 圖片上傳：只允許 Adam 的 aal2 session 寫入本人專用 cms 路徑。
-- 不授權 update/delete，不影響既有 works/* 資產。
begin;
set local lock_timeout = '3s';

drop policy if exists huayi_cms_owner_asset_insert on storage.objects;
create policy huayi_cms_owner_asset_insert on storage.objects
for insert to authenticated
with check (
  bucket_id = 'published-assets'
  and (storage.foldername(name))[1] = 'cms'
  and (storage.foldername(name))[2] = (select auth.uid())::text
  and (select auth.uid()) = 'e5fc7b65-f73e-4aed-b98d-7bed15975539'::uuid
  and (select auth.jwt()->>'aal') = 'aal2'
  and lower(storage.extension(name)) in ('jpg','png','webp')
);

commit;
