# Signature Connect - Supabase Integration Implementation Guide

## Overview

This document explains the complete Supabase backend integration for the Signature Connect Inventory System. The system now provides:

- ✅ Secure admin-controlled authentication (no public signup)
- ✅ Per-item QR tracking with unique serial numbers
- ✅ Real-time transaction logging and audit trails
- ✅ Database-driven inventory management
- ✅ Mobile-first progressive web app design
- ✅ Row-level security for role-based access

---

## Architecture Changes

### Before (Google Sheets Only)
```
React Frontend → Node.js Backend → Google Sheets
```

### After (Supabase Database)
```
React Frontend → Supabase (PostgreSQL + Auth + Realtime)
                 ├── Users & Auth
                 ├── Products & Items
                 ├── Transactions (append-only audit log)
                 └── Audit Logs (comprehensive trail)
```

---

## File Structure

### Frontend Services (New)

```
frontend/src/utils/
├── supabaseClient.js         # Supabase initialization
├── authService.js            # Authentication operations
├── productService.js         # Products & Items CRUD
├── transactionService.js     # Transaction logging
├── qrService.js              # QR code generation/parsing
├── staffService.js           # Staff directory & audit logs
└── api.js                    # Centralized API exports
```

### Updated Components

```
frontend/src/
├── pages/
│   ├── LoginPage.jsx         # Email/password login (Supabase Auth)
│   ├── ScanPage.jsx          # QR scanner with item lookup
│   ├── IssuePage.jsx         # Issue item transaction
│   ├── ReturnPage.jsx        # Return item transaction
│   ├── StockPage.jsx         # Add stock transaction
│   ├── DetailPage.jsx        # Item details & history
│   └── DashboardPage.jsx     # Real-time inventory dashboard
└── utils/
    └── AuthContext.js        # Updated with Supabase session handling
```

---

## Core Features Implemented

### 1. Authentication
- Admin-only user creation (no public signup)
- Email + Password login via Supabase Auth
- Role-based access (Admin, Staff)
- Session persistence & automatic logout after inactivity

**Files:** `authService.js`, `AuthContext.js`, `LoginPage.jsx`

### 2. Item Management
- Each item has unique serial number
- Products are predefined with categories
- Per-item tracking with status (IN_STORE, IN_FIELD, RETURNED, FAULTY)
- Automatic item creation at "Add Stock"

**Files:** `productService.js`, `itemService.js`

### 3. Transaction Logging (Append-Only)
- All inventory actions create immutable transaction records
- Never edited or deleted - only appended
- Actions: ADD_STOCK, ISSUE, RETURN, MARK_FAULTY, VIEW
- Each transaction logs: who, what, when, why

**Files:** `transactionService.js`

**Example Transaction Flow:**
```
Staff clicks "Issue Item"
  ↓
ScanPage calls itemService.getItemBySerial()
  ↓
IssuePage.jsx captures: customer_name, issued_to, authorized_by, category
  ↓
transactionService.issueTransaction() creates transaction record
  ↓
Database trigger updates item.status to IN_FIELD
  ↓
Database trigger logs to audit_logs table
```

### 4. QR Code System
- Each item gets a unique QR code at creation
- QR encodes only the serial number
- QRService generates printable sheets (A4 layout)
- Laminated labels recommended for field durability

**Files:** `qrService.js`

**QR Flow:**
```
Admin: Add Stock → System creates items → Generates QR codes
                ↓
                Displays print sheet with:
                  • QR image
                  • Product name
                  • Serial number
                ↓
Admin: Print → Cut → Laminate → Attach to items
```

### 5. Audit Trail
- Every transaction logged
- User tracking (who performed action)
- Timestamp on every action
- Complete history per serial number

**Files:** `auditLogService.js`

**Admin can view:**
- Who issued which item when
- All returns and conditions
- Who marked items faulty
- Complete item lifecycle

### 6. Dashboard
- Real-time inventory statistics
- Low stock alerts (≤3 items)
- Daily action summary
- Status badges per product (🟢 🟡 🔴)

**Files:** `DashboardPage.jsx`

---

## Database Schema Overview

### Users Table
```sql
id (UUID, from Supabase Auth)
name (display name)
email (unique, from Auth)
role (Admin | Staff)
is_active (boolean)
```

### Products Table
```sql
id
name
category (Router, ONT, ONU, Switch, etc.)
has_serial (boolean - for consumables)
unit (Pcs, Boxes, etc.)
```

