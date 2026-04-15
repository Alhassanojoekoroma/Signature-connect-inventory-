-- ============================================================================
-- SIGNATURE CONNECT INVENTORY SYSTEM - SUPABASE SCHEMA
-- ============================================================================
-- This SQL script creates all required tables, indexes, and Row Level Security policies
-- Execute this in Supabase SQL Editor after creating your Supabase project

-- ============================================================================
-- 1. USERS TABLE (Managed by Supabase Auth, extended with custom fields)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('Admin', 'Staff')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. PRODUCTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    has_serial BOOLEAN DEFAULT TRUE,
    unit TEXT DEFAULT 'Pcs',
    description TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_name ON products(name);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. ITEMS TABLE - Core inventory tracking (per-unit items)
-- ============================================================================
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    serial_number TEXT NOT NULL UNIQUE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'IN_STORE' CHECK (status IN ('IN_STORE', 'IN_FIELD', 'RETURNED', 'FAULTY', 'DAMAGED')),
    qr_code_data TEXT,
    assigned_to UUID REFERENCES users(id),
    condition TEXT DEFAULT 'Good Condition',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_items_serial ON items(serial_number);
CREATE INDEX idx_items_product_id ON items(product_id);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_assigned_to ON items(assigned_to);
CREATE UNIQUE INDEX idx_items_serial_unique ON items(serial_number);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. TRANSACTIONS TABLE - Append-only transaction log
-- ============================================================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    serial_number TEXT NOT NULL REFERENCES items(serial_number),
    action TEXT NOT NULL CHECK (action IN ('ADD_STOCK', 'ISSUE', 'RETURN', 'MARK_FAULTY', 'VIEW')),
    user_id UUID NOT NULL REFERENCES users(id),
    customer_name TEXT,
    issued_to UUID REFERENCES users(id),
    returned_by UUID REFERENCES users(id),
    received_by UUID REFERENCES users(id),
    authorized_by UUID REFERENCES users(id),
    approval_status TEXT DEFAULT 'APPROVED' CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    category TEXT,
    condition TEXT,
    quantity INTEGER DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_serial ON transactions(serial_number);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_action ON transactions(action);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_approval ON transactions(approval_status);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. AUDIT_LOGS TABLE - Comprehensive audit trail
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    action TEXT NOT NULL,
    description TEXT,
    affected_table TEXT,
    affected_id TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_affected_table ON audit_logs(affected_table);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. STAFF MEMBERS (Dropdown reference)
-- ============================================================================
CREATE TABLE IF NOT EXISTS staff_directory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    email TEXT,
    role TEXT,
    category TEXT DEFAULT 'General', -- Field Team, Office, Admin
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE staff_directory ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 7. APPROVAL QUEUE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    requested_by UUID REFERENCES users(id),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_approvals_transaction_id ON approvals(transaction_id);
CREATE INDEX idx_approvals_status ON approvals(status);
CREATE INDEX idx_approvals_requested_by ON approvals(requested_by);

ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 8. ACTIVITY LOGS TABLE - Auto-generated activity feed
-- ============================================================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name TEXT NOT NULL,
    user_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT,
    serial_number TEXT REFERENCES items(serial_number) ON DELETE SET NULL,
    message TEXT NOT NULL,
    additional_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_product_id ON activity_logs(product_id);
CREATE INDEX idx_activity_logs_serial_number ON activity_logs(serial_number);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- USERS: Users can only view their own profile, Admin can view all
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (
        auth.uid() = id OR
        (SELECT role FROM users WHERE id = auth.uid()) = 'Admin'
    );

CREATE POLICY "Only admin can insert users" ON users
    FOR INSERT WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'Admin');

CREATE POLICY "Only admin can update users" ON users
    FOR UPDATE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'Admin');

-- PRODUCTS: All authenticated users can view, only admin can modify
CREATE POLICY "All authenticated users can view products" ON products
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admin can insert products" ON products
    FOR INSERT WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'Admin');

CREATE POLICY "Only admin can update products" ON products
    FOR UPDATE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'Admin');

