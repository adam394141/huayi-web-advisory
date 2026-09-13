-- 唯讀查證：不改資料、不建立函式、不調整權限。
-- 在現有 Supabase 專案 SQL Editor 執行；結果用於確認安全寫入設計。
begin transaction read only;

select n.nspname as schema_name, c.relname as table_name,
       c.relrowsecurity as rls_enabled, c.relforcerowsecurity as rls_forced
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where (n.nspname = 'public' and c.relname in ('works','blog_posts','content_revisions'))
   or (n.nspname = 'storage' and c.relname = 'objects');

select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where (schemaname = 'public' and tablename in ('works','blog_posts','content_revisions'))
   or (schemaname = 'storage' and tablename = 'objects');

select table_schema, table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and table_name in ('works','blog_posts','content_revisions')
  and grantee in ('anon','authenticated','service_role');

select c.relname as table_name, t.tgname, pg_get_triggerdef(t.oid) as definition
from pg_trigger t join pg_class c on c.oid = t.tgrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname in ('works','blog_posts','content_revisions')
  and not t.tgisinternal;

select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public' and table_name in ('works','blog_posts','content_revisions')
order by table_name, ordinal_position;

select conrelid::regclass::text as source_table, confrelid::regclass::text as target_table,
       pg_get_constraintdef(oid) as definition
from pg_constraint
where contype = 'f' and (conrelid in ('public.works'::regclass, 'public.blog_posts'::regclass)
  or confrelid in ('public.works'::regclass, 'public.blog_posts'::regclass));

select id, public, file_size_limit, allowed_mime_types
from storage.buckets where id = 'published-assets';

commit;
