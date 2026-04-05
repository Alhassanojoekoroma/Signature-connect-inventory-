# 🔧 Quick Start: Google Sheets Integration

## ✅ What's Been Done

1. **Fixed the React Router Error** — The app no longer crashes on startup
2. **Created Google Sheets Integration Module** (`backend/sheets.js`) — Ready to connect to your sheet
3. **Updated Backend API** (`backend/server.js`) — Now uses real Google Sheets endpoints
4. **Created Setup Guide** — See `GOOGLE_SHEETS_SETUP.md` for step-by-step instructions

---

## 🚀 What You Need to Do Now

### Step 1: Set Up Google Cloud (15 minutes)
Follow the guide in **`GOOGLE_SHEETS_SETUP.md`** to:
1. Get your Google Sheet ID
2. Create a Google Cloud Project
3. Enable Google Sheets & Drive APIs
4. Create a Service Account
5. Download credentials JSON
6. Share your Google Sheet with the service account

### Step 2: Configure Environment (5 minutes)
1. Create `.env` file in `backend/` folder
2. Add your `GOOGLE_SHEET_ID` and credentials
3. See `.env.example` for reference

### Step 3: Restart Server (1 minute)
```bash
cd backend
npm start
```

### Step 4: Test (2 minutes)
- Login to app at `http://localhost:3000`
- Go to Products page
- Verify products load from your Google Sheet

---

## 📋 Your Google Sheet Structure

The app expects your Google Sheet with these tabs:

| Tab Name | Purpose |
|----------|---------|
| **Main Sheet** | Product master list (read-only) |
| **Items Received** | Stock in/returns log |
| **Supplied Field Team** | Items issued to field log |

**Columns in each sheet must match the PRD exactly** — the app will automatically write to the correct columns.

---

## ⚠️ Important Security Notes

1. **Never commit `.env` to GitHub** — it contains your secret credentials
2. **Never share `credentials.json`** — treat it like a password
3. **Keep `JWT_SECRET` secret** — use a long random string in production
4. **Add to `.gitignore`:**
   ```
   .env
   credentials.json
   node_modules/
   ```

---

## 🧪 Testing Checklist

Once configured:

- [ ] Login works (admin123 / staff123)
- [ ] Products load from Google Sheet
- [ ] Issue form submits and writes to "Supplied Field Team"
- [ ] Return form submits and writes to "Items Received"
- [ ] Stock form submits and writes to "Items Received"
- [ ] Check Google Sheet to confirm rows are being added

---

## 📞 Troubleshooting

**Products don't load?**
- Check that your `.env` file is in the `backend/` folder
- Verify `GOOGLE_SHEET_ID` is correct
- Check that service account has Editor access to the sheet
- Look at browser console for error messages

**Backend won't start?**
- Make sure port 5000 is free
- Check that all npm packages are installed (`npm install` in backend folder)

**Credentials error?**
- Verify the JSON in `.env` is valid (no missing quotes or brackets)
- Make sure service account email is correct

See **`GOOGLE_SHEETS_SETUP.md`** for detailed troubleshooting.

---

## 📈 What Happens After Setup

Once configured:

1. **Dashboard** pulls live stock data from Google Sheet
2. **Issue Form** writes to "Supplied Field Team" in real-time
3. **Return Form** writes to "Items Received" in real-time
4. **Stock Form** adds new inventory to "Items Received"
5. **Google Sheet formulas** automatically calculate totals and balances

Everything is **logged in real-time** — no syncing delays!

---

## 🎯 Next Phase (Phase 2)

After Google Sheets is working:
- QR Code scanning integration
- QR code generation & batch printing
- Low stock notifications
- Activity dashboard with charts
- Offline sync capability

---

**Start with the setup guide and you'll be connected in about 20 minutes!** 🚀

Questions? Check `GOOGLE_SHEETS_SETUP.md` for detailed step-by-step instructions.
