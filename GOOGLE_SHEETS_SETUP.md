# 📊 Google Sheets Integration Setup Guide

This guide walks you through connecting your Signature Connect app to your Google Sheets inventory tracker.

---

## 📝 Prerequisites

- Access to your **Signature Connect Team Inventory** Google Sheet
- A Google account with admin access to that sheet
- Access to Google Cloud Console

---

## Step 1️⃣: Get Your Google Sheet ID

### Where to find it:
1. Open your **Signature Connect Team Inventory** Google Sheet
2. Look at the browser URL bar
3. You'll see: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
4. **Copy the SHEET_ID** — the long alphanumeric string between `/d/` and `/edit`

### Example:
```
URL: https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit#gid=0
SHEET_ID: 1a2b3c4d5e6f7g8h9i0j
```

**Save this ID** — you'll need it in Step 4.

---

## Step 2️⃣: Create Google Cloud Project

### 2.1 Create a New Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. At the top left, click the project dropdown
3. Click **NEW PROJECT**
4. Name: `Signature Connect Inventory`
5. Click **CREATE**
6. Wait for project to be created (this may take a minute)

### 2.2 Enable Google Sheets API

1. In Cloud Console, search for **"Google Sheets API"** (use the search bar at top)
2. Click the Google Sheets API result
3. Click **ENABLE**
4. Wait for it to enable

### 2.3 Enable Google Drive API

1. Search for **"Google Drive API"**
2. Click the result
3. Click **ENABLE**
4. Wait for it to enable

---

## Step 3️⃣: Create Service Account & Get Credentials

A "service account" is a special Google account that your app uses to access Google Sheets.

### 3.1 Create Service Account

1. In Cloud Console, go to **APIs & Services → Credentials** (left sidebar)
2. Click **+ CREATE CREDENTIALS** button
3. Select **Service Account** (not OAuth)
4. Fill in:
   - **Service account name:** `signature-connect-app`
   - Leave other fields as default
5. Click **CREATE AND CONTINUE**
6. On the "Grant this service account access" screen, click **CONTINUE**
7. Click **DONE**

### 3.2 Download Credentials JSON

