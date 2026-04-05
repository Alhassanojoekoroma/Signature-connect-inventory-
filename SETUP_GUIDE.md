# Signature Connect - Quick Start Guide

## What's Been Built

A complete mobile-first inventory tracking application with:
- **Frontend**: React app with authentication, dashboard, product management, and transaction forms
- **Backend**: Express server with JWT authentication and API endpoints
- **Design System**: Matches the provided mockup with the accent green color (#AAEF35) and dark theme
- **Mobile Responsive**: Fully optimized for all screen sizes

## Quick Start (5 minutes)

### 1. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 2. Install Backend Dependencies
```bash
cd ../backend
npm install
```

### 3. Start Backend Server
From `backend/` directory:
```bash
npm start
```
Server runs on `http://localhost:5000`

### 4. Start Frontend (New Terminal)
From `frontend/` directory:
```bash
npm start
```
App opens at `http://localhost:3000`

### 5. Login
Use demo credentials:
- **Role**: Admin or Staff
- **Password**: admin123 or staff123

## Project Structure Overview

```
Signature connect Website/
├── frontend/                    # React.js application
│   ├── public/
│   │   ├── index.html          # Main HTML file
│   │   └── manifest.json       # PWA configuration
│   ├── src/
│   │   ├── components/
│   │   │   └── UI.js           # Reusable UI components
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx   # Login screen
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── DetailPage.jsx
│   │   │   ├── IssuePage.jsx
│   │   │   ├── ReturnPage.jsx
│   │   │   └── StockPage.jsx
│   │   ├── utils/
│   │   │   ├── constants.js    # Colors, data, staff lists
│   │   │   ├── api.js          # API client setup
│   │   │   └── AuthContext.js  # Authentication state
│   │   ├── App.jsx             # Main app component
│   │   └── index.js            # React entry point
│   ├── package.json
│   └── .env (create from template)
│
├── backend/                     # Node.js/Express server
│   ├── server.js               # Main server file with routes
│   ├── routes/ (ready for expansion)
│   ├── package.json
│   └── .env.example            # Environment template
│
├── README.md                   # Full documentation
├── PRD.md                      # Original requirements
└── .gitignore                  # Git ignore configuration
```

## Key Features Implemented

### ✅ Authentication
- Login page with role selection (Admin/Staff)
- JWT token-based authentication
- Session persistence with localStorage
- Logout functionality

### ✅ Dashboard
- Stock overview with statistics
- Hot status metrics (In Stock, Low Stock, Out of Stock)
- Recent activity feed
- Quick navigation

### ✅ Product Management
- Full product inventory listing
- Search functionality
- Status indicators (color-coded badges)
- Stock quantity display
- Product detail view

### ✅ Transaction Forms
- **Issue Item**: Track items going to field team
  - Category selection
  - Staff assignment
  - Authorization tracking
  - Customer name (optional)

- **Return Item**: Track items coming back
  - Condition selection
  - Faulty/damaged warnings
  - Return and receive person tracking

- **Add Stock**: New inventory arrival
  - Quantity input
  - Serial number tracking
  - Condition classification

### ✅ UI/UX
- Mobile-optimized design (375px frame width)
- Dark theme with accent green colors
- Responsive navigation
- Toast notifications
- Smooth transitions between screens

## Design System Colors

```javascript
- Accent Green: #AAEF35 (buttons, highlights)
- Dark Background: #0F0F0F (main bg)
- Dark Cards: #1B1B1B, #252525 (containers)
- Text Muted: #717171 (secondary text)
- Status Green: #4CD964 (in stock)
- Status Orange: #FF9F0A (in field, low stock)
- Status Red: #FF3B30 (out of stock, faulty)
```

## API Endpoints

All endpoints require authentication (Bearer token in header).

### Auth
```
POST /api/auth/login
Body: { username, password, role }
```

### Sheets (Data Operations)
```
GET /api/sheets/products
POST /api/sheets/issue { product, serial, category, qty, to, auth, customer }
POST /api/sheets/return { product, serial, returnedBy, receivedBy, condition }
POST /api/sheets/stock { product, quantity, serial, receivedBy, condition }
GET /api/sheets/transactions
```

### QR Codes
```
POST /api/qr/generate { serial }
POST /api/qr/batch { serials: [] }
```

## Next Steps

### Immediate (Frontend Ready)
1. ✅ Install dependencies
2. ✅ Run the app
3. ✅ Test all screens with demo login
4. ✅ Verify mobile responsiveness

### Phase 2 - Google Sheets Integration
1. Create Google Cloud project
2. Enable Sheets API
3. Create service account
4. Share your Inventory sheet with service account
5. Add credentials to backend `.env`
6. Uncomment googleapis code in `server.js`
7. Test real data flow

### Phase 3 - QR Code Features
1. Install `html5-qrcode` in frontend
2. Create QR scanner component
3. Connect to existing forms (auto-fill product/serial)
4. Implement QR generation with `qrcode` library
5. Add batch print functionality

### Phase 4 - PWA & Offline
1. Implement service worker
2. Create offline queue for transactions
3. Sync when connection restored
4. Install to home screen support

## Environment Setup

### Create Frontend .env (optional, uses defaults)
```bash
REACT_APP_API_URL=http://localhost:5000
```

### Create Backend .env
```bash
cp backend/.env.example backend/.env
```

Then edit `.env` with your settings (JWT_SECRET, Google credentials, etc.)

## Troubleshooting

### "Cannot GET /"
- Ensure frontend is running on port 3000
- Check that `npm start` completed successfully

### Backend connection error
- Verify backend is running on port 5000
- Check terminal for error messages
- Ensure CORS is enabled in `server.js`

### Page keeps redirecting to login
- Clear browser localStorage
- Check JWT_SECRET matches between sessions
- Look for token expiration issues

### Slow page loads
- Backend starting? Wait ~5 seconds
- Check network tab in DevTools
- Verify no CORS blocking in console

## Mobile Testing

### On Desktop
- Use Chrome DevTools responsive mode (375px)
- Test as device: iPhone 12 or Pixel

### On Mobile Device
1. Find your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac)
2. In mobile browser: `http://YOUR_IP:3000`
3. Test on actual touch device

## Browser DevTools Tips

1. **Elements**: Inspect the responsive frame styling
2. **Console**: Watch for auth errors or API issues
3. **Network**: Monitor API calls to backend
4. **Application**: Check localStorage for token persistence
5. **Mobile View**: Test all responsive breakpoints

## Important Notes

⚠️ **Authentication**: Current implementation uses demo credentials. For production:
- Implement proper OAuth/LDAP integration
- Store hashed passwords (bcrypt)
- Implement password reset flow
- Add 2FA support

⚠️ **Google Sheets**: To enable real data persistence:
- Don't commit `credentials.json` to git
- Use environment variables
- Implement proper error handling
- Add rate limiting (Google Sheets API limits)

⚠️ **Security**: 
- Change JWT_SECRET in production
- Enable HTTPS
- Validate all inputs
- Implement CSRF protection

## Support Resources

- **Frontend**: React documentation - https://react.dev
- **Backend**: Express documentation - https://expressjs.com
- **Google Sheets API**: https://developers.google.com/sheets/api
- **Mobile QR Scanning**: https://github.com/mebjas/html5-qrcode

---

**Status**: ✅ MVP Complete - Ready for Phase 2 Integration
**Last Updated**: April 2026
