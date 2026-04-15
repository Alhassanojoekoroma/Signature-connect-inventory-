# Product Activity Feed System - Implementation Guide

## Overview

The Activity Feed System automatically records and displays user actions within the Signature Connect Inventory application. Every action is captured in real-time and presented as human-readable messages in a timeline format.

**Version:** 1.0.0  
**Date:** April 15, 2026  
**Status:** Production Ready

---

## Features

✅ **Automatic Activity Logging** - Every user action creates an entry
✅ **Human-Readable Messages** - System generates natural language descriptions
✅ **Real-Time Display** - Activities appear immediately after occurring
✅ **Product Timeline** - View all activities related to a product
✅ **Item History** - Complete lifecycle history for each device serial number
✅ **User Activity Tracking** - See what each user did
✅ **Activity Filtering** - Filter by action type or date range
✅ **Export Capability** - Export activity logs as JSON

---

## Database Schema

### activity_logs Table

```sql
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name TEXT NOT NULL,
    user_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    product_id UUID REFERENCES products(id),
    product_name TEXT,
    serial_number TEXT REFERENCES items(serial_number),
    message TEXT NOT NULL,
    additional_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Unique activity log identifier
- `user_name` - Name of the user who performed the action
- `user_id` - UUID of the user
- `action` - Type of action (LOGIN, VIEW_PRODUCT, ISSUE, RETURN, etc.)
- `product_id` - Associated product ID (if applicable)
- `product_name` - Associated product name (for quick display)
- `serial_number` - Associated item serial number (if applicable)
- `message` - Human-readable activity message
- `additional_data` - JSON object with extra context (customer name, condition, quantity)
- `created_at` - Timestamp when activity was recorded

---

## Tracked Actions

### 1. User Login
```
Action: LOGIN
Message: "OJOE logged into the system"
Logged in: AuthContext when user successfully authenticates
```

### 2. Product View
```
Action: VIEW_PRODUCT
Message: "OJOE viewed XPON Router"
Logged in: ProductsPage or ProductDetail when user navigates to product
```

### 3. Item View
```
Action: VIEW_ITEM
Message: "OJOE viewed item XPON001"
Logged in: ScanPage or ItemDetail when user looks at item details
```

### 4. QR Scan
```
Action: VIEW
Message: "OJOE scanned item XPON001"
Logged in: ScanPage via transactionService.viewTransaction()
```

### 5. Add Stock
```
Action: ADD_STOCK
Message: "OJOE added 10 XPON Routers to stock"
Logged in: Database trigger on transactions INSERT
Additional Data: { quantity: 10 }
```

### 6. Issue Item
```
Action: ISSUE
Message: "OJOE issued XPON001 to Fred"
Logged in: Database trigger on transactions INSERT
Additional Data: { customer_name: "Fred" }
```

### 7. Return Item
```
Action: RETURN
Message: "OJOE returned XPON001 (Good Condition)"
Logged in: Database trigger on transactions INSERT
Additional Data: { condition: "Good Condition" }
```

### 8. Mark Faulty
```
Action: MARK_FAULTY
Message: "OJOE marked XPON001 as faulty"
Logged in: Database trigger on transactions INSERT
```

---

## Service Functions

### Activity Log Service (`activityLogService.js`)

#### Login Activity
```javascript
import { logLoginActivity } from '@/services/activityLogService';

// Called automatically in AuthContext after successful login
await logLoginActivity(userId, userName);
```

#### Product View Activity
```javascript
import { logProductViewActivity } from '@/services/activityLogService';

await logProductViewActivity(userId, userName, productId, productName);
```

#### Item View Activity
```javascript
import { logItemViewActivity } from '@/services/activityLogService';

await logItemViewActivity(userId, userName, serialNumber);
```

#### Get Product Activities
```javascript
import { getProductActivityLogs } from '@/services/activityLogService';

const logs = await getProductActivityLogs(productId, limit = 20);
// Returns: Array of activity logs for product
```

#### Get Item Activities
```javascript
import { getItemActivityLogs } from '@/services/activityLogService';

const logs = await getItemActivityLogs(serialNumber, limit = 50);
// Returns: Array of activity logs for item serial
```

#### Get User Activities
```javascript
import { getUserActivityLogs } from '@/services/activityLogService';

const logs = await getUserActivityLogs(userId, limit = 20);
// Returns: Array of activities by specific user
```

#### Get Activity Statistics
```javascript
import { getActivityStats } from '@/services/activityLogService';

