# Vercel Deployment Fix Guide

## Problem
❌ **Error:** "The specified Root Directory 'frontend' does not exist. Please update your Project Settings."

## Solution
✅ **Fixed with:** `vercel.json` configuration file

---

## What Was Done

### 1. Created `vercel.json`
This file tells Vercel exactly how to build your React app:
- Build command: `npm run build` in the frontend directory
- Where to find output: `frontend/build`
- Environment variables needed for Supabase

### 2. Created `.vercelignore`
Tells Vercel which files to skip during deployment (saves bandwidth):
- Excludes `/backend/` folder
- Excludes documentation files
- Excludes node_modules

---

## How to Deploy Next Time

### Option A: Automatic (Recommended)

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "fix: Add Vercel configuration files"
   git push origin master
   ```

2. **Vercel will auto-deploy** when you push because of the `vercel.json` config

### Option B: Manual Redeploy in Vercel

1. Go to https://vercel.com/dashboard
2. Click on your "signature-connect-inventory" project
3. Click the **"Redeploy"** button
4. Select the latest commit - should now work! ✅

---

## Vercel Dashboard Settings

### **IMPORTANT: Check These Settings**

If the deployment still fails, log into Vercel and verify:

1. **Go to Project Settings** → **General**
   - Framework Preset: Should be **React** (or Auto-detect)
   - Node.js Version: **18.x** or **20.x** (recommended)

2. **Root Directory** 
   - Should be **empty** or **./folder** (NOT just "frontend")
   - With our `vercel.json`, this is now handled automatically

3. **Build Command**
   - Should show: `cd frontend && npm run build` (if vercel.json is recognized)
   - Or: Auto-detected from vercel.json

4. **Output Directory**
   - Should be: `frontend/build`

5. **Environment Variables** → Add these if not already there:
   ```
   REACT_APP_SUPABASE_URL=https://enixlllzmsvwxtrbibgh.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=sb_publishable_48FXvq6jAU7sEonNIlPvdg_yB0rLGZI
   NEXT_PUBLIC_SUPABASE_URL=https://enixlllzmsvwxtrbibgh.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_48FXvq6jAU7sEonNIlPvdg_yB0rLGZI
   ```

---

## File Structure (What Vercel Sees)

```
signature-connect-inventory/
├── vercel.json                 ← Tells Vercel how to build
├── .vercelignore              ← Files to ignore
├── backend/                   ← (ignored by Vercel)
├── frontend/                  ← Main app folder
│   ├── package.json
│   ├── src/
│   ├── public/
│   └── build/                 ← Created during build
└── ... documentation files    ← (ignored by Vercel)
```

---

## Quick Troubleshooting

### ❌ Still Getting "frontend does not exist"
- **Solution:** Hard refresh Vercel dashboard (Ctrl+Shift+R)
- Wait 60 seconds after pushing code
- Click "Redeploy" button manually in Vercel

### ❌ Build fails with "npm: command not found"
- **Solution:** In Vercel Settings, set Node.js Version to **18.x** or **20.x**
- Redeploy

### ❌ App loads but shows blank page
- **Solution:** Check browser console (F12) for errors
- Ensure environment variables are set in Vercel
- Check that `.env` file is NOT committed to Git (should only be local)

---

## Deployment Flow (Now Fixed)

```
1. You push code to GitHub
        ↓
2. Vercel automatically detects changes
        ↓
3. Vercel reads vercel.json for build instructions
        ↓
4. Runs: cd frontend && npm install
        ↓
5. Runs: cd frontend && npm run build
        ↓
6. Creates optimized production build in frontend/build
        ↓
7. Deploys to: https://signature-connect-inven-git-*.vercel.app
        ↓
8. ✅ Live website!
```

---

## Next Steps

1. **Push the fixes to GitHub:**
   ```bash
   git add vercel.json .vercelignore
   git commit -m "fix: Add Vercel configuration for proper React deployment"
   git push origin master
   ```

2. **Trigger a redeploy in Vercel:**
   - Go to Vercel dashboard
   - Click your project
   - Click "Redeploy" or push new code

3. **Verify deployment** at your Vercel URL (check "Deployments" tab)

---

## Files Added

```
✅ vercel.json                 (Configuration file)
✅ .vercelignore              (Ignore patterns)
```

**Status:** Ready to deploy! 🚀

---

**Last Updated:** April 15, 2026  
**Status:** Deployment Fixed ✅
