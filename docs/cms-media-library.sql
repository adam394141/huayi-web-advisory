-- 華翼 Advisory CMS 媒體庫：只讀本人後台上傳的 optimized 網站版圖片。
-- 不提供刪除、不回傳原圖網址，不影響既有 works/* 舊資產。
begin;
set local lock_timeout = '3s';

create or replace function public.cms_admin_list_assets(
  p_query text default '',
  p_collection text default '',
  p_usage text default '',
  p_limit integer default 24,
  p_offset integer default 0
)
returns table (
  path text,
  file_name text,
  collection text,
  item_id uuid,
  item_title text,
  bytes bigint,
  mime_type text,
  created_at timestamptz,
  updated_at timestamptz,
  used_as_cover boolean,
  used_in_content boolean,
  total_count bigint
)
language plpgsql
security definer
set search_path = public, storage, pg_temp
as $$
begin
  if auth.uid() is distinct from 'e5fc7b65-f73e-4aed-b98d-7bed15975539'::uuid
     or coalesce(auth.jwt()->>'aal', '') <> 'aal2' then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if length(coalesce(p_query, '')) > 100
     or coalesce(p_collection, '') not in ('', 'works', 'blog_posts')
     or coalesce(p_usage, '') not in ('', 'cover', 'content', 'unreferenced')
     or p_limit < 1 or p_limit > 48 or p_offset < 0 or p_offset > 48000 then
    raise exception 'invalid_parameters' using errcode = '22023';
  end if;

  return query
  with matched as materialized (
    select
      o.*,
      split_part(o.name, '/', 3) as content_collection,
      substring(o.name from '^cms/[^/]+/(?:works|blog_posts)/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/optimized/')::uuid as content_id
    from storage.objects o
    where o.bucket_id = 'published-assets'
      and o.name ~ ('^cms/' || auth.uid()::text || '/(works|blog_posts)/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/optimized/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.webp$')
  ), indexed as (
    select
      o.name as path,
      regexp_replace(o.name, '^.*/', '') as file_name,
      o.content_collection as collection,
      o.content_id as item_id,
      coalesce(w.title, b.title, '找不到所屬內容') as item_title,
      case when coalesce(o.metadata->>'size', '') ~ '^[0-9]+$' then (o.metadata->>'size')::bigint else 0 end as bytes,
      coalesce(o.metadata->>'mimetype', 'image/webp') as mime_type,
      o.created_at,
      o.updated_at,
      case
        when o.content_collection = 'works' then position(o.name in coalesce(w.cover_image, '')) > 0
        else position(o.name in coalesce(b.cover_image, '')) > 0
      end as used_as_cover,
      case
        when o.content_collection = 'works' then position(o.name in coalesce(w.content, '')) > 0
        else position(o.name in coalesce(b.content, '')) > 0
      end as used_in_content
    from matched o
    left join public.works w
      on o.content_collection = 'works'
     and w.id = o.content_id
    left join public.blog_posts b
      on o.content_collection = 'blog_posts'
     and b.id = o.content_id
  ), filtered as (
    select * from indexed i
    where (coalesce(p_collection, '') = '' or i.collection = p_collection)
      and (
        btrim(coalesce(p_query, '')) = ''
        or i.item_title ilike '%' || btrim(p_query) || '%'
        or i.file_name ilike '%' || btrim(p_query) || '%'
      )
      and (
        coalesce(p_usage, '') = ''
        or (p_usage = 'cover' and i.used_as_cover)
        or (p_usage = 'content' and i.used_in_content)
        or (p_usage = 'unreferenced' and not i.used_as_cover and not i.used_in_content)
      )
  )
  select f.*, count(*) over() as total_count
  from filtered f
  order by f.created_at desc, f.path
  limit p_limit offset p_offset;
end;
$$;

revoke all on function public.cms_admin_list_assets(text, text, text, integer, integer) from public;
grant execute on function public.cms_admin_list_assets(text, text, text, integer, integer) to authenticated;

commit;
