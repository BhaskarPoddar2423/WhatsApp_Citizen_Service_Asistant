-- ==========================================
-- NUCLEAR PERMISSION FIX - Run this ONCE
-- This grants ALL permissions for the demo
-- ==========================================

-- 1. Disable RLS temporarily to allow operations
ALTER TABLE IF EXISTS citizens DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS service_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS request_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notification_reads DISABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies (clean slate)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.tablename;
    END LOOP;
END $$;

-- 3. Re-enable RLS
ALTER TABLE IF EXISTS citizens ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS request_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notification_reads ENABLE ROW LEVEL SECURITY;

-- 4. Create permissive policies for ALL tables (allow everything for demo)

-- Citizens
CREATE POLICY "Allow all on citizens" ON citizens FOR ALL USING (true) WITH CHECK (true);

-- Service Requests
CREATE POLICY "Allow all on service_requests" ON service_requests FOR ALL USING (true) WITH CHECK (true);

-- Request History
CREATE POLICY "Allow all on request_history" ON request_history FOR ALL USING (true) WITH CHECK (true);

-- Admin Users
CREATE POLICY "Allow all on admin_users" ON admin_users FOR ALL USING (true) WITH CHECK (true);

-- Notifications
CREATE POLICY "Allow all on notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);

-- Notification Reads
CREATE POLICY "Allow all on notification_reads" ON notification_reads FOR ALL USING (true) WITH CHECK (true);

-- 5. Insert demo citizen if not exists
INSERT INTO citizens (id, name, phone, language)
VALUES ('00000000-0000-0000-0000-000000000000', 'Demo Citizen', '9999999999', 'en')
ON CONFLICT (id) DO NOTHING;

-- 6. Verify: List all policies (should show 6 new ones)
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename;
