# Technical Reference - Signature Connect Supabase Integration

## API Service Layer Overview

All Supabase interactions are abstraction through service modules for clean, reusable code.

### Service Modules

#### 1. authService.js
Handles Supabase Authentication operations.

```javascript
import authService from './utils/authService';

// Login
const result = await authService.login(email, password);
// Returns: { user: {...}, session: {...} }

// Logout
await authService.logout();

// Get current user
const user = await authService.getCurrentUser();

// Check if admin
const isAdmin = await authService.isAdmin();

// Listen to auth changes
authService.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // User logged in
  } else if (event === 'SIGNED_OUT') {
    // User logged out
  }
});
```

#### 2. productService.js & itemService.js
Manage products and individual items.

```javascript
import { productService, itemService } from './utils/productService';

// Get all products
const products = await productService.getAllProducts();

// Get product by name
const product = await productService.getProductByName('769XR XPON Router');

// Get all items
const items = await itemService.getAllItems();

// Get item by serial (with joins)
const item = await itemService.getItemBySerial('XPONDD87A2D2');
// Returns: { id, serial_number, product: {...}, status, assigned_to: {...}, ... }

// Get items by product
const productItems = await itemService.getItemsByProductId(productId);

// Get items by status
const inField = await itemService.getItemsByStatus('IN_FIELD');

// Create single item
const item = await itemService.createItem({
  serial_number: 'NEW-001',
  product_id: 'uuid-here',
  condition: 'Good Condition'
});

// Create batch items
const items = await itemService.createItems([
  { serial_number: 'BATCH-001', product_id: 'uuid' },
  { serial_number: 'BATCH-002', product_id: 'uuid' },
]);

// Update item status
await itemService.updateItemStatus('SERIAL-001', 'IN_FIELD', {
  assigned_to: 'staff-uuid'
});

// Get inventory stats
const stats = await itemService.getInventoryStats();
// Returns: { total, in_store, in_field, returned, faulty, damaged }

// Get low stock items
const lowStock = await itemService.getLowStockItems(threshold = 3);
```

#### 3. transactionService.js
Handles all transaction logging (append-only audit trail).

```javascript
import { transactionService } from './utils/transactionService';

// Get all transactions
const all = await transactionService.getAllTransactions();

// Get transactions for specific serial
const history = await transactionService.getTransactionsBySerial('XPONDD87A2D2');

// Get transactions by user
const userTxns = await transactionService.getTransactionsByUser(userId);

// Get transactions by action
const issues = await transactionService.getTransactionsByAction('ISSUE');

// Get transactions by date range
const result = await transactionService.getTransactionsByDateRange(
  '2026-04-01T00:00:00',
  '2026-04-30T23:59:59'
);

// Create transactions
const addStockTxn = await transactionService.addStockTransaction(
  'SERIAL-001',
  userId,
  { condition: 'Good Condition', quantity: 1, notes: 'New shipment' }
);

const issueTxn = await transactionService.issueTransaction(
  'SERIAL-001',
  userId,
  {
    customer_name: 'John Doe',
    issued_to: 'Fred-uuid',
    authorized_by: 'Isaac-uuid',
    category: 'Installation'
  }
);

const returnTxn = await transactionService.returnTransaction(
  'SERIAL-001',
  userId,
  {
    returned_by: 'Fred-uuid',
    received_by: 'Susan-uuid',
    condition: 'Good Condition'
  }
);

const faultyTxn = await transactionService.markFaultyTransaction(
  'SERIAL-001',
  userId,
  { notes: 'Screen broken' }
);

// Get pending approvals
const pending = await transactionService.getPendingApprovals();

// Update approval status
await transactionService.updateApprovalStatus(txnId, 'APPROVED');
await transactionService.updateApprovalStatus(txnId, 'REJECTED', 'Insufficient authorization');

// Get stats
const stats = await transactionService.getTransactionStats();
// Returns: { today: { issues, returns, added, marked_faulty } }
```

#### 4. qrService.js
QR code generation and management.