const stats = await getActivityStats();
// Returns: {
//   todayActivities: 42,
//   actionCounts: { LOGIN: 5, ISSUE: 12, RETURN: 8, ... }
// }
```

---

## UI Components

### ActivityFeed Component

Display activity timeline for products or items.

**Location:** `frontend/src/components/ActivityFeed.jsx`

#### Props

| Prop | Type | Description | Required |
|------|------|-------------|----------|
| `productId` | UUID | Product to fetch activities for | No* |
| `serialNumber` | String | Item serial to fetch activities for | No* |
| `limit` | Number | Max activities to display (default: 10) | No |

*Either `productId` OR `serialNumber` must be provided

#### Usage

```jsx
import ActivityFeed from '@/components/ActivityFeed';

// Display product activities
<ActivityFeed productId={productId} limit={20} />

// Display item activities  
<ActivityFeed serialNumber="XPON001" limit={50} />
```

#### Display Format

```
• OJOE issued XPON001 (2 mins ago)
• Susan viewed XPON Router (15 mins ago)
• OJOE returned XPON002 (Good Condition) (1 hour ago)
• Isaac added 5 XPON Routers to stock (3 hours ago)
```

---

## Integration Examples

### In Product Detail Page

```jsx
import { useParams } from 'react-router-dom';
import ActivityFeed from '@/components/ActivityFeed';
import { productService } from '@/utils/api';
import { logProductViewActivity } from '@/services/activityLogService';
import { useAuth } from '@/utils/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const p = await productService.getProductById(id);
      setProduct(p);
      
      // Log view activity
      if (user?.id && user?.name) {
        await logProductViewActivity(user.id, user.name, id, p.name);
      }
    };
    
    fetchProduct();
  }, [id]);

  return (
    <div className="product-detail">
      <h1>{product?.name}</h1>
      {/* Product details */}
      
      {/* Activity Feed Section */}
      <div className="activity-section">
        <h2>Activity</h2>
        <ActivityFeed productId={id} limit={20} />
      </div>
    </div>
  );
};
```

### In Item Detail Page

```jsx
import ActivityFeed from '@/components/ActivityFeed';
import { useParams } from 'react-router-dom';

