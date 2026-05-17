-- 모임 대표 이미지 + 정모 일정 컬럼 추가
ALTER TABLE groups ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE groups ADD COLUMN IF NOT EXISTS meeting_frequency TEXT; -- 매주/격주/매월/비정기
ALTER TABLE groups ADD COLUMN IF NOT EXISTS meeting_day TEXT;       -- 예) 토, 토·일
ALTER TABLE groups ADD COLUMN IF NOT EXISTS meeting_time TEXT;      -- 예) 10:00

-- Storage 버킷 생성 (이미 있으면 무시)
INSERT INTO storage.buckets (id, name, public)
VALUES ('group-images', 'group-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS 정책
CREATE POLICY IF NOT EXISTS "group_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'group-images');

CREATE POLICY IF NOT EXISTS "group_images_auth_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'group-images');

CREATE POLICY IF NOT EXISTS "group_images_auth_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'group-images');
