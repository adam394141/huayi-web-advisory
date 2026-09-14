-- 安裝後唯讀驗證。預期新表皆 RLS=true，敏感表只有 authenticated owner read。
begin transaction read only;
select c.relname,c.relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relname in ('content_ai_runs','content_versions','content_redirects');
select policyname,tablename,roles,cmd from pg_policies
where schemaname='public' and tablename in ('content_ai_runs','content_versions','content_redirects') order by tablename,policyname;
select routine_name from information_schema.routines where routine_schema='public' and routine_name like 'cms_%' order by routine_name;
select indexname from pg_indexes where schemaname='public' and tablename in ('content_ai_runs','content_versions','content_redirects') order by indexname;
select column_name,data_type,is_nullable,column_default from information_schema.columns
where table_schema='public' and table_name='blog_posts'
  and column_name in ('tags','ai_summary','faq','reviewed_at','reviewed_by') order by column_name;
select trigger_name,event_manipulation from information_schema.triggers
where event_object_schema='public' and event_object_table='blog_posts' and trigger_name='huayi_blog_redirect';
commit;