const ItemDetailPage = () => {
  const { serialNumber } = useParams();

  return (
    <div className="item-detail">
      <h1>Item {serialNumber}</h1>
      {/* Item details */}
      
      {/* Item History Section */}
      <div className="history-section">
        <h2>Item History</h2>
        <ActivityFeed serialNumber={serialNumber} limit={50} />
      </div>
    </div>
  );
};
```

### In Dashboard

```jsx
import { getActivityStats } from '@/services/activityLogService';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const activityStats = await getActivityStats();
      setStats(activityStats);
    };
    
    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <div className="stats-card">
        <h3>Today's Activities</h3>
        <p className="big-number">{stats?.todayActivities}</p>
      </div>
      
      <div className="action-breakdown">
        {Object.entries(stats?.actionCounts || {}).map(([action, count]) => (
          <div key={action}>
            <span>{action}</span>
            <span>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## How It Works

### Activity Creation Flow

```
User Action
    ↓
Component Handler
    ↓
Service Function Call
    ↓
Database Operation (INSERT into transactions)
    ↓
Database Trigger (trigger_log_activity_on_transaction)
    ↓
Activity Log Created in activity_logs table
    ↓
Automatic Message Generated
    ↓
UI Fetches and Displays
```

### Example: Issue Item Flow

```
1. User clicks "Issue" on ScanPage
2. ScanPage calls: transactionService.issueTransaction(serialNumber, userId, data)
3. Service inserts record into transactions table
4. Database trigger fires: trigger_log_activity_on_transaction()
5. Trigger generates message: "OJOE issued XPON001 to Fred"
6. Trigger inserts into activity_logs table
7. ActivityFeed component fetches logs for XPON001
8. Timeline displays: "• OJOE issued XPON001 to Fred (just now)"
```

---

## Styling

### ActivityFeed CSS Classes

```css
.activity-feed              /* Main container */
.activity-timeline          /* Timeline wrapper */
.activity-item              /* Individual activity line */
.activity-icon              /* Activity emoji icon */
.activity-content           /* Message and time container */
.activity-message           /* Activity message text */
.activity-time              /* "time ago" text */
```

### Default Icons

| Action | Icon |
|--------|------|
| LOGIN | 🔓 |
| VIEW_PRODUCT | 👁️ |
| VIEW_ITEM | 👁️ |
| ADD_STOCK | 📦 |
| ISSUE | 📤 |
| RETURN | 📥 |
| MARK_FAULTY | ⚠️ |
| VIEW | 👁️ |

---

## Database Query Examples

### Get all activities for today

```sql
SELECT * FROM activity_logs
WHERE created_at >= CURRENT_DATE
ORDER BY created_at DESC;
```

### Get activities by user

```sql
SELECT * FROM activity_logs
WHERE user_id = 'user-uuid-here'
ORDER BY created_at DESC
LIMIT 20;
```

### Get activities by product

```sql
SELECT * FROM activity_logs
WHERE product_id = 'product-uuid-here'
ORDER BY created_at DESC
LIMIT 20;
```

### Get activities by item serial

```sql
SELECT * FROM activity_logs
WHERE serial_number = 'XPON001'
ORDER BY created_at DESC
LIMIT 50;
```

### Get activity statistics

```sql
SELECT action, COUNT(*) as count
FROM activity_logs
WHERE created_at >= CURRENT_DATE
GROUP BY action
ORDER BY count DESC;
```

---

## Manual Activity Logging

For custom actions not automatically tracked, use:

```javascript
import { supabase } from '@/utils/supabaseClient';

const manualLog = await supabase
  .from('activity_logs')
  .insert([{
    user_name: 'OJOE',
    user_id: userId,
    action: 'CUSTOM_ACTION',
    message: 'Custom message here',
    additional_data: { customField: 'value' }
  }])
  .select();
```

---

## Performance Optimization

### Indexes Created

```sql
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_product_id ON activity_logs(product_id);
CREATE INDEX idx_activity_logs_serial_number ON activity_logs(serial_number);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
```

These indexes ensure fast queries for common activity filtering scenarios.

### Query Optimization Tips

1. **Always use LIMIT** when fetching activities: `limit(50)`
2. **Order by created_at DESC** for latest-first display
3. **Filter by specific field** (product_id or serial_number) rather than scanning all logs
4. **Archive old logs** after 90 days if storage becomes an issue

---

## Troubleshooting

### Activities Not Appearing

**Issue:** Activities not showing after user actions

**Solutions:**
1. Check that activityLogService is imported correctly in AuthContext
2. Verify database triggers are created: `SELECT * FROM pg_trigger`
3. Check browser console for fetch errors
4. Verify RLS policy allows authenticated read access to activity_logs

```sql
-- Check if policy exists
SELECT * FROM pg_policies 
WHERE tablename = 'activity_logs';
```

### Login Activity Not Logging

**Issue:** "USER logged in" message not appearing

**Solution:** Verify `logLoginActivity()` is called in `AuthContext.login()`:

```javascript
// In AuthContext.js, login function should include:
if (result.user?.id && result.user?.name) {
  await logLoginActivity(result.user.id, result.user.name);
}
```

### Transaction Activities Missing

**Issue:** Issue/Return/Stock transactions not generating logs

**Solution:** Verify database trigger exists:

```sql
SELECT * FROM pg_proc 
WHERE proname = 'log_activity_on_transaction';

SELECT * FROM pg_trigger 
WHERE tgname = 'trigger_log_activity_on_transaction';
```

---

## Future Enhancements

- [ ] Real-time updates using Supabase Realtime subscriptions
- [ ] Activity notifications (email/SMS when item status changes)
- [ ] Advanced filtering UI (date picker, user selector, action type)
- [ ] Export to CSV/PDF
- [ ] Activity feed search
- [ ] Custom activity alert rules (e.g., "notify when Faulty marked")
- [ ] Geolocation tagging (if mobile app includes location)
- [ ] Activity analytics dashboard
- [ ] Privacy controls (user can delete own activities)

---

## Migration Notes

If upgrading from previous version:

1. **Run SUPABASE_SCHEMA.sql** to create `activity_logs` table
2. **Deploy updated AuthContext** with `logLoginActivity()` call
3. **Update api.js** to export `activityLogService`
4. **Deploy ActivityFeed component** to display logs
5. **Test:** Check that new activities appear after user actions

---

## Support

For questions or issues, refer to:
- [TECHNICAL_REFERENCE.md](../TECHNICAL_REFERENCE.md) - API reference
- [IMPLEMENTATION_GUIDE.md](../IMPLEMENTATION_GUIDE.md) - General implementation
- Database logs: `SELECT * FROM activity_logs LIMIT 10`

---

**Last Updated:** April 15, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