### Items Table (Per-Unit Tracking)
```sql
id
serial_number (UNIQUE - primary identifier)
product_id (FK to products)
status (IN_STORE | IN_FIELD | RETURNED | FAULTY | DAMAGED)
assigned_to (FK to users - who has it)
condition (Good Condition, Faulty, etc.)
created_at, updated_at
```

### Transactions Table (Append-Only Audit Log)
```sql
id
serial_number
action (ADD_STOCK | ISSUE | RETURN | MARK_FAULTY | VIEW)
user_id (who performed action)
customer_name, issued_to, returned_by, received_by, authorized_by
approval_status (PENDING | APPROVED | REJECTED)
category, condition, quantity, notes
created_at (immutable)
```

### Audit_Logs Table
```sql
id
user_id
action (automatic trigger on transaction insert)
description
affected_table, affected_id
old_values, new_values (JSONB)
timestamp
```

---

## Setup Instructions

### Step 1: Create Supabase Project
1. Go to https://supabase.com → Create Project
2. Name: `signature-connect-inventory`
3. Save credentials in `.env` file

### Step 2: Run Database Schema
1. Go to Supabase → SQL Editor
2. Copy entire `SUPABASE_SCHEMA.sql`
3. Run in SQL Editor
4. Wait for all triggers and functions to complete

### Step 3: Create Authentication Users

**Admin User:**
- Email: `admin@signatureconnect.com`
- Password: (strong password)

**Staff Users:**
- Email: `staff@signatureconnect.com` (or per-staff emails)
- Password: (can be shared for v1)

After creating in Supabase Auth, add to `users` table:
```sql
INSERT INTO users (id, name, email, role, is_active) VALUES
  ('auth_uuid_here', 'Mr Isaac', 'admin@signatureconnect.com', 'Admin', TRUE),
  ('auth_uuid_here', 'Staff Member', 'staff@signatureconnect.com', 'Staff', TRUE);
```

### Step 4: Update Frontend .env
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 5: Install Dependencies
```bash
cd frontend
npm install
npm start
```

---

## Usage Examples

### Login
```javascript
import { useAuth } from './utils/AuthContext';

const { login, user, error } = useAuth();

// Login
await login('admin@signatureconnect.com', 'password');

// User now available
console.log(user);
// { id: 'uuid', email: '...', name: 'Mr Isaac', role: 'Admin' }

// Check if admin
if (user.role === 'Admin') {
  // Show admin features
}
```

### Scan and Issue Item
```javascript
import { itemService } from './utils/productService';
import { transactionService } from './utils/transactionService';

// User scans QR code → gets serial number
const item = await itemService.getItemBySerial('XPONDD87A2D2');

// Item details fetched from database
console.log(item);
// { serial_number: '...', product: {...}, status: 'IN_STORE', ... }

// Log issue transaction
const transaction = await transactionService.issueTransaction(
  'XPONDD87A2D2',
  user.id,
  {
    customer_name: 'John Doe',
    issued_to: 'Fred',
    authorized_by: 'Mr Isaac',
    category: 'Installation'
  }
);

// Database automatically:
// • Creates transaction record
// • Updates item.status to IN_FIELD
// • Updates item.assigned_to to Fred
// • Logs to audit_logs table
```

### Generate QR Codes for Printing
```javascript
import { qrService } from './utils/qrService';

// After adding new stock items
const items = [
  { serial_number: 'NEW001', product_name: '769XR XPON Router' },
  { serial_number: 'NEW002', product_name: '769XR XPON Router' },
  { serial_number: 'NEW003', product_name: 'Nokia ONU' },
];

const qrCodes = await qrService.generateBatchQRCodes(items);

// Generate printable HTML (can be printed to PDF)
const html = await qrService.generatePrintSheet(items, 'Q R Code Labels - 2026');

// Display in new window for printing
window.open('about:blank');
// ... insert HTML ...
```

### View Transaction History for Item
```javascript
import { transactionService } from './utils/transactionService';

const history = await transactionService.getTransactionsBySerial('XPONDD87A2D2');

// Returns all actions on this serial number:
// [
//   { action: 'ADD_STOCK', user: 'Mr Isaac', created_at: '2026-04-01', ... },
//   { action: 'ISSUE', user: 'Susan', customer: 'John Doe', issued_to: 'Fred', ... },
//   { action: 'RETURN', user: 'Fred', returned_by: 'Fred', condition: 'Good', ... },
// ]
```

