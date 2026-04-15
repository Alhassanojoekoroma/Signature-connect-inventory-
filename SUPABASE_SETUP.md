# Supabase Setup Guide for Signature Connect

## Prerequisites

- Supabase account (free plan at https://supabase.com)
- Node.js and npm installed

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in details:
   - Project Name: `signature-connect-inventory`
   - Database Password: Create a strong password (save this!)
   - Region: Choose closest to your location
4. Click "Create new project" and wait for setup (2-3 minutes)

## Step 2: Setup Database Schema

1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open file: `SUPABASE_SCHEMA.sql`
4. Copy and paste ALL content into the SQL Editor
5. Click **"Run"** button
6. Wait for execution to complete (should see green checkmarks)

## Step 3: Get Your Supabase Credentials

1. Go to **Settings** (bottom of left sidebar)
2. Click **"API"**
3. Copy these values:
   - **Project URL** - Save this as `REACT_APP_SUPABASE_URL`
   - **anon key** - Save this as `REACT_APP_SUPABASE_ANON_KEY`
   - **service_role key** - Save this for backend (if needed)

Example:
```
REACT_APP_SUPABASE_URL=https://abcdefghijk.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Create Authentication Users

1. In Supabase, go to **Authentication** (left sidebar)
2. Click **"Users"** tab
3. Click **"Invite"** button
4. Create users:

### Admin User
- Email: `admin@signatureconnect.com`
- Password: (choose strong password, share only with admin)
- Role: Will be set in database as "Admin"

### Staff Users (create one or more)
- Email: `staff@signatureconnect.com`
- Password: (shared password is acceptable for v1)
- Role: Will be set in database as "Staff"

After creating users in Auth, you must also add them to the `users` table:

1. Go to **SQL Editor**
2. Run this query (replace emails/UUIDs):

```sql
-- Get the user ID from Auth → Users tab

INSERT INTO users (id, name, email, role, is_active) VALUES
    ('USER_ID_HERE', 'Mr Isaac', 'admin@signatureconnect.com', 'Admin', TRUE),
    ('STAFF_USER_ID_HERE', 'Staff Member', 'staff@signatureconnect.com', 'Staff', TRUE);
```

## Step 5: Update Frontend .env File

Create or update `frontend/.env` file:

```env
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
REACT_APP_API_URL=http://localhost:3000
```

## Step 6: Install Frontend Dependencies

```bash
cd frontend
npm install @supabase/supabase-js
npm start
```

## Step 7: Verify Setup

1. Start the app: `npm start`
2. Try logging in with your admin/staff credentials
3. Navigate to dashboard - should see empty inventory
4. Go to Admin → Add Stock to test the system

## Troubleshooting

### "Invalid login credentials"
- Verify email exists in Supabase Authentication
- Verify the password is correct
- Check `.env` variables are loaded (restart dev server after updating .env)

### "Cannot read properties of undefined"
- Ensure all Supabase credentials are correct in `.env`
- Check that row-level security policies are applied
- Look at browser console for detailed error messages

### Database queries not working
- Go to Supabase → SQL Editor → Run this:
  ```sql
  SELECT * FROM users;
  SELECT * FROM products;
  ```
- If empty, the schema wasn't imported correctly - re-run SUPABASE_SCHEMA.sql

## What's Created

✅ **Users** - Admin-controlled authentication
✅ **Products** - Pre-loaded with 17 products
✅ **Items** - Per-item tracking with unique serial numbers
✅ **Transactions** - Append-only audit trail
✅ **Audit Logs** - Complete action history
✅ **Staff Directory** - Pre-loaded with 6 staff members
✅ **Approvals** - Workflow for issue approval
✅ **Row Level Security** - Data access controls by role

## Next Steps

1. ✅ Supabase is ready
2. → Update React components (already in progress)
3. → Test QR scanning
4. → Test transaction logging
5. → Deploy to production

For questions or issues, refer to SUPABASE_SCHEMA.sql comments or Supabase docs.
