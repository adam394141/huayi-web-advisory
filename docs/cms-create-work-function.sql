begin;

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

revoke all on function public.cms_create_work(text,text,text,text) from public, anon;
grant execute on function public.cms_create_work(text,text,text,text) to authenticated;

commit;