```javascript
import qrService from './utils/qrService';

// Generate single QR code
const qr = await qrService.generateQRCode('SERIAL-001', 'Product Name');
// Returns: { dataUrl: 'data:image/png...', value: 'SERIAL-001' }

// Use in image tag
<img src={qr.dataUrl} alt="QR Code" />

// Generate batch for printing
const qrCodes = await qrService.generateBatchQRCodes([
  { serial_number: 'ITEM-001', product_name: 'Router' },
  { serial_number: 'ITEM-002', product_name: 'Router' },
]);

// Generate printable HTML sheet
const html = await qrService.generatePrintSheet(
  items,
  'QR Code Labels - April 2026'
);

// Open in new window for printing
const printWindow = window.open('about:blank');
printWindow.document.write(html);
printWindow.print();

// Decode QR value (usually just the serial)
const serial = qrService.decodeQRCode(qrValue);

// Validate QR format
if (qrService.isValidQRFormat(qrValue)) {
  // Valid serial format
}

// Update item's QR in database
await qrService.updateItemQRCode('SERIAL-001', qrDataUrl);
```

#### 5. staffService.js & auditLogService.js
Staff directory and comprehensive audit logging.

```javascript
import { staffService, auditLogService } from './utils/staffService';

// Get all staff
const staff = await staffService.getAllStaff();

// Get staff by category
const fieldTeam = await staffService.getStaffByCategory('Field Team');

// Get staff names for dropdowns
const names = await staffService.getStaffNames();
// ['Mr Isaac', 'Susan', 'Fred', 'Foday', ...]

// Get for dropdown options
const options = await staffService.getStaffDropdownData();

// Audit logs - get all (admin only)
const logs = await auditLogService.getAllAuditLogs();

// Get audit logs by user
const userLogs = await auditLogService.getAuditLogsByUser(userId);

// Get by action type
const txnActions = await auditLogService.getAuditLogsByAction('TRANSACTION_ISSUE');

// Get by table
const itemLogs = await auditLogService.getAuditLogsByTable('items');

// Get by date range
const monthly = await auditLogService.getAuditLogsByDateRange(
  '2026-04-01',
  '2026-04-30'
);

// Get log detail
const detail = await auditLogService.getAuditLogDetail(logId);

// Get user activity summary
const summary = await auditLogService.getUserActivitySummary(userId, 7);
// Returns: { userId, period, totalActions, actions: {...}, firstAction, lastAction }

// Export audit logs as JSON
const json = await auditLogService.exportAuditLogs({
  userId: optional,
  action: optional,
  table: optional
});
```

---

## Component Integration Examples

### Using AuthContext

```javascript
import { useAuth } from '../utils/AuthContext';

export default function MyComponent() {
  const { user, loading, error, login, logout, isAdmin } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    // Not logged in
    return <LoginForm onSuccess={login} />;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <p>Role: {user.role}</p>
      
      {isAdmin && <AdminPanel />}
      
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Scan and Lookup Item

```javascript
import { itemService } from '../utils/productService';
import { transactionService } from '../utils/transactionService';
import { useAuth } from '../utils/AuthContext';

export default function ItemLookup({ serial }) {
  const { user } = useAuth();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const lookupItem = async () => {
      const foundItem = await itemService.getItemBySerial(serial);
      setItem(foundItem);

      // Log view for audit trail
      await transactionService.viewTransaction(serial, user.id).catch(() => {});
    };

    if (serial) lookupItem();
  }, [serial, user.id]);

  if (!item) return <div>Item not found</div>;

  return (
    <div>
      <h2>{item.product?.name}</h2>
      <p>Serial: {item.serial_number}</p>
      <p>Status: {item.status}</p>
      <p>Condition: {item.condition}</p>
      {item.assigned_to && <p>Assigned to: {item.assigned_to?.name}</p>}
    </div>
  );
}
```

### Issue Item Transaction

```javascript
import { useAuth } from '../utils/AuthContext';
import { transactionService } from '../utils/transactionService';
import { staffService } from '../utils/staffService';

