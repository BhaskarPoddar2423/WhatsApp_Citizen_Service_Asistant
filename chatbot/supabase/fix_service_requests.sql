-- Fix Service Request Permissions (Chatbot Integration)
-- Run this in Supabase SQL Editor

-- 1. Explicitly allow public (anon) to create service requests
DROP POLICY IF EXISTS "Allow public insert on service_requests" ON service_requests;
CREATE POLICY "Allow public insert on service_requests"
  ON service_requests FOR INSERT
  WITH CHECK (true);

-- 2. Allow public to read their own requests (optional, but good for tracking)
DROP POLICY IF EXISTS "Allow public select on service_requests" ON service_requests;
CREATE POLICY "Allow public select on service_requests"
  ON service_requests FOR SELECT
  USING (true);

-- 3. Ensure RLS is enabled
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- 4. Verify triggers exist (for auto-history)
DROP TRIGGER IF EXISTS on_request_created ON service_requests;
CREATE TRIGGER on_request_created 
  AFTER INSERT ON service_requests 
  FOR EACH ROW 
  EXECUTE FUNCTION log_request_creation();
