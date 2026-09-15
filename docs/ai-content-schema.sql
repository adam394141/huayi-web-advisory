-- 華翼 Advisory 新官網：AI 文章優化、版本與發布安全層。
-- 只作用於 blog_posts；執行前先執行 ai-content-database-preflight.sql。
begin;
set local lock_timeout = '3s';
set local statement_timeout = '20s';

alter table public.blog_posts add column if not exists tags text[] not null default '{}';
alter table public.blog_posts add column if not exists ai_summary text;
alter table public.blog_posts add column if not exists faq jsonb not null default '[]'::jsonb;
alter table public.blog_posts add column if not exists reviewed_at timestamptz;
alter table public.blog_posts add column if not exists reviewed_by uuid;

create table if not exists public.content_ai_runs (
  id uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type = 'article'),
  content_id uuid not null references public.blog_posts(id) on delete cascade,
  requested_by uuid not null,
  status text not null check (status in ('pending','running','needs_review','completed','failed')),
  input_snapshot jsonb not null,
  fact_ledger jsonb not null default '[]'::jsonb,
  output_snapshot jsonb,
  prompt_version text not null,
  model text not null,
  input_hash text not null check (input_hash ~ '^[a-f0-9]{64}$'),
  input_tokens integer,
  output_tokens integer,
  total_tokens integer,
  error_code text,
  error_message text,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid
);

create table if not exists public.content_versions (
  id uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type = 'article'),
  content_id uuid not null references public.blog_posts(id) on delete cascade,
  revision integer not null,
  snapshot jsonb not null,
  actor uuid not null,
  reason text not null check (reason in ('before_ai_apply','before_publish','before_restore')),
  ai_run_id uuid references public.content_ai_runs(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (content_type, content_id, revision)
);

create table if not exists public.content_redirects (
  id uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type = 'article'),
  content_id uuid not null references public.blog_posts(id) on delete cascade,
  old_path text not null unique check (old_path ~ '^/blog/[a-z0-9]+([-_][a-z0-9]+)*$'),
  new_path text not null check (new_path ~ '^/blog/[a-z0-9]+([-_][a-z0-9]+)*$'),
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (old_path <> new_path)
);

create index if not exists content_ai_runs_content_created_idx on public.content_ai_runs(content_id, created_at desc);
create index if not exists content_ai_runs_owner_status_idx on public.content_ai_runs(requested_by, status, created_at desc);
create unique index if not exists content_ai_runs_one_active_idx on public.content_ai_runs(content_id, requested_by)
where status in ('pending','running');
create index if not exists content_versions_content_revision_idx on public.content_versions(content_id, revision desc);
create index if not exists content_redirects_content_idx on public.content_redirects(content_id);

alter table public.content_ai_runs enable row level security;
alter table public.content_versions enable row level security;
alter table public.content_redirects enable row level security;

drop policy if exists huayi_owner_read_ai_runs on public.content_ai_runs;
create policy huayi_owner_read_ai_runs on public.content_ai_runs for select to authenticated
using ((select auth.uid()) = 'e5fc7b65-f73e-4aed-b98d-7bed15975539'::uuid and (select auth.jwt()->>'aal') = 'aal2');

drop policy if exists huayi_owner_read_versions on public.content_versions;
create policy huayi_owner_read_versions on public.content_versions for select to authenticated
using ((select auth.uid()) = 'e5fc7b65-f73e-4aed-b98d-7bed15975539'::uuid and (select auth.jwt()->>'aal') = 'aal2');

drop policy if exists huayi_public_read_redirects on public.content_redirects;
create policy huayi_public_read_redirects on public.content_redirects for select to anon, authenticated using (true);

revoke all on public.content_ai_runs, public.content_versions, public.content_redirects from public, anon, authenticated;
grant select on public.content_ai_runs, public.content_versions to authenticated;
grant select on public.content_redirects to anon, authenticated;

create or replace function public.huayi_assert_cms_owner() returns void
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if auth.uid() is distinct from 'e5fc7b65-f73e-4aed-b98d-7bed15975539'::uuid
     or coalesce(auth.jwt()->>'aal', '') <> 'aal2' then
    raise exception 'CMS_FORBIDDEN' using errcode = '42501';
  end if;