-- ITEMS: All authenticated users can view, only staff and admin can act on items
CREATE POLICY "All authenticated users can view items" ON items
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert items" ON items
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only item owner (assigned_to) or admin can update" ON items
    FOR UPDATE USING (
        auth.uid() = assigned_to OR
        (SELECT role FROM users WHERE id = auth.uid()) = 'Admin'
    );

-- TRANSACTIONS: All authenticated users can view, only staff and admin can insert
CREATE POLICY "All authenticated users can view transactions" ON transactions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert transactions" ON transactions
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Only admin can update transactions" ON transactions
    FOR UPDATE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'Admin');

-- AUDIT_LOGS: Only admin can view, system inserts automatically
CREATE POLICY "Only admin can view audit logs" ON audit_logs
    FOR SELECT USING ((SELECT role FROM users WHERE id = auth.uid()) = 'Admin');

CREATE POLICY "System can insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (true);

-- STAFF_DIRECTORY: All authenticated can view, only admin can modify
CREATE POLICY "All authenticated users can view staff directory" ON staff_directory
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admin can insert staff" ON staff_directory
    FOR INSERT WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'Admin');

-- APPROVALS: Viewable by requester, approver, and admin
CREATE POLICY "Users can view their own approvals" ON approvals
    FOR SELECT USING (
        auth.uid() = requested_by OR
        auth.uid() = approved_by OR
        (SELECT role FROM users WHERE id = auth.uid()) = 'Admin'
    );

-- ACTIVITY_LOGS: All authenticated users can view, system can insert
CREATE POLICY "All authenticated users can view activity logs" ON activity_logs
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert activity logs" ON activity_logs
    FOR INSERT WITH CHECK (true);

-- ============================================================================
-- SEED DATA - Pre-load staff members and basic products
-- ============================================================================

INSERT INTO staff_directory (name, email, role, category) VALUES
    ('Mr Isaac', 'isaac@signatureconnect.com', 'Admin', 'Admin'),
    ('Susan', 'susan@signatureconnect.com', 'Staff', 'Office'),
    ('Fred', 'fred@signatureconnect.com', 'Staff', 'Field Team'),
    ('Foday', 'foday@signatureconnect.com', 'Staff', 'Field Team'),
    ('OJOE', 'ojoe@signatureconnect.com', 'Staff', 'Field Team'),
    ('Emmanuel', 'emmanuel@signatureconnect.com', 'Staff', 'Office')
ON CONFLICT (name) DO NOTHING;

INSERT INTO products (name, category, has_serial, unit) VALUES
    ('769XR XPON Router', 'Router', TRUE, 'Pcs'),
    ('Cody Router', 'Router', TRUE, 'Pcs'),
    ('Tender Router', 'Router', TRUE, 'Pcs'),
    ('D-Link Router', 'Router', TRUE, 'Pcs'),
    ('Black ONT', 'ONT', TRUE, 'Pcs'),
    ('Nokia ONU', 'ONU', TRUE, 'Pcs'),
    ('Sig. Connect ONT (122 XR)', 'ONT', TRUE, 'Pcs'),
    ('ONU', 'ONU', TRUE, 'Pcs'),
    ('Mikrotik 951', 'Router', TRUE, 'Pcs'),
    ('Starlink Mesh Router Gen-3', 'Router', TRUE, 'Pcs'),
    ('Desktop Switch', 'Switch', TRUE, 'Pcs'),
    ('8 Port Gigabit POE Switch', 'Switch', TRUE, 'Pcs'),
    ('Tp-Link Load Balancer', 'Networking', TRUE, 'Pcs'),
    ('Lite Beam-Gen 2', 'Wireless', TRUE, 'Pcs'),
    ('Fiber Connectors', 'Consumable', FALSE, 'Box'),
    ('Cable Clip-10mm', 'Consumable', FALSE, 'Box'),
    ('Clamps', 'Consumable', FALSE, 'Box')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to automatically log to audit_logs on transaction insert
