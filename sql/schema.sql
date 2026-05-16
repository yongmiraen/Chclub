-- 크로소 (크리스천 소모임) Supabase 스키마
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 실행하세요.

create extension if not exists "pgcrypto";

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 60),
  description text not null check (char_length(description) <= 2000),
  category text not null,
  region text,
  max_members int not null check (max_members between 2 and 200),
  creator_nickname text not null check (char_length(creator_nickname) between 1 and 20),
  edit_pin_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists groups_created_at_idx on public.groups (created_at desc);
create index if not exists groups_category_idx on public.groups (category);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 20),
  contact text,
  message text,
  created_at timestamptz not null default now()
);

create index if not exists memberships_group_idx
  on public.memberships (group_id, created_at desc);

alter table public.groups enable row level security;
alter table public.memberships enable row level security;

-- 로그인 없는 데모이므로 anon 키에 모든 작업을 허용합니다.
-- 실제 PIN 검증은 서버 액션 코드에서 처리합니다.
drop policy if exists "anon_all_groups" on public.groups;
create policy "anon_all_groups" on public.groups
  for all to anon using (true) with check (true);

drop policy if exists "anon_all_memberships" on public.memberships;
create policy "anon_all_memberships" on public.memberships
  for all to anon using (true) with check (true);