export default function IssueItemForm({ serialNumber }) {
  const { user } = useAuth();
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    customer_name: '',
    issued_to: '',
    authorized_by: '',
    category: '',
  });

  useEffect(() => {
    const loadStaff = async () => {
      const staffList = await staffService.getAllStaff();
      setStaff(staffList);
    };
    loadStaff();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const txn = await transactionService.issueTransaction(
        serialNumber,
        user.id,
        formData
      );

      // Success  - item status automatically updated by trigger
      console.log('Item issued:', txn);
      // Redirect or show success toast
    } catch (error) {
      console.error('Failed to issue item:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Customer Name"
        value={formData.customer_name}
        onChange={(e) =>
          setFormData({ ...formData, customer_name: e.target.value })
        }
        required
      />

      <select
        value={formData.issued_to}
        onChange={(e) =>
          setFormData({ ...formData, issued_to: e.target.value })
        }
        required
      >
        <option value="">Select staff member</option>
        {staff.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        value={formData.authorized_by}
        onChange={(e) =>
          setFormData({ ...formData, authorized_by: e.target.value })
        }
        required
      >
        <option value="">Select approver</option>
        {staff.filter((s) => s.role === 'Admin').map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        value={formData.category}
        onChange={(e) =>
          setFormData({ ...formData, category: e.target.value })
        }
        required
      >
        <option value="">Select category</option>
        <option value="Installation">Installation</option>
        <option value="Replacement">Replacement</option>
        <option value="Connectors">Connectors</option>
      </select>

      <button type="submit">Issue Item</button>
    </form>
  );
}
```

---

## Database Triggers & Functions

### Auto-update Item Status
When a transaction is inserted, this trigger automatically updates the item's status:

```sql
-- Trigger: trigger_update_item_status
-- Call: update_item_status_on_transaction()
-- When: AFTER INSERT on transactions

-- Updates item.status based on transaction.action:
-- ADD_STOCK → IN_STORE
-- ISSUE → IN_FIELD
-- RETURN → RETURNED
-- MARK_FAULTY → FAULTY

-- Also updates item.assigned_to if ISSUE/RETURN
-- Updates item.condition if provided in transaction
```

### Auto Log Transactions
When a transaction is inserted, automatically log to audit_logs:

```sql
-- Trigger: trigger_audit_transaction
-- Call: log_transaction_audit()
-- When: AFTER INSERT on transactions

-- Creates entry in audit_logs with:
-- user_id, action = 'TRANSACTION_' + action
-- description = User X performed ACTION on serial Y
-- affected_table = 'transactions'
-- new_values = full row as JSON
```

### Auto Update Timestamps
All tables automatically update `updated_at`:

```sql
-- Trigger: trigger_update_*_timestamp
-- Call: update_updated_at()
-- When: BEFORE UPDATE on any table

-- Sets updated_at = CURRENT_TIMESTAMP
```

---

## Query Performance Tips

### Indexes
```sql
-- All serial numbers should be indexed (they're unique)
SELECT * FROM items WHERE serial_number = '...';  -- FAST

-- Status queries are indexed
SELECT * FROM items WHERE status = 'IN_FIELD';  -- FAST

-- Joins through foreign keys are efficient
SELECT * FROM items WITH (product, assigned_to);  -- FAST

-- Transaction searches
SELECT * FROM transactions WHERE user_id = '...' AND created_at > NOW() - INTERVAL '7 days';
```

### Avoid (Slow)
```sql
-- No index on condition
SELECT * FROM items WHERE condition = 'Faulty';  -- SLOW

-- No index on JSON fields
SELECT * FROM audit_logs WHERE new_values::text CONTAINS '...';  -- SLOW

-- Multiple OR conditions
SELECT * FROM items WHERE serial = '...' OR qr_code_data = '...';  -- SLOW
```

---

## Error Handling Patterns

```javascript
try {
  const item = await itemService.getItemBySerial(serial);
  if (!item) {
    toast.error('Item not found');
    return;
  }
  // Use item
} catch (error) {
  console.error('Database error:', error);
  toast.error('Failed to load item');
}
```

---

## Testing Checklist

**Unit Tests:**
- [ ] authService.login() with valid/invalid credentials
- [ ] itemService.getItemBySerial() with existing/missing serial
- [ ] transactionService creates correct transaction types
- [ ] qrService generates valid QR codes

**Integration Tests:**
- [ ] Full login → scan → issue workflow
- [ ] Item status updates after transaction
- [ ] Audit log entries created for all actions
- [ ] Permission checks (staff can't access admin data)

**End-to-End Tests:**
- [ ] New user adds stock → prints QR → scans → issues → returns
- [ ] Verify complete transaction history
- [ ] Admin can view all audit logs
- [ ] Offline → online sync (Phase 2)

---

*Last updated: April 14, 2026*
