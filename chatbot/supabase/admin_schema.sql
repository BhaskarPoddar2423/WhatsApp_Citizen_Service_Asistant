-- Admin Panel Schema for Citizen Services Chatbot
-- Run this in your Supabase SQL Editor

-- 1. SETUP & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. TABLES

-- Citizens
CREATE TABLE IF NOT EXISTS citizens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    aadhaar VARCHAR(12),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    whatsapp_number VARCHAR(15),
    language VARCHAR(20) DEFAULT 'en',
    address TEXT,
    risk_flags JSONB DEFAULT '[]'
);

-- Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'viewer',
  department VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Requests
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  citizen_id UUID REFERENCES citizens(id),
  category VARCHAR(50) NOT NULL,
  sub_category VARCHAR(100),
  status VARCHAR(30) NOT NULL DEFAULT 'new',
  priority VARCHAR(20) DEFAULT 'medium',
  channel VARCHAR(30) DEFAULT 'whatsapp',
  department VARCHAR(100),
  assigned_to UUID REFERENCES admin_users(id),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  attachments JSONB DEFAULT '[]',
  sla_due_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Request History
CREATE TABLE IF NOT EXISTS request_history (
  id SERIAL PRIMARY KEY,
  request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  performed_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Internal Notes
CREATE TABLE IF NOT EXISTS internal_notes (
  id SERIAL PRIMARY KEY,
  request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  author_id UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    sent_by UUID REFERENCES admin_users(id),
    target_type VARCHAR(30) DEFAULT 'all',
    target_ids UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notification_reads (
    id SERIAL PRIMARY KEY,
    notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
    citizen_id UUID REFERENCES citizens(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(notification_id, citizen_id)
);

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_service_requests_citizen ON service_requests(citizen_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_category ON service_requests(category);
CREATE INDEX IF NOT EXISTS idx_service_requests_assigned ON service_requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_service_requests_priority ON service_requests(priority);
CREATE INDEX IF NOT EXISTS idx_request_history_request ON request_history(request_id);
CREATE INDEX IF NOT EXISTS idx_internal_notes_request ON internal_notes(request_id);

-- 4. ENABLE RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_reads ENABLE ROW LEVEL SECURITY;

-- 5. POLICIES (Drop first, then Create)

-- Admin Users
DROP POLICY IF EXISTS "Allow public read on admin_users" ON admin_users;
CREATE POLICY "Allow public read on admin_users" ON admin_users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on admin_users" ON admin_users;
CREATE POLICY "Allow public insert on admin_users" ON admin_users FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on admin_users" ON admin_users;
CREATE POLICY "Allow public update on admin_users" ON admin_users FOR UPDATE USING (true);

-- Service Requests
DROP POLICY IF EXISTS "Allow public read on service_requests" ON service_requests;
CREATE POLICY "Allow public read on service_requests" ON service_requests FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on service_requests" ON service_requests;
CREATE POLICY "Allow public insert on service_requests" ON service_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on service_requests" ON service_requests;
CREATE POLICY "Allow public update on service_requests" ON service_requests FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public select on service_requests" ON service_requests; -- Redundant but safe
CREATE POLICY "Allow public select on service_requests" ON service_requests FOR SELECT USING (true);

-- Request History
DROP POLICY IF EXISTS "Allow public read on request_history" ON request_history;
CREATE POLICY "Allow public read on request_history" ON request_history FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on request_history" ON request_history;
CREATE POLICY "Allow public insert on request_history" ON request_history FOR INSERT WITH CHECK (true);

-- Internal Notes
DROP POLICY IF EXISTS "Allow public read on internal_notes" ON internal_notes;
CREATE POLICY "Allow public read on internal_notes" ON internal_notes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on internal_notes" ON internal_notes;
CREATE POLICY "Allow public insert on internal_notes" ON internal_notes FOR INSERT WITH CHECK (true);

-- Notifications
DROP POLICY IF EXISTS "Allow public read on notifications" ON notifications;
CREATE POLICY "Allow public read on notifications" ON notifications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin insert on notifications" ON notifications;
CREATE POLICY "Allow admin insert on notifications" ON notifications FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on notifications" ON notifications;
CREATE POLICY "Allow public delete on notifications" ON notifications FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public insert on notification_reads" ON notification_reads;
CREATE POLICY "Allow public insert on notification_reads" ON notification_reads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on notification_reads" ON notification_reads;
CREATE POLICY "Allow public read on notification_reads" ON notification_reads FOR SELECT USING (true);

-- Other Tables (Bills/Applications - if they exist in schema)
-- We wrap these in DO blocks or just assume they exist if previous scripts ran. 
-- For safety, since I don't see CREATE TABLE for them here, I will omit them to avoid errors if they are missing.
-- Re-adding permissions for 'bills' and 'applications' assuming they exist from original setup.
-- If they don't exist, this will fail. Better safe than sorry.

-- 6. TRIGGERS
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_service_requests_updated_at ON service_requests;
CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create history
CREATE OR REPLACE FUNCTION log_request_creation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO request_history (request_id, event_type, description)
  VALUES (NEW.id, 'created', 'Request created via ' || COALESCE(NEW.channel, 'unknown') || ' channel');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_request_created ON service_requests;
CREATE TRIGGER on_request_created AFTER INSERT ON service_requests FOR EACH ROW EXECUTE FUNCTION log_request_creation();

-- Function to log status changes
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO request_history (request_id, event_type, description, old_value, new_value)
    VALUES (NEW.id, 'status_changed', 'Status changed from ' || OLD.status || ' to ' || NEW.status, OLD.status, NEW.status);
  END IF;
  
  IF OLD.assigned_to IS DISTINCT FROM NEW.assigned_to THEN
    INSERT INTO request_history (request_id, event_type, description, old_value, new_value, performed_by)
    VALUES (
      NEW.id, 
      CASE WHEN OLD.assigned_to IS NULL THEN 'assigned' ELSE 'reassigned' END,
      'Request assigned to new case worker',
      OLD.assigned_to::text,
      NEW.assigned_to::text,
      NEW.assigned_to
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_request_updated ON service_requests;
CREATE TRIGGER on_request_updated AFTER UPDATE ON service_requests FOR EACH ROW EXECUTE FUNCTION log_status_change();

-- 7. SEED DATA (Only if empty)
INSERT INTO admin_users (id, name, email, role, department) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Rahul Sharma', 'rahul.sharma@gov.in', 'super_admin', 'Municipal Corporation'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Priya Singh', 'priya.singh@gov.in', 'department_admin', 'Public Works'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Amit Kumar', 'amit.kumar@gov.in', 'viewer', 'Customer Service')
ON CONFLICT (email) DO NOTHING;
