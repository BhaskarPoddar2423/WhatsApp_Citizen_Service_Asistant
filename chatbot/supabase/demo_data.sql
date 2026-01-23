-- Insert Demo Citizen for Chatbot Testing
-- Run this in Supabase SQL Editor

INSERT INTO citizens (id, name, phone, language)
VALUES (
  '00000000-0000-0000-0000-000000000000', 
  'Demo Citizen', 
  '9876543210',
  'en'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name;

-- Ensure service_requests can be created by this user
INSERT INTO service_requests (citizen_id, category, status, description)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'complaint',
  'new',
  'Test complaint from Demo Citizen'
)
ON CONFLICT DO NOTHING;
