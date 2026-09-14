-- 華翼 CMS：限定 Adam + aal2 的原子內容更新。
-- 不授予資料表 UPDATE；僅允許呼叫這個明列欄位的函式。
begin;

create or replace function public.cms_update_content(
  p_collection text,
  p_id uuid,
  p_expected_updated_at timestamptz,
  p_changes jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set lock_timeout = '3s'
set statement_timeout = '12s'
as $$
declare
  v_allowed text[];
  v_key text;
  v_revision integer;
  v_old_work public.works%rowtype;
  v_new_work public.works%rowtype;
  v_old_post public.blog_posts%rowtype;
  v_new_post public.blog_posts%rowtype;
begin
  if auth.uid() is distinct from 'e5fc7b65-f73e-4aed-b98d-7bed15975539'::uuid
     or coalesce(auth.jwt()->>'aal', '') <> 'aal2' then
    raise exception 'CMS_FORBIDDEN' using errcode = '42501';
  end if;
  if p_collection not in ('works', 'blog_posts') or jsonb_typeof(p_changes) <> 'object' or p_changes = '{}'::jsonb then
    raise exception 'CMS_INVALID_INPUT' using errcode = '22023';
  end if;

  v_allowed := case when p_collection = 'works' then
    array['title','slug','category','content','cover_image','status','show_on_homepage','sort_order','seo_title','seo_description','description','client','design_rationale']
  else
    array['title','slug','category','content','cover_image','status','show_on_homepage','sort_order','seo_title','seo_description','excerpt','author'] end;
  for v_key in select jsonb_object_keys(p_changes) loop
    if not (v_key = any(v_allowed)) then raise exception 'CMS_INVALID_FIELD' using errcode = '22023'; end if;
  end loop;

  if p_changes ? 'title' and (nullif(btrim(p_changes->>'title'),'') is null or length(p_changes->>'title') > 180) then raise exception 'CMS_INVALID_TITLE' using errcode='22023'; end if;
  if p_changes ? 'slug' and (coalesce(p_changes->>'slug','') !~ '^[a-z0-9]+([-_][a-z0-9]+)*$' or length(p_changes->>'slug') > 140) then raise exception 'CMS_INVALID_SLUG' using errcode='22023'; end if;
  if p_changes ? 'category' and (nullif(btrim(p_changes->>'category'),'') is null or length(p_changes->>'category') > 80) then raise exception 'CMS_INVALID_CATEGORY' using errcode='22023'; end if;
  if p_changes ? 'status' and coalesce(p_changes->>'status','') not in ('draft','preview','approved','published','archived') then raise exception 'CMS_INVALID_STATUS' using errcode='22023'; end if;
  if p_changes ? 'show_on_homepage' and jsonb_typeof(p_changes->'show_on_homepage') <> 'boolean' then raise exception 'CMS_INVALID_BOOLEAN' using errcode='22023'; end if;
  if p_changes ? 'sort_order' and (jsonb_typeof(p_changes->'sort_order') <> 'number' or (p_changes->>'sort_order') !~ '^-?[0-9]{1,6}$' or (p_changes->>'sort_order')::integer not between -100000 and 100000) then raise exception 'CMS_INVALID_ORDER' using errcode='22023'; end if;
  if p_changes ? 'content' and length(coalesce(p_changes->>'content','')) > 200000 then raise exception 'CMS_CONTENT_TOO_LARGE' using errcode='22023'; end if;
  if p_changes ? 'cover_image' and p_changes->>'cover_image' is not null and p_changes->>'cover_image' <> '' and not (
    (p_changes->>'cover_image' like '/%' and p_changes->>'cover_image' not like '//%' and position(chr(92) in p_changes->>'cover_image') = 0)
    or p_changes->>'cover_image' like 'https://huayi.tw/%'
    or p_changes->>'cover_image' like 'https://rhkmzcyfzemlobznltyz.supabase.co/%'
  ) then raise exception 'CMS_INVALID_IMAGE' using errcode='22023'; end if;

  if p_collection = 'works' then
    select * into v_old_work from public.works where id = p_id for update;
    if not found then raise exception 'CMS_NOT_FOUND' using errcode='P0002'; end if;
    -- PT409 是 PostgREST 的明確 HTTP 409；不可使用可自動重試的 40001，否則會形成重試風暴。
    if v_old_work.updated_at is distinct from p_expected_updated_at then raise exception 'CMS_CONFLICT' using errcode='PT409'; end if;
    select coalesce(max(revision),0)+1 into v_revision from public.content_revisions where content_type='case' and content_id=p_id;
    insert into public.content_revisions(content_type,content_id,revision,payload,actor,reason)
    values ('case',p_id,v_revision,to_jsonb(v_old_work),auth.uid()::text,'before_update');
    update public.works set
      title=case when p_changes?'title' then btrim(p_changes->>'title') else title end,
      slug=case when p_changes?'slug' then p_changes->>'slug' else slug end,
      category=case when p_changes?'category' then btrim(p_changes->>'category') else category end,
      content=case when p_changes?'content' then p_changes->>'content' else content end,
      cover_image=case when p_changes?'cover_image' then nullif(p_changes->>'cover_image','') else cover_image end,
      status=case when p_changes?'status' then p_changes->>'status' else status end,
      show_on_homepage=case when p_changes?'show_on_homepage' then (p_changes->>'show_on_homepage')::boolean else show_on_homepage end,
      sort_order=case when p_changes?'sort_order' then (p_changes->>'sort_order')::integer else sort_order end,
      seo_title=case when p_changes?'seo_title' then nullif(p_changes->>'seo_title','') else seo_title end,
      seo_description=case when p_changes?'seo_description' then nullif(p_changes->>'seo_description','') else seo_description end,
      description=case when p_changes?'description' then nullif(p_changes->>'description','') else description end,
      client=case when p_changes?'client' then nullif(p_changes->>'client','') else client end,
      design_rationale=case when p_changes?'design_rationale' then nullif(p_changes->>'design_rationale','') else design_rationale end,
      published_at=case when p_changes->>'status'='published' and coalesce(v_old_work.status,'')<>'published' then coalesce(published_at,now()) else published_at end
    where id=p_id returning * into v_new_work;
    return jsonb_build_object('old_slug',v_old_work.slug,'item',to_jsonb(v_new_work));
  end if;

  select * into v_old_post from public.blog_posts where id = p_id for update;
  if not found then raise exception 'CMS_NOT_FOUND' using errcode='P0002'; end if;
  if v_old_post.updated_at is distinct from p_expected_updated_at then raise exception 'CMS_CONFLICT' using errcode='PT409'; end if;
  select coalesce(max(revision),0)+1 into v_revision from public.content_revisions where content_type='article' and content_id=p_id;
  insert into public.content_revisions(content_type,content_id,revision,payload,actor,reason)
  values ('article',p_id,v_revision,to_jsonb(v_old_post),auth.uid()::text,'before_update');
  update public.blog_posts set
    title=case when p_changes?'title' then btrim(p_changes->>'title') else title end,
    slug=case when p_changes?'slug' then p_changes->>'slug' else slug end,
    category=case when p_changes?'category' then btrim(p_changes->>'category') else category end,
    content=case when p_changes?'content' then p_changes->>'content' else content end,
    cover_image=case when p_changes?'cover_image' then nullif(p_changes->>'cover_image','') else cover_image end,
    status=case when p_changes?'status' then p_changes->>'status' else status end,
    show_on_homepage=case when p_changes?'show_on_homepage' then (p_changes->>'show_on_homepage')::boolean else show_on_homepage end,
    sort_order=case when p_changes?'sort_order' then (p_changes->>'sort_order')::integer else sort_order end,
    seo_title=case when p_changes?'seo_title' then nullif(p_changes->>'seo_title','') else seo_title end,
    seo_description=case when p_changes?'seo_description' then nullif(p_changes->>'seo_description','') else seo_description end,
    excerpt=case when p_changes?'excerpt' then nullif(p_changes->>'excerpt','') else excerpt end,
    author=case when p_changes?'author' then nullif(p_changes->>'author','') else author end,
    published_at=case when p_changes->>'status'='published' and coalesce(v_old_post.status,'')<>'published' then coalesce(published_at,now()) else published_at end
  where id=p_id returning * into v_new_post;
  return jsonb_build_object('old_slug',v_old_post.slug,'item',to_jsonb(v_new_post));
end;
$$;

revoke all on function public.cms_update_content(text,uuid,timestamptz,jsonb) from public, anon;
grant execute on function public.cms_update_content(text,uuid,timestamptz,jsonb) to authenticated;
commit;
