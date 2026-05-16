-- 크로소: 로그인 기능 추가를 위한 마이그레이션
-- Supabase SQL Editor 에서 실행하세요.

-- groups 테이블에 owner_id 추가 (로그인한 사용자의 auth.users id)
-- nullable: 기존 PIN 기반 모임과의 하위 호환 유지
alter table public.groups
  add column if not exists owner_id uuid references auth.users(id) on delete set null;

-- memberships 테이블에 user_id 추가 (로그인한 참여자)
alter table public.memberships
  add column if not exists user_id uuid references auth.users(id) on delete set null;

-- 인덱스
create index if not exists groups_owner_idx on public.groups (owner_id);
create index if not exists memberships_user_idx on public.memberships (user_id);

-- RLS: 인증 사용자 본인 모임만 수정·삭제 가능 (owner_id 있는 경우)
-- 기존 anon_all 정책은 그대로 두고, 더 구체적인 인증 정책을 추가합니다.
-- (비로그인 모임은 서버에서 PIN으로 별도 검증)

-- 인증 사용자 본인 게시물 조작 정책
drop policy if exists "auth_owner_update_groups" on public.groups;
create policy "auth_owner_update_groups" on public.groups
  for update to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "auth_owner_delete_groups" on public.groups;
create policy "auth_owner_delete_groups" on public.groups
  for delete to authenticated
  using (owner_id = auth.uid());

drop policy if exists "auth_read_groups" on public.groups;
create policy "auth_read_groups" on public.groups
  for select to authenticated using (true);

drop policy if exists "auth_insert_groups" on public.groups;
create policy "auth_insert_groups" on public.groups
  for insert to authenticated with check (owner_id = auth.uid());

drop policy if exists "auth_read_memberships" on public.memberships;
create policy "auth_read_memberships" on public.memberships
  for select to authenticated using (true);

drop policy if exists "auth_insert_memberships" on public.memberships;
create policy "auth_insert_memberships" on public.memberships
  for insert to authenticated with check (true);

drop policy if exists "auth_delete_own_membership" on public.memberships;
create policy "auth_delete_own_membership" on public.memberships
  for delete to authenticated
  using (user_id = auth.uid());