CREATE OR REPLACE FUNCTION log_transaction_audit()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        user_id,
        action,
        description,
        affected_table,
        affected_id,
        new_values
    ) VALUES (
        NEW.user_id,
        'TRANSACTION_' || NEW.action,
        'User ' || (SELECT name FROM users WHERE id = NEW.user_id) ||
        ' performed ' || NEW.action || ' on serial ' || NEW.serial_number,
        'transactions',
        NEW.id::TEXT,
        row_to_json(NEW)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_transaction
    AFTER INSERT ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION log_transaction_audit();

-- Function to update item status based on transaction
CREATE OR REPLACE FUNCTION update_item_status_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE items
    SET 
        status = CASE
            WHEN NEW.action = 'ISSUE' THEN 'IN_FIELD'
            WHEN NEW.action = 'RETURN' THEN 'RETURNED'
            WHEN NEW.action = 'MARK_FAULTY' THEN 'FAULTY'
            WHEN NEW.action = 'ADD_STOCK' THEN 'IN_STORE'
            ELSE status
        END,
        assigned_to = CASE
            WHEN NEW.action = 'ISSUE' THEN NEW.issued_to
            WHEN NEW.action = 'RETURN' THEN NULL
            ELSE assigned_to
        END,
        condition = COALESCE(NEW.condition, condition),
        updated_at = CURRENT_TIMESTAMP
    WHERE serial_number = NEW.serial_number;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_item_status
    AFTER INSERT ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_item_status_on_transaction();

-- Update timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_users_timestamp BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_products_timestamp BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_items_timestamp BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_transactions_timestamp BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_approvals_timestamp BEFORE UPDATE ON approvals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to auto-generate activity log message on transaction insert
CREATE OR REPLACE FUNCTION log_activity_on_transaction()
RETURNS TRIGGER AS $$
DECLARE
    user_name TEXT;
    product_name TEXT;
    activity_message TEXT;
BEGIN
    -- Get user name
    SELECT name INTO user_name FROM users WHERE id = NEW.user_id;
    user_name := COALESCE(user_name, 'Unknown User');
    
    -- Get product name if item has it
    IF NEW.serial_number IS NOT NULL THEN
        SELECT p.name INTO product_name FROM products p
        JOIN items i ON i.product_id = p.id
        WHERE i.serial_number = NEW.serial_number;
    END IF;
    
    -- Generate appropriate message based on action
    activity_message := CASE
        WHEN NEW.action = 'ADD_STOCK' THEN
            user_name || ' added ' || COALESCE(NEW.quantity::TEXT, 'item') || ' ' || 
            COALESCE(product_name, 'items') || ' to stock'
        WHEN NEW.action = 'ISSUE' THEN
            user_name || ' issued ' || COALESCE(NEW.serial_number, 'item') || 
            CASE WHEN NEW.customer_name IS NOT NULL THEN ' to ' || NEW.customer_name ELSE '' END
        WHEN NEW.action = 'RETURN' THEN
            user_name || ' returned ' || COALESCE(NEW.serial_number, 'item') || 
            ' (' || COALESCE(NEW.condition, 'Good Condition') || ')'
        WHEN NEW.action = 'MARK_FAULTY' THEN
            user_name || ' marked ' || COALESCE(NEW.serial_number, 'item') || ' as faulty'
        WHEN NEW.action = 'VIEW' THEN
            user_name || ' viewed item ' || COALESCE(NEW.serial_number, 'unknown')
        ELSE user_name || ' performed ' || NEW.action
    END;
    
    -- Insert activity log
    INSERT INTO activity_logs (
        user_name,
        user_id,
        action,
        product_id,
        product_name,
        serial_number,
        message,
        additional_data
    ) VALUES (
        user_name,
        NEW.user_id,
        NEW.action,
        (SELECT product_id FROM items WHERE serial_number = NEW.serial_number LIMIT 1),
        product_name,
        NEW.serial_number,
        activity_message,
        jsonb_build_object(
            'customer_name', NEW.customer_name,
            'condition', NEW.condition,
            'quantity', NEW.quantity
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_activity_on_transaction
    AFTER INSERT ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION log_activity_on_transaction();

-- Function to log login activity
CREATE OR REPLACE FUNCTION log_login_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO activity_logs (
        user_name,
        user_id,
        action,
        message
    ) VALUES (
        NEW.name,
        NEW.id,
        'LOGIN',
        NEW.name || ' logged into the system'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: Login trigger should be created manually in a deployment script
-- as it requires coordination with Supabase Auth webhooks

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
