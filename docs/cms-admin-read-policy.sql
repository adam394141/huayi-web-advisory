-- 2026-09-14 Adam 已確認管理權；僅新增新官網兩表的 MFA 管理讀取。
-- 不開通直接寫入、不更動其他表、不以 service role 給前端繞過 RLS。
begin;
set local lock_timeout = '3s';
do $$ begin
  if not exists (
    select 1 from auth.users
    where id = 'e5fc7b65-f73e-4aed-b98d-7bed15975539'::uuid
      and lower(email) = 'adam394141@gmail.com'
  ) then raise exception 'Owner identity does not match; stop'; end if;
  if exists (
    select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relname in ('works','blog_posts') and not c.relrowsecurity
  ) then raise exception 'RLS must be enabled; stop'; end if;
end $$;
create policy huayi_cms_owner_read on public.works
for select to authenticated
using ((select auth.uid()) = 'e5fc7b65-f73e-4aed-b98d-7bed15975539'::uuid
  and (select auth.jwt()->>'aal') = 'aal2');
create policy huayi_cms_owner_read on public.blog_posts
for select to authenticated
using ((select auth.uid()) = 'e5fc7b65-f73e-4aed-b98d-7bed15975539'::uuid
  and (select auth.jwt()->>'aal') = 'aal2');
commit;
