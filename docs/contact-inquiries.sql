-- 華翼 Advisory 聯絡表單：2026-09-18 已套用至 rhkmzcyfzemlobznltyz。
-- 公開訪客只可透過受限 RPC 新增，無法讀取或修改詢問內容。
begin;
set local lock_timeout = '3s';

create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  email text not null check (char_length(email) between 3 and 254),
  company text check (company is null or char_length(company) <= 120),
  inquiry_type text not null check (inquiry_type in ('品牌策略', 'AI 導入', '行銷', '設計', '其他')),
  message text not null check (char_length(message) between 10 and 5000),
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed', 'spam')),
  fingerprint_hash text not null check (char_length(fingerprint_hash) = 64),
  consented_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.contact_inquiries enable row level security;
revoke all on table public.contact_inquiries from anon, authenticated;

create index if not exists contact_inquiries_created_at_idx
  on public.contact_inquiries (created_at desc);
create index if not exists contact_inquiries_fingerprint_created_idx
  on public.contact_inquiries (fingerprint_hash, created_at desc);

create or replace function public.submit_contact_inquiry(
  p_name text,
  p_email text,
  p_company text,
  p_inquiry_type text,
  p_message text,
  p_fingerprint_hash text
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
  v_email text := lower(btrim(coalesce(p_email, '')));
begin
  if char_length(btrim(coalesce(p_name, ''))) not between 1 and 80
     or char_length(v_email) not between 3 and 254
     or position('@' in v_email) <= 1
     or char_length(coalesce(p_company, '')) > 120
     or coalesce(p_inquiry_type, '') not in ('品牌策略', 'AI 導入', '行銷', '設計', '其他')
     or char_length(btrim(coalesce(p_message, ''))) not between 10 and 5000
     or coalesce(p_fingerprint_hash, '') !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid_parameters' using errcode = '22023';
  end if;

  if (
    select count(*)
    from public.contact_inquiries
    where fingerprint_hash = p_fingerprint_hash
      and created_at > now() - interval '1 hour'
  ) >= 3 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  if (
    select count(*)
    from public.contact_inquiries
    where email = v_email
      and created_at > now() - interval '1 day'
  ) >= 5 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  insert into public.contact_inquiries (
    name, email, company, inquiry_type, message, fingerprint_hash
  ) values (
    btrim(p_name), v_email, nullif(btrim(coalesce(p_company, '')), ''),
    p_inquiry_type, btrim(p_message), p_fingerprint_hash
  ) returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_contact_inquiry(text, text, text, text, text, text) from public;
grant execute on function public.submit_contact_inquiry(text, text, text, text, text, text) to anon, authenticated;

comment on table public.contact_inquiries is '華翼官網聯絡表單詢問；不對公開角色提供讀取權限。';
comment on function public.submit_contact_inquiry(text, text, text, text, text, text) is '驗證並限流新增聯絡詢問；公開角色不可讀取結果資料。';

commit;
