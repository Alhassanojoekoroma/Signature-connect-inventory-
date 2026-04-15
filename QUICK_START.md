# Quick Start Checklist - Signature Connect Supabase Integration

## Pre-Launch Checklist

### 1. Supabase Project Setup ✓
- [ ] Create Supabase account at https://supabase.com
- [ ] Create new project named `signature-connect-inventory`
- [ ] Wait for database initialization (2-3 minutes)
- [ ] Go to Settings → API
- [ ] Copy Project URL and Anon Key

### 2. Database Schema Setup ✓
- [ ] Go to Supabase → SQL Editor
- [ ] Create new query
- [ ] Copy entire contents of `SUPABASE_SCHEMA.sql`
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Wait for all tables, functions, and triggers to complete
- [ ] Verify no errors in logs

### 3. Create Auth Users ✓
**Via Supabase UI:**
- [ ] Go to Authentication → Users
- [ ] Click "Invite" for each user

**Admin User:**
- [ ] Email: `admin@signatureconnect.com`
- [ ] Password: [strong password]
- [ ] Copy user ID from Users list

**Staff Users:**
- [ ] Email: `staff@signatureconnect.com`
- [ ] Password: [staff password]
- [ ] Copy user IDs

**Add to users table:**
- [ ] Go to SQL Editor → New Query
- [ ] Run:
```sql
INSERT INTO users (id, name, email, role, is_active) VALUES
  ('PUT_ADMIN_ID_HERE', 'Mr Isaac', 'admin@signatureconnect.com', 'Admin', TRUE),
  ('PUT_STAFF_ID_HERE', 'Staff Member', 'staff@signatureconnect.com', 'Staff', TRUE);
```
- [ ] Replace IDs with actual UUIDs from Auth → Users

### 4. Frontend Configuration ✓
- [ ] Create file: `frontend/.env`
- [ ] Add:
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGci...
REACT_APP_API_URL=http://localhost:3000
```
- [ ] Replace with actual values from Supabase Settings → API

### 5. Install Dependencies ✓
```bash
cd frontend
npm install
```

### 6. Start Development Server ✓
```bash
npm start
```
- [ ] App opens at http://localhost:3000
- [ ] Login page displays
- [ ] Try login with admin credentials

### 7. Test Authentication ✓
- [ ] Email: `admin@signatureconnect.com`
- [ ] Password: [admin password]
- [ ] Should see Dashboard
- [ ] Check user info shows: role = "Admin"

### 8. Test Product Loading ✓
- [ ] Navigate to "Products"
- [ ] Should see 17 pre-loaded products
- [ ] Filter by category works
- [ ] No errors in browser console

### 9. Test QR Generation ✓
- [ ] Go to Admin → Add Stock (if available)
- [ ] Create sample item with serial: `TEST-001`
- [ ] Should generate QR code
- [ ] Should show printable sheet

### 10. Test Scanner ✓
- [ ] Go to Scan page
- [ ] Allow camera permission
- [ ] Manual entry: `TEST-001`
- [ ] Should find item with green checkmark
- [ ] Show all action buttons (Issue, Return, History)

### 11. Verify Audit Trail ✓
- [ ] Go to Admin → Audit Logs (if available)
- [ ] Should see entries for:
  - [ ] Add Stock action
  - [ ] View/Scan action
  - [ ] Any other actions from testing

### 12. Test Basic Transaction ✓
- [ ] Scan or enter item serial: `TEST-001`
- [ ] Click "Issue" button
- [ ] Fill form: Customer, Issued To, Authorized By
- [ ] Submit
- [ ] Should show success toast
- [ ] Verify transaction logged in Supabase

---

## Common Issues & Solutions

### Error: "Cannot find module '@supabase/supabase-js'"
**Solution:**
```bash
cd frontend
npm install @supabase/supabase-js
npm start
```

### Error: "Anon key is undefined"
**Solution:**
- Check `.env` file exists in `frontend/` folder
- Verify variables are set correctly
- Restart dev server after creating `.env`
- Check for typos in variable names

### Error: "Camera not working"
**Solutions:**
1. Allow camera permission in browser
2. Try Firefox or Chrome (better camera support)
3. May require HTTPS on production
4. Use manual entry as fallback

### Error: "Database connection failed"
**Solutions:**
1. Verify Supabase URL in `.env`
2. Test URL is reachable (paste in browser)
3. Check Supabase project is active
4. Verify anon key is correct

### Error: "User not found after login"
**Solutions:**
1. Verify user was created in Auth
2. Verify user was inserted into `users` table
3. Check user role is uppercase: 'Admin' or 'Staff'
4. Run in Supabase SQL:
```sql
SELECT * FROM users WHERE email = 'admin@signatureconnect.com';
```

---

## Initial Data Setup

### Pre-loaded Data (Automatic)
Via `SUPABASE_SCHEMA.sql` seed data:
- ✅ 17 Products (Routers, ONT, Switches, Consumables)
- ✅ 6 Staff Members (Isaac, Susan, Fred, Foday, OJOE, Emmanuel)

### Add Your First Items
1. Go to Admin → Add Stock
2. Select existing product (e.g., "769XR XPON Router")
3. Enter serial numbers (one per item):
   - `ROUTER-001`
   - `ROUTER-002`
   - `ROUTER-003`
4. Click "Generate QR Codes"
5. QR codes appear with product name and serial
6. Print and attach to physical items

---

## Production Deployment Checklist

### Before Going Live
- [ ] Update all test user passwords
- [ ] Remove demo/test data from database
- [ ] Enable email on Supabase Auth (optional)
- [ ] Set proper CORS settings in Supabase
- [ ] Update `.env` for production domain
- [ ] Test on actual mobile devices
- [ ] Train staff on all features
- [ ] Backup Google Sheets (last manual export)
- [ ] Set up monitoring/alerts (optional)

### Deployment Steps
1. Build frontend: `npm run build`
2. Deploy to Vercel, Netlify, or your server
3. Update `.env` production variables
4. Test login with production URL
5. Monitor first day carefully

---

## Weekly Maintenance

- [ ] Check audit logs for anomalies
- [ ] Verify low stock alerts
- [ ] Review transaction volume
- [ ] Check for any errors in console
- [ ] Backup database (Supabase auto-backups included)

---

## Monthly Maintenance

- [ ] Review QR code label stock
- [ ] Archive old transactions (optional)
- [ ] User access review (inactive users)
- [ ] Performance check (slow queries)
- [ ] Security audit (access logs)

---

## Support Resources

### Documentation Files
- `SUPABASE_SETUP.md` - Detailed Supabase setup
- `SUPABASE_SCHEMA.sql` - Database structure
- `IMPLEMENTATION_GUIDE.md` - Complete feature guide
- `PRD.md` - Original requirements

### External Resources
- Supabase Docs: https://supabase.com/docs
- HTML5 QRCode: https://davidshimjs.github.io/qrcodejs/
- React Docs: https://react.dev

### Contact
For technical support or customization requests, refer to the project development team.

---

## Success Metrics

After launch, track these KPIs:

- **System Availability:** 99%+ uptime
- **Scan Speed:** <2 seconds from QR to confirm
- **Transaction Log:** 100% completeness (every action logged)
- **User Adoption:** All staff trained and actively using
- **Data Accuracy:** Zero missing records
- **Query Performance:** All queries <500ms

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | Apr 2026 | Supabase integration, per-item tracking, transaction logging |
| 1.0 | Mar 2026 | Google Sheets only version |

---

*Last updated: April 14, 2026*
*Signature Connect Inventory System v2.0*