1. You should now be back at **Credentials** page
2. Under "Service Accounts" section, click the email address you just created (looks like: `signature-connect-app@project-id.iam.gserviceaccount.com`)
3. Go to the **KEYS** tab
4. Click **ADD KEY → Create new key**
5. Choose **JSON** (default)
6. Click **CREATE**
7. A JSON file will download automatically
8. **Save this file securely!** (Don't share it with anyone)

---

## Step 4️⃣: Share Your Google Sheet with Service Account

The service account needs **Editor** access to your Google Sheet.

### 4.1 Get Service Account Email

1. Open the downloaded JSON file with a text editor (Notepad, VS Code, etc.)
2. Find the line that says: `"client_email": "signature-connect-app@project-id.iam.gserviceaccount.com"`
3. **Copy the email address** (without quotes)

### 4.2 Share Sheet

1. Go back to your **Signature Connect Team Inventory** Google Sheet
2. Click **SHARE** button (top right)
3. Paste the service account email into the sharing field
4. Make sure permission is set to **Editor** (not Viewer)
5. Click **Share**
6. You'll get a warning that it's an external account — click **Share** again

---

## Step 5️⃣: Set Up Environment Variables

### 5.1 Create `.env` File

1. Open the `backend` folder in your project
2. Check if `.env` file exists (it might be hidden)
   - If it doesn't exist, create a new file named `.env`
   - If it exists, open it for editing

### 5.2 Add Configuration

Copy the JSON credentials file contents into your `.env`. You have two options:

#### **Option A: Paste JSON Credentials (Recommended for local development)**

1. Open the JSON credentials file in a text editor
2. Copy the **entire contents**
3. In your `backend/.env` file, add:

```bash
GOOGLE_SHEET_ID=paste-your-sheet-id-here
GOOGLE_CREDENTIALS_JSON={entire-JSON-contents-here}
PORT=5000
JWT_SECRET=super-secret-key-for-production
NODE_ENV=development
REACT_APP_API_URL=http://localhost:5000
```

Replace:
- `paste-your-sheet-id-here` with the Sheet ID from Step 1
- `{entire-JSON-contents-here}` with the entire JSON file contents

**Example:**
```bash
GOOGLE_SHEET_ID=1a2b3c4d5e6f7g8h9i0j
GOOGLE_CREDENTIALS_JSON={"type":"service_account","project_id":"signature-connect-xyz","private_key":"-----BEGIN PRIVATE KEY-----\n...","client_email":"signature-connect-app@signature-connect-xyz.iam.gserviceaccount.com",...}
```

#### **Option B: Use Credentials File**

1. Save the JSON file as `backend/credentials.json`
2. In `backend/.env`, add:

```bash
GOOGLE_SHEET_ID=paste-your-sheet-id-here
GOOGLE_CREDENTIALS_PATH=./credentials.json
PORT=5000
JWT_SECRET=super-secret-key-for-production
NODE_ENV=development
REACT_APP_API_URL=http://localhost:5000
```

3. Make sure `credentials.json` is in `.gitignore` (so you don't accidentally commit it)

### 5.3 Important Security Note ⚠️

**Never commit credentials to GitHub!**

- The `.env` file should be in `.gitignore`
- The `credentials.json` file should be in `.gitignore`
- These files contain secrets that authenticate your app

Check your `.gitignore`:
```bash
.env
.env.local
credentials.json
node_modules/
```

---

## Step 6️⃣: Restart Your Backend Server

1. Open a terminal in your `backend` folder
2. Stop the current server (press `Ctrl+C`)
3. Run: `npm start`
4. You should see:
   ```
   ✅ Google Sheets API connected
   Server running on port 5000
   ```

If you see errors about credentials, double-check Step 5.

---

## Step 7️⃣: Test the Connection

1. Go to your app at `http://localhost:3000`
2. Log in with:
   - **Role:** Admin
   - **Password:** admin123
3. Go to **Products** page
4. You should see products loaded from your Google Sheet

If products show up, the connection is working! ✅

---

## Troubleshooting

### Error: "GOOGLE_SHEET_ID not set"
- Check that you added `GOOGLE_SHEET_ID` to your `.env` file
- Restart the server after adding it

### Error: "Invalid credentials"
- Make sure the service account email can access the Google Sheet
- Go back to Step 4 and re-share the sheet

### Error: "Google Sheets API not enabled"
- Go to Cloud Console → APIs & Services
- Search for "Google Sheets API" and "Google Drive API"
- Make sure both are **ENABLED**

### Products won't load from sheet
- Make sure your Google Sheet has a sheet named **"Main Sheet"**
- Make sure products are in the first column starting from row 2 (row 1 is headers)
- Check the browser console for more detailed error messages

---

## Next Steps

Once the connection is working:

1. **Test Issue Form:** Log in and try issuing an item — it should write to **Supplied Field Team** sheet
2. **Test Return Form:** Try returning an item — it should write to **Items Received** sheet
3. **Test Stock Form:** Add new stock — it should write a row to **Items Received** with "New Stock Received" type
4. **Verify in Google Sheets:** Check that your sheet is being updated in real-time

---

## API Endpoints (for reference)

Once integrated, your backend will have these new endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/sheets/products` | GET | Fetch all products from Main Sheet |
| `/api/sheets/issue` | POST | Record item issue to Supplied Field Team |
| `/api/sheets/return` | POST | Record item return to Items Received |
| `/api/sheets/stock` | POST | Record new stock to Items Received |
| `/api/sheets/transactions` | GET | Fetch recent transactions |

All endpoints require JWT authentication token (sent automatically by the frontend).

---

## File Structure After Setup

```
backend/
├── .env                    ← Your secret credentials (in .gitignore)
├── credentials.json        ← OR store credentials here (in .gitignore)
├── server.js               ← Updated to use sheets.js
├── sheets.js               ← NEW: Google Sheets integration
├── package.json
└── package-lock.json
```

---

## Support

If you're still having issues:

1. Check that both Google Sheets API and Google Drive API are **enabled** in Cloud Console
2. Verify the service account has **Editor** access to your Google Sheet
3. Make sure your `.env` file has correct `GOOGLE_SHEET_ID` and credentials
4. Check the terminal output when the server starts — it should say `✅ Google Sheets API connected`

Good luck! 🚀
