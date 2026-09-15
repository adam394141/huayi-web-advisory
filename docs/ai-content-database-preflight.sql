-- 唯讀預檢：執行後確認既有欄位與 owner 身分，再執行 ai-content-schema.sql。
begin transaction read only;
select id,email from auth.users where id='e5fc7b65-f73e-4aed-b98d-7bed15975539'::uuid;
select column_name,data_type,is_nullable,column_default
from information_schema.columns where table_schema='public' and table_name='blog_posts' order by ordinal_position;
select c.relname,c.relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relname in ('blog_posts','content_revisions','content_ai_runs','content_versions','content_redirects');
select policyname,tablename,roles,cmd,qual,with_check from pg_policies
where schemaname='public' and tablename in ('blog_posts','content_revisions','content_ai_runs','content_versions','content_redirects');
commit;