### Admin View All Activity
```javascript
import { auditLogService } from './utils/staffService';

// Get all action in last 7 days
const logs = await auditLogService.getAllAuditLogs();

// Filter by user
const userLogs = await auditLogService.getAuditLogsByUser(userId);

// Get user activity summary
const summary = await auditLogService.getUserActivitySummary(userId, 7);
// { totalActions: 42, actions: { ISSUE: 30, RETURN: 12, VIEW: 5, ... }, ... }
```

---

## Row-Level Security (RLS)

All tables have RLS enabled. Users can only access data based on role:

| Table | Public | Staff | Admin |
|-------|--------|-------|-------|
| users | ❌ | Own only | All |
| products | ✅ | All | All |
| items | ✅ | All | All |
| transactions | ✅ | All | All |
| audit_logs | ❌ | ❌ | All |
| staff_directory | ✅ | All | All |
| approvals | ✅ | Own/In | All |

---

## Key Workflows

### 1. Adding New Stock (Admin)
```
1. Navigate to Stock page
2. Select product (or create new)
3. Enter serial numbers (one per item)
4. System creates items in database
5. System generates QR codes
6. Admin prints & attaches labels
7. Transactions logged
```

### 2. Issuing Item (Staff)
```
1. Scan or enter serial number
2. System looks up item in database
3. Displays: product, status, condition
4. Staff selects action: ISSUE
5. Navigate to Issue Form
6. Enter: customer, issued_to, authorized_by, category
7. Form submits
8. Database creates transaction
9. Database updates item.status to IN_FIELD
10. Database logs to audit_logs
11. Show confirmation toast
```

### 3. Returning Item (Staff)
```
1. Scan or enter serial number
2. Staff selects action: RETURN
3. Navigate to Return Form
4. Enter: returned_by, received_by, condition
5. Form submits
6. Database creates return transaction
7. If faulty: flag for admin review
8. Admin manually updates Faulty Units column (future)
```

### 4. Viewing Item History (Any Staff)
```
1. Scan or enter serial number
2. Staff selects action: HISTORY
3. Navigate to Detail/History page
4. Display all transactions for this serial
5. Show timeline: Added → Issued → Returned
6. Show who handled it and when
```

---

## Troubleshooting

### Login Error: "Invalid credentials"
- Verify email exists in Supabase Auth
- Verify password is correct
- Restart dev server to reload `.env` variables

### Scan Error: "Item not found"
- Item doesn't exist in database yet
- For existing items, run seed script or add manually
- Check serial number format (case-sensitive)

### Camera Won't Start
- Browser may not have permission
- Check browser permissions for camera access
- Some browsers require HTTPS for camera (desktop works, mobile upload need to https)

### Database queries return empty
- RLS policy may be blocking access
- Manually test in Supabase SQL Editor
- Check user role is set correctly

### QR Code Not Generating
- Check `qrcode` npm package installed
- Verify serial number is not empty
- Check browser console for errors

---

## Performance Notes

- All queries are indexed by serial_number and status for fast lookups
- Transactions table has timestamp index for date filtering
- Audit log searches are efficient with user_id and action indexes
- Consider adding pagination for large datasets (Phase 2)

---

## Security Notes

- ✅ API keys stored in `.env`, never exposed to frontend
- ✅ Service Role key kept secure on backend only
- ✅ All user inputs validated before database insert
- ✅ Row-level security prevents unauthorized access
- ✅ Transactions are append-only (immutable after insert)
- ✅ No direct item/transaction editing allowed
- ✅ All actions logged for audit trail

---

## Next Steps (Phase 2)

- [ ] Implement approval workflow (PENDING → APPROVED/REJECTED)
- [ ] Offline mode (queue transactions, sync on reconnect)
- [ ] Low stock notifications (WhatsApp/Email)
- [ ] Export reports (PDF/CSV)
- [ ] Barcode scanning support
- [ ] Faulty item management workflow
- [ ] Expected return tracking
- [ ] Analytics dashboard

---

## Support

For issues or questions:
1. Check SUPABASE_SETUP.md for credential errors
2. Review SUPABASE_SCHEMA.sql for database structure
3. Check browser console for error messages
4. Verify `.env` variables are set
5. Test queries in Supabase SQL Editor

---

*Last Updated: April 14, 2026*
*Signature Connect Inventory System v2.0*
