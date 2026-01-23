-- Fix Delete Permissions for Notifications
-- Run this in Supabase SQL Editor

-- 1. Drop existing delete policy if any
DROP POLICY IF EXISTS "Allow list delete on notifications" ON notifications;
DROP POLICY IF EXISTS "Allow admin delete on notifications" ON notifications;
DROP POLICY IF EXISTS "Allow public delete on notifications" ON notifications;

-- 2. Create permissive delete policy (allows frontend to delete)
CREATE POLICY "Allow public delete on notifications"
  ON notifications FOR DELETE
  USING (true);

-- 3. Verify RLS is enabled
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
