-- COMPREHENSIVE PERMISSION FIX
-- Run this to resolve 403 Errors for Chatbot

-- 1. Citizens Table: Allow everything (simplest for demo)
ALTER TABLE citizens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access citizens" ON citizens;
CREATE POLICY "Public access citizens" ON citizens FOR ALL USING (true) WITH CHECK (true);

-- 2. Service Requests Table: Allow insert/select for chatbot
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access service_requests" ON service_requests;
CREATE POLICY "Public access service_requests" ON service_requests FOR ALL USING (true) WITH CHECK (true);

-- 3. Request History Table: Allow logging
ALTER TABLE request_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access request_history" ON request_history;
CREATE POLICY "Public access request_history" ON request_history FOR ALL USING (true) WITH CHECK (true);

-- 4. Notifications Table: Allow reading
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access notifications" ON notifications;
CREATE POLICY "Public access notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);

-- 5. Notification Reads: Allow tracking
ALTER TABLE notification_reads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access notification_reads" ON notification_reads;
CREATE POLICY "Public access notification_reads" ON notification_reads FOR ALL USING (true) WITH CHECK (true);

-- 6. Insert Demo Citizen (Idempotent)
INSERT INTO citizens (id, name, phone, language)
VALUES ('00000000-0000-0000-0000-000000000000', 'Demo Citizen', '9999999999', 'en')
ON CONFLICT (id) DO NOTHING;