end;
$$;
revoke all on function public.huayi_assert_cms_owner() from public, anon, authenticated;

create or replace function public.cms_create_blog_post(
  p_title text, p_slug text, p_category text, p_author text default null
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp
set lock_timeout = '3s' set statement_timeout = '12s' as $$
declare v_post public.blog_posts%rowtype;
begin
  perform public.huayi_assert_cms_owner();
  if nullif(btrim(p_title),'') is null or length(p_title)>180
     or p_slug !~ '^[a-z0-9]+([-_][a-z0-9]+)*$' or length(p_slug)>140
     or nullif(btrim(p_category),'') is null or length(p_category)>80
     or length(coalesce(p_author,''))>180 then
    raise exception 'CMS_INVALID_INPUT' using errcode='22023';
  end if;
  insert into public.blog_posts(title,slug,category,author,status,sort_order,show_on_homepage)
  values (btrim(p_title),p_slug,btrim(p_category),nullif(btrim(p_author),''),'draft',
    coalesce((select max(sort_order)+1 from public.blog_posts),0),false)
  returning * into v_post;
  return to_jsonb(v_post);
exception when unique_violation then
  raise exception 'CMS_DUPLICATE_SLUG' using errcode='23505';
end;
$$;

create or replace function public.cms_create_work(
  p_title text, p_slug text, p_category text, p_client text default null
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp
set lock_timeout = '3s' set statement_timeout = '12s' as $$
declare v_work public.works%rowtype;
begin
  perform public.huayi_assert_cms_owner();
  if nullif(btrim(p_title),'') is null or length(p_title)>180
     or p_slug !~ '^[a-z0-9]+([-_][a-z0-9]+)*$' or length(p_slug)>140
     or nullif(btrim(p_category),'') is null or length(p_category)>80
     or length(coalesce(p_client,''))>180 then
    raise exception 'CMS_INVALID_INPUT' using errcode='22023';
  end if;
  insert into public.works(title,slug,category,client,status,sort_order,show_on_homepage)
  values (btrim(p_title),p_slug,btrim(p_category),nullif(btrim(p_client),''),'draft',
    coalesce((select max(sort_order)+1 from public.works),0),false)
  returning * into v_work;
  return to_jsonb(v_work);
exception when unique_violation then
  raise exception 'CMS_DUPLICATE_SLUG' using errcode='23505';
end;
$$;

create or replace function public.cms_start_ai_run(
  p_content_id uuid, p_expected_updated_at timestamptz, p_source_material text,
  p_input_hash text, p_prompt_version text, p_model text
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp
set lock_timeout = '3s' set statement_timeout = '12s' as $$
declare v_post public.blog_posts%rowtype; v_run public.content_ai_runs%rowtype;
begin
  perform public.huayi_assert_cms_owner();
  if length(coalesce(p_source_material,''))>50000 or p_input_hash !~ '^[a-f0-9]{64}$'
     or nullif(btrim(p_prompt_version),'') is null or nullif(btrim(p_model),'') is null then
    raise exception 'CMS_INVALID_INPUT' using errcode='22023';
  end if;
  select * into v_post from public.blog_posts where id=p_content_id;
  if not found then raise exception 'CMS_NOT_FOUND' using errcode='P0002'; end if;
  if v_post.updated_at is distinct from p_expected_updated_at then raise exception 'CMS_CONFLICT' using errcode='PT409'; end if;
  update public.content_ai_runs set status='failed',error_code='STALE',error_message='任務逾時，可安全重試',completed_at=now()
  where content_id=p_content_id and requested_by=auth.uid() and status in ('pending','running')
    and created_at<=now()-interval '3 minutes';
  if exists(select 1 from public.content_ai_runs where content_id=p_content_id and requested_by=auth.uid()
    and status in ('pending','running')) then
    raise exception 'CMS_AI_ALREADY_RUNNING' using errcode='PT409';
  end if;
  select * into v_run from public.content_ai_runs
  where content_id=p_content_id and requested_by=auth.uid() and status in ('needs_review','completed')
    and input_hash=p_input_hash and prompt_version=btrim(p_prompt_version) and model=btrim(p_model)
  order by created_at desc limit 1;
  if found then
    return jsonb_build_object('id',v_run.id,'status',v_run.status,'created_at',v_run.created_at,'reused',true);
  end if;
  if (select count(*) from public.content_ai_runs where requested_by=auth.uid() and created_at>now()-interval '1 hour') >= 5
     or (select count(*) from public.content_ai_runs where requested_by=auth.uid() and created_at>now()-interval '1 day') >= 20 then
    raise exception 'CMS_AI_RATE_LIMIT' using errcode='PT429';
  end if;
  insert into public.content_ai_runs(content_type,content_id,requested_by,status,input_snapshot,prompt_version,model,input_hash)
  values ('article',p_content_id,auth.uid(),'pending',jsonb_build_object(
    'article',to_jsonb(v_post),
    'source_material',coalesce(p_source_material,''),
    'known_internal_paths',jsonb_build_array('/','/about','/services','/works','/blog','/contact')
  ),btrim(p_prompt_version),btrim(p_model),p_input_hash)
  returning * into v_run;
  return jsonb_build_object('id',v_run.id,'status',v_run.status,'created_at',v_run.created_at,'reused',false);
exception when unique_violation then
  raise exception 'CMS_AI_ALREADY_RUNNING' using errcode='PT409';
end;
$$;

create or replace function public.cms_claim_ai_run(p_run_id uuid) returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare v_run public.content_ai_runs%rowtype;
begin
  perform public.huayi_assert_cms_owner();
  update public.content_ai_runs set status='running',started_at=now(),error_code=null,error_message=null
  where id=p_run_id and requested_by=auth.uid() and status='pending' returning * into v_run;
  if not found then raise exception 'CMS_AI_NOT_CLAIMABLE' using errcode='PT409'; end if;
  return to_jsonb(v_run);
end;
$$;

create or replace function public.cms_complete_ai_run(
  p_run_id uuid, p_output jsonb, p_fact_ledger jsonb, p_status text,
  p_input_tokens integer default null, p_output_tokens integer default null, p_total_tokens integer default null
) returns void
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  perform public.huayi_assert_cms_owner();
  if p_status not in ('needs_review','completed') or jsonb_typeof(p_output)<>'object' or jsonb_typeof(p_fact_ledger)<>'array' then
    raise exception 'CMS_INVALID_INPUT' using errcode='22023';
  end if;
  update public.content_ai_runs set status=p_status,output_snapshot=p_output,fact_ledger=p_fact_ledger,
    input_tokens=p_input_tokens,output_tokens=p_output_tokens,total_tokens=p_total_tokens,completed_at=now()
  where id=p_run_id and requested_by=auth.uid() and status='running';
  if not found then raise exception 'CMS_AI_NOT_RUNNING' using errcode='PT409'; end if;
end;
$$;

create or replace function public.cms_fail_ai_run(p_run_id uuid,p_error_code text,p_error_message text) returns void
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  perform public.huayi_assert_cms_owner();
  update public.content_ai_runs set status='failed',error_code=left(coalesce(p_error_code,'UNKNOWN'),80),
    error_message=left(coalesce(p_error_message,'AI 處理失敗'),500),completed_at=now()
  where id=p_run_id and requested_by=auth.uid() and status in ('pending','running');
end;
$$;

create or replace function public.cms_retry_ai_run(p_run_id uuid) returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare v_old public.content_ai_runs%rowtype; v_article jsonb; v_run public.content_ai_runs%rowtype;
begin
  perform public.huayi_assert_cms_owner();
  if (select count(*) from public.content_ai_runs where requested_by=auth.uid() and created_at>now()-interval '1 hour') >= 5
     or (select count(*) from public.content_ai_runs where requested_by=auth.uid() and created_at>now()-interval '1 day') >= 20 then
    raise exception 'CMS_AI_RATE_LIMIT' using errcode='PT429';
  end if;
  select * into v_old from public.content_ai_runs where id=p_run_id and requested_by=auth.uid() for update;
  if not found then raise exception 'CMS_NOT_FOUND' using errcode='P0002'; end if;
  if v_old.status not in ('failed') and not (v_old.status in ('pending','running') and v_old.created_at<now()-interval '3 minutes') then
    raise exception 'CMS_AI_NOT_RETRYABLE' using errcode='PT409';
  end if;
  if v_old.status in ('pending','running') then
    update public.content_ai_runs set status='failed',error_code='STALE',error_message='任務逾時，可安全重試',completed_at=now() where id=v_old.id;
  end if;
  v_article := v_old.input_snapshot->'article';
  if not exists(select 1 from public.blog_posts where id=v_old.content_id and updated_at=(v_article->>'updated_at')::timestamptz) then
    raise exception 'CMS_CONFLICT' using errcode='PT409';
  end if;
  insert into public.content_ai_runs(content_type,content_id,requested_by,status,input_snapshot,prompt_version,model,input_hash)
  values ('article',v_old.content_id,auth.uid(),'pending',v_old.input_snapshot,v_old.prompt_version,v_old.model,v_old.input_hash)
  returning * into v_run;
  return jsonb_build_object('id',v_run.id,'status',v_run.status,'created_at',v_run.created_at);
end;
$$;

create or replace function public.cms_apply_ai_result(
  p_run_id uuid, p_expected_updated_at timestamptz, p_fields text[], p_confirm_blockers boolean default false
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp
set lock_timeout='3s' set statement_timeout='12s' as $$
declare v_run public.content_ai_runs%rowtype; v_old public.blog_posts%rowtype; v_new public.blog_posts%rowtype; v_revision integer; v_field text;
begin
  perform public.huayi_assert_cms_owner();
  if coalesce(array_length(p_fields,1),0)=0 then raise exception 'CMS_INVALID_INPUT' using errcode='22023'; end if;
  foreach v_field in array p_fields loop
    if v_field not in ('title','excerpt','content','seo_title','seo_description','tags','faq','ai_summary') then
      raise exception 'CMS_INVALID_FIELD' using errcode='22023';
    end if;
  end loop;
  select * into v_run from public.content_ai_runs where id=p_run_id and requested_by=auth.uid() and status in ('needs_review','completed');
  if not found then raise exception 'CMS_NOT_FOUND' using errcode='P0002'; end if;
  select * into v_old from public.blog_posts where id=v_run.content_id for update;
  if not found then raise exception 'CMS_NOT_FOUND' using errcode='P0002'; end if;
  if v_old.updated_at is distinct from p_expected_updated_at then raise exception 'CMS_CONFLICT' using errcode='PT409'; end if;
  select coalesce(max(revision),0)+1 into v_revision from public.content_versions where content_type='article' and content_id=v_old.id;
  insert into public.content_versions(content_type,content_id,revision,snapshot,actor,reason,ai_run_id)
  values ('article',v_old.id,v_revision,to_jsonb(v_old),auth.uid(),'before_ai_apply',v_run.id);
  update public.blog_posts set
    title=case when 'title'=any(p_fields) then left(v_run.output_snapshot#>>'{article,title}',180) else title end,
    excerpt=case when 'excerpt'=any(p_fields) then nullif(left(v_run.output_snapshot#>>'{article,excerpt}',500),'') else excerpt end,
    content=case when 'content'=any(p_fields) then v_run.output_snapshot#>>'{article,content_html}' else content end,
    seo_title=case when 'seo_title'=any(p_fields) then nullif(left(v_run.output_snapshot#>>'{seo,title}',180),'') else seo_title end,
    seo_description=case when 'seo_description'=any(p_fields) then nullif(left(v_run.output_snapshot#>>'{seo,description}',500),'') else seo_description end,
    tags=case when 'tags'=any(p_fields) then array(select jsonb_array_elements_text(v_run.output_snapshot->'tags') limit 8) else tags end,
    faq=case when 'faq'=any(p_fields) then v_run.output_snapshot#>'{aeo,faq}' else faq end,
    ai_summary=case when 'ai_summary'=any(p_fields) then nullif(left(v_run.output_snapshot#>>'{aeo,direct_answer}',1000),'') else ai_summary end,
    status='preview',is_published=false,reviewed_at=now(),reviewed_by=auth.uid()
  where id=v_old.id returning * into v_new;
  if p_confirm_blockers then
    update public.content_ai_runs set reviewed_at=now(),reviewed_by=auth.uid() where id=v_run.id;
  end if;
  return to_jsonb(v_new);
end;
$$;

create or replace function public.cms_publish_blog_post(p_id uuid,p_expected_updated_at timestamptz) returns jsonb
language plpgsql security definer set search_path = public, pg_temp
set lock_timeout='3s' set statement_timeout='12s' as $$
declare v_old public.blog_posts%rowtype; v_new public.blog_posts%rowtype; v_revision integer; v_latest public.content_ai_runs%rowtype;
begin
  perform public.huayi_assert_cms_owner();
  select * into v_old from public.blog_posts where id=p_id for update;
  if not found then raise exception 'CMS_NOT_FOUND' using errcode='P0002'; end if;
  if v_old.updated_at is distinct from p_expected_updated_at then raise exception 'CMS_CONFLICT' using errcode='PT409'; end if;
  if v_old.status='archived' then raise exception 'CMS_PUBLISH_ARCHIVED' using errcode='22023'; end if;
  if nullif(btrim(v_old.title),'') is null or nullif(btrim(v_old.slug),'') is null or nullif(btrim(v_old.excerpt),'') is null
     or nullif(btrim(v_old.content),'') is null or nullif(btrim(v_old.cover_image),'') is null
     or nullif(btrim(v_old.seo_title),'') is null or nullif(btrim(v_old.seo_description),'') is null then
    raise exception 'CMS_PUBLISH_INCOMPLETE' using errcode='22023';
  end if;
  select * into v_latest from public.content_ai_runs where content_id=p_id and status in ('needs_review','completed') order by created_at desc limit 1;
  if found and v_latest.reviewed_at is null and jsonb_array_length(coalesce(v_latest.output_snapshot->'blocking_issues','[]'::jsonb))
    + jsonb_array_length(coalesce(v_latest.output_snapshot->'deterministic_blockers','[]'::jsonb)) > 0 then
    raise exception 'CMS_AI_BLOCKERS' using errcode='22023';
  end if;
  select coalesce(max(revision),0)+1 into v_revision from public.content_versions where content_type='article' and content_id=p_id;
  insert into public.content_versions(content_type,content_id,revision,snapshot,actor,reason)
  values ('article',p_id,v_revision,to_jsonb(v_old),auth.uid(),'before_publish');
  update public.blog_posts set status='published',is_published=true,published_at=coalesce(published_at,now()),reviewed_at=now(),reviewed_by=auth.uid()
  where id=p_id returning * into v_new;
  return to_jsonb(v_new);
end;
$$;

create or replace function public.cms_restore_content_version(p_version_id uuid,p_expected_updated_at timestamptz) returns jsonb
language plpgsql security definer set search_path = public, pg_temp
set lock_timeout='3s' set statement_timeout='12s' as $$
declare v_version public.content_versions%rowtype; v_old public.blog_posts%rowtype; v_new public.blog_posts%rowtype; v_revision integer; v_snapshot jsonb;
begin
  perform public.huayi_assert_cms_owner();
  select * into v_version from public.content_versions where id=p_version_id and content_type='article';
  if not found then raise exception 'CMS_NOT_FOUND' using errcode='P0002'; end if;
  select * into v_old from public.blog_posts where id=v_version.content_id for update;
  if not found then raise exception 'CMS_NOT_FOUND' using errcode='P0002'; end if;
  if v_old.updated_at is distinct from p_expected_updated_at then raise exception 'CMS_CONFLICT' using errcode='PT409'; end if;
  v_snapshot := v_version.snapshot;
  if coalesce(v_snapshot->>'slug','') !~ '^[a-z0-9]+([-_][a-z0-9]+)*$' then
    raise exception 'CMS_INVALID_SLUG' using errcode='22023';
  end if;
  select coalesce(max(revision),0)+1 into v_revision from public.content_versions where content_type='article' and content_id=v_old.id;
  insert into public.content_versions(content_type,content_id,revision,snapshot,actor,reason)
  values ('article',v_old.id,v_revision,to_jsonb(v_old),auth.uid(),'before_restore');
  update public.blog_posts set
    title=left(coalesce(v_snapshot->>'title',title),180),slug=v_snapshot->>'slug',
    excerpt=nullif(left(coalesce(v_snapshot->>'excerpt',''),5000),''),content=left(coalesce(v_snapshot->>'content',''),200000),
    category=left(coalesce(v_snapshot->>'category',category),80),cover_image=nullif(v_snapshot->>'cover_image',''),
    author=nullif(left(coalesce(v_snapshot->>'author',''),180),''),
    -- 還原只能回到待檢視狀態；不得藉版本還原繞過獨立發布閘門。
    status=case when v_snapshot->>'status'='archived' then 'archived' else 'preview' end,is_published=false,
    show_on_homepage=coalesce((v_snapshot->>'show_on_homepage')::boolean,false),
    sort_order=coalesce((v_snapshot->>'sort_order')::integer,0),
    seo_title=nullif(left(coalesce(v_snapshot->>'seo_title',''),180),''),
    seo_description=nullif(left(coalesce(v_snapshot->>'seo_description',''),500),''),
    tags=case when jsonb_typeof(v_snapshot->'tags')='array' then array(select jsonb_array_elements_text(v_snapshot->'tags') limit 8) else '{}' end,
    faq=case when jsonb_typeof(v_snapshot->'faq')='array' then v_snapshot->'faq' else '[]'::jsonb end,
    ai_summary=nullif(left(coalesce(v_snapshot->>'ai_summary',''),1000),'')
  where id=v_old.id returning * into v_new;
  return to_jsonb(v_new);
end;
$$;

create or replace function public.huayi_capture_blog_redirect() returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if old.slug is distinct from new.slug and old.slug ~ '^[a-z0-9]+([-_][a-z0-9]+)*$' and new.slug ~ '^[a-z0-9]+([-_][a-z0-9]+)*$' then
    insert into public.content_redirects(content_type,content_id,old_path,new_path,created_by)
    values ('article',new.id,'/blog/'||old.slug,'/blog/'||new.slug,auth.uid())
    on conflict(old_path) do update set new_path=excluded.new_path,updated_at=now(),created_by=excluded.created_by;
    update public.content_redirects set new_path='/blog/'||new.slug,updated_at=now()
    where content_id=new.id and old_path<>'/blog/'||new.slug;
  end if;
  return new;
end;
$$;
drop trigger if exists huayi_blog_redirect on public.blog_posts;
create trigger huayi_blog_redirect after update of slug on public.blog_posts
for each row execute function public.huayi_capture_blog_redirect();

revoke all on function public.cms_create_blog_post(text,text,text,text) from public, anon;
revoke all on function public.cms_create_work(text,text,text,text) from public, anon;
revoke all on function public.cms_start_ai_run(uuid,timestamptz,text,text,text,text) from public, anon;
revoke all on function public.cms_claim_ai_run(uuid) from public, anon;
revoke all on function public.cms_complete_ai_run(uuid,jsonb,jsonb,text,integer,integer,integer) from public, anon;
revoke all on function public.cms_fail_ai_run(uuid,text,text) from public, anon;
revoke all on function public.cms_retry_ai_run(uuid) from public, anon;
revoke all on function public.cms_apply_ai_result(uuid,timestamptz,text[],boolean) from public, anon;
revoke all on function public.cms_publish_blog_post(uuid,timestamptz) from public, anon;
revoke all on function public.cms_restore_content_version(uuid,timestamptz) from public, anon;
grant execute on function public.cms_create_blog_post(text,text,text,text) to authenticated;
grant execute on function public.cms_create_work(text,text,text,text) to authenticated;
grant execute on function public.cms_start_ai_run(uuid,timestamptz,text,text,text,text) to authenticated;
grant execute on function public.cms_claim_ai_run(uuid) to authenticated;
grant execute on function public.cms_complete_ai_run(uuid,jsonb,jsonb,text,integer,integer,integer) to authenticated;
grant execute on function public.cms_fail_ai_run(uuid,text,text) to authenticated;
grant execute on function public.cms_retry_ai_run(uuid) to authenticated;
grant execute on function public.cms_apply_ai_result(uuid,timestamptz,text[],boolean) to authenticated;
grant execute on function public.cms_publish_blog_post(uuid,timestamptz) to authenticated;
grant execute on function public.cms_restore_content_version(uuid,timestamptz) to authenticated;

commit;
