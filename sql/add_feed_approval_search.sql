-- 1. 멤버십 수락/거절 상태
ALTER TABLE memberships ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved';
-- 기존 데이터는 approved 유지, 새 신청은 코드에서 pending으로 설정

-- 2. 활동 피드 (모임 후기/소식)
CREATE TABLE IF NOT EXISTS group_posts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id   UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  author_id  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content    TEXT NOT NULL CHECK (char_length(content) <= 1000),
  image_url  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE group_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts_public_read"  ON group_posts FOR SELECT USING (true);
CREATE POLICY "posts_auth_insert"  ON group_posts FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid());
CREATE POLICY "posts_auth_delete"  ON group_posts FOR DELETE TO authenticated
  USING (author_id = auth.uid());

-- 3. 신고
CREATE TABLE IF NOT EXISTS reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  group_id    UUID REFERENCES groups(id) ON DELETE CASCADE,
  reason      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports_auth_insert" ON reports FOR INSERT TO authenticated
  WITH CHECK (reporter_id = auth.uid());
