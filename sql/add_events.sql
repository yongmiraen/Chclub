-- 정모 일정
CREATE TABLE IF NOT EXISTS group_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id      UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  title         TEXT NOT NULL CHECK (char_length(title) <= 60),
  description   TEXT CHECK (char_length(description) <= 500),
  location      TEXT CHECK (char_length(location) <= 100),
  event_date    TIMESTAMPTZ NOT NULL,
  max_attendees INTEGER CHECK (max_attendees > 0),
  created_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE group_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_public_read"  ON group_events FOR SELECT USING (true);
CREATE POLICY "events_auth_insert"  ON group_events FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());
CREATE POLICY "events_auth_delete"  ON group_events FOR DELETE TO authenticated
  USING (created_by = auth.uid());

-- 참석 여부
CREATE TABLE IF NOT EXISTS event_attendees (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   UUID NOT NULL REFERENCES group_events(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (event_id, user_id)
);
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "attendees_public_read"  ON event_attendees FOR SELECT USING (true);
CREATE POLICY "attendees_auth_insert"  ON event_attendees FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "attendees_auth_delete"  ON event_attendees FOR DELETE TO authenticated
  USING (user_id = auth.uid());
