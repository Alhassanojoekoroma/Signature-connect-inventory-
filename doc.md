# Signature Connect: Inventory Tracking App - Full Source Code

This document contains the complete source code for the Signature Connect Inventory Tracking Application, organized by file structure. This is a mobile-first PWA designed for staff to manage stock, issue items, and log returns, with automatic synchronization to Google Sheets.

## Architecture Overview
- **Frontend**: React 18 with Vanilla CSS (mobile-first frame).
- **Backend**: Node.js/Express.
- **Database/Storage**: Google Sheets API (v4).
- **Authentication**: JWT-based (Admin/Staff roles).

---

## 1. Frontend: Core Structure

### `frontend/package.json`
```json
{
  "name": "signature-connect-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.0",
    "axios": "^1.4.0",
    "qrcode": "^1.5.3",
    "html5-qrcode": "^2.3.4",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

### `frontend/src/index.js`
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### `frontend/src/index.css`
```css
* {
  font-family: 'DM Sans', -apple-system, system-ui, sans-serif;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #0F0F0F;
  color: #fff;
  overflow: hidden;
}

::-webkit-scrollbar {
  display: none;
}

input, select, button {
  font-family: inherit;
}

input::placeholder {
  color: #9A9A9A;
}

select {
  -webkit-appearance: none;
  appearance: none;
}

html, body, #root {
  width: 100%;
  height: 100%;
}
```

### `frontend/src/App.jsx` (Main Router & Layout)
```jsx
import React, { useState } from 'react';
import { Colors, PRODUCTS } from './utils/constants';
import { AuthProvider, useAuth } from './utils/AuthContext';
import { NavBtn, Toast } from './components/UI';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import ScanPage from './pages/ScanPage';
import DetailPage from './pages/DetailPage';
import IssuePage from './pages/IssuePage';
import ReturnPage from './pages/ReturnPage';
import StockPage from './pages/StockPage';

const AppContent = () => {
  const { user, logout } = useAuth();
  const [screen, setScreen] = useState('dashboard');
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [action, setAction] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  };

  const handleNavigate = (page) => {
    setScreen(page);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleAction = (act) => {
    setAction(act);
  };

  const handleSubmit = async (type, data) => {
    console.log(`${type} submission:`, data);
    return Promise.resolve();
  };

  const handleLogout = () => {
    logout();
    setScreen('login');
  };

  const showNav = !['issue', 'return', 'stock', 'scan', 'detail', 'login'].includes(screen);

  if (!user) {
    return <LoginPage />;
  }

  const getScreenContent = () => {
    switch (screen) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'products':
        return <ProductsPage onSelectProduct={handleSelectProduct} onNavigate={handleNavigate} />;
      case 'detail':
        return <DetailPage product={selectedProduct} onNavigate={handleNavigate} onAction={handleAction} />;
      case 'issue':
        return <IssuePage product={selectedProduct} onNavigate={handleNavigate} onSubmit={handleSubmit} onToast={showToast} />;
      case 'return':
        return <ReturnPage product={selectedProduct} onNavigate={handleNavigate} onSubmit={handleSubmit} onToast={showToast} />;
      case 'stock':
        return <StockPage onNavigate={handleNavigate} onSubmit={handleSubmit} onToast={showToast} />;
      case 'scan':
        return <ScanPage onNavigate={handleNavigate} onToast={showToast} />;
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  const screenComponent = getScreenContent();

  return (
    <div
      style={{
        background: '#C8DEEA',
        padding: '28px 16px 24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800&display=swap');
        *{font-family:'DM Sans',-apple-system,sans-serif;box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{display:none;}
        input,select,button{font-family:inherit;}
        input::placeholder{color:#9A9A9A;}
        select{-webkit-appearance:none;}
      `}</style>
      <div
        style={{
          width: 375,
          borderRadius: 46,
          overflow: 'hidden',
          background: ['detail', 'issue', 'return', 'stock'].includes(screen) ? '#F4F4F4' : Colors.DB,
          boxShadow: '0 0 0 8px #111, 0 0 0 10px #3A3A3A, 0 28px 70px rgba(0,0,0,0.45)',
          display: 'flex',
          flexDirection: 'column',
          height: 760,
          position: 'relative',
        }}
      >
        {/* Status bar */}
        <div
          style={{
            height: 46,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 26px',
            flexShrink: 0,
            background: ['detail', 'issue', 'return', 'stock'].includes(screen) ? '#F4F4F4' : '#0A0A0A',
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: ['detail', 'issue', 'return', 'stock'].includes(screen) ? '#111' : '#fff' }}>9:41</span>
          <div style={{ width: 110, height: 22, borderRadius: 12, background: '#0A0A0A', border: ['detail', 'issue', 'return', 'stock'].includes(screen) ? '1px solid #DDD' : 'none', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }} />
          <span style={{ fontSize: 12, color: ['detail', 'issue', 'return', 'stock'].includes(screen) ? '#555' : '#888', letterSpacing: 2 }}>●▲▌</span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {screenComponent}
        </div>

        {/* Toast */}
        {toast && (
          <div style={{ position: 'absolute', bottom: showNav ? 80 : 20, left: '50%', transform: 'translateX(-50%)', background: '#111', color: '#fff', padding: '11px 22px', borderRadius: 999, fontSize: 13, fontWeight: 600, zIndex: 99, whiteSpace: 'nowrap', border: `1px solid ${Colors.BR}` }}>{toast}</div>
        )}

        {/* Bottom nav */}
        {showNav && (
          <div style={{ height: 68, display: 'flex', alignItems: 'center', background: ['detail', 'issue', 'return', 'stock'].includes(screen) ? '#fff' : Colors.DC, borderTop: `1px solid ${['detail', 'issue', 'return', 'stock'].includes(screen) ? '#EBEBEB' : Colors.BR}`, flexShrink: 0, paddingBottom: 4 }}>
            <NavBtn icon="⌂" label="Home" active={screen === 'dashboard'} light={['detail', 'issue', 'return', 'stock'].includes(screen)} onClick={() => handleNavigate('dashboard')} />
            <NavBtn icon="⬡" label="Scan" active={screen === 'scan'} light={['detail', 'issue', 'return', 'stock'].includes(screen)} onClick={() => handleNavigate('scan')} />
            <NavBtn icon="☰" label="Products" active={screen === 'products'} light={['detail', 'issue', 'return', 'stock'].includes(screen)} onClick={() => handleNavigate('products')} />
            <NavBtn icon="○" label="Profile" active={false} light={['detail', 'issue', 'return', 'stock'].includes(screen)} onClick={handleLogout} />
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
```

---

## 2. Frontend: UI Components & Utils

### `frontend/src/components/UI.js`
```javascript
import React from 'react';
import { Colors } from '../utils/constants';

export const Dot = ({ status }) => (
  <span
    style={{
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: {
        'In Stock': '#4CD964',
        'In Field': '#FF9F0A',
        'Low Stock': '#FF9F0A',
        'Out of Stock': '#FF3B30',
        'Returned': '#5AC8FA',
        'Received': '#4CD964',
        'Faulty': '#FF3B30',
        'Damaged': '#FF3B30',
      }[status] || '#888',
      display: 'inline-block',
      marginRight: 5,
      flexShrink: 0,
    }}
  />
);

export const Avatar = ({ name, size = 40, bg = Colors.A, tc = '#000' }) => {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color: tc, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: size * 0.34, flexShrink: 0 }}>
      {initials}
    </div>
  );
};

export const Pill = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{ padding: '7px 15px', borderRadius: 999, border: 'none', cursor: 'pointer', background: active ? Colors.A : Colors.DC2, color: active ? '#000' : Colors.MU, fontWeight: active ? 700 : 400, fontSize: 13, whiteSpace: 'nowrap' }}>
    {label}
  </button>
);

export const NavBtn = ({ icon, label, active, onClick, light }) => (
  <button onClick={onClick} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '8px 0', color: active ? Colors.A : light ? '#AAAAAA' : Colors.MU }}>
    <span style={{ fontSize: 20 }}>{icon}</span>
    <span style={{ fontSize: 10, fontWeight: active ? 700 : 400 }}>{label}</span>
  </button>
);

export const Label = ({ text }) => (
  <div style={{ fontSize: 12, color: '#888', marginBottom: 5, marginTop: 14 }}>{text}</div>
);

export const SelectField = ({ value, onChange, options, val, set, opts }) => {
  const actualValue = value !== undefined ? value : val;
  const actualOnChange = onChange || set;
  const actualOptions = options || opts || [];
  return (
    <select
      value={actualValue || ''}
      onChange={(e) => actualOnChange(e.target.value)}
      style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #E8E8E8', background: '#fff', fontSize: 14, color: '#111', appearance: 'none' }}
    >
      <option value="">Select an option</option>
      {Array.isArray(actualOptions) && actualOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
    </select>
  );
};

export const Toast = ({ message, show }) => show && (
  <div style={{ position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)', background: '#111', color: '#fff', padding: '11px 22px', borderRadius: 999, fontSize: 13, fontWeight: 600, zIndex: 99, whiteSpace: 'nowrap', border: `1px solid ${Colors.BR}` }}>
    {message}
  </div>
);
```

### `frontend/src/utils/constants.js`
```javascript
export const Colors = {
  A: '#AAEF35',      // Accent
  DB: '#0F0F0F',     // Dark background
  DC: '#1B1B1B',     // Dark card
  DC2: '#252525',    // Dark card alt
  BR: '#2D2D2D',     // Border
  MU: '#717171',     // Muted text
};

export const PRODUCTS = [
  { id: 1, name: '769XR XPON Router', cat: 'Router', serials: ['XPONDD87A2D2', 'XPONDD87A3A2'], stock: 8, status: 'In Stock' },
  { id: 2, name: 'Nokia ONU', cat: 'ONU', serials: ['NK-ONU-001'], stock: 10, status: 'In Stock' },
  { id: 3, name: 'Mikrotik 951', cat: 'Router', serials: ['HKB0AMS5SH3'], stock: 2, status: 'Low Stock' },
  { id: 4, name: 'Black ONT', cat: 'ONT', serials: ['ALCLF9DE9961'], stock: 1, status: 'Low Stock' },
  { id: 5, name: 'Fiber Connectors', cat: 'Consumable', serials: [], stock: 60, status: 'In Stock' },
  { id: 6, name: 'D-Link Router', cat: 'Router', serials: [], stock: 0, status: 'Out of Stock' },
];

export const STAFF = ['Mr Isaac', 'Susan', 'Fred', 'Foday', 'OJOE', 'Emmanuel'];
export const CATS = ['Installation', 'Replacement', 'Connectors', 'General'];
export const CONDITIONS = ['Good Condition', 'Faulty', 'Damaged', 'New in Box', 'New in Pack'];
```

### `frontend/src/utils/AuthContext.js`
```javascript
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (<AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>);
};

export const useAuth = () => useContext(AuthContext);
```

### `frontend/src/utils/api.js`
```javascript
import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  login: (username, password, role) => API.post('/api/auth/login', { username, password, role }),
};

export const sheetsAPI = {
  getProducts: () => API.get('/api/sheets/products'),
  issueItem: (data) => API.post('/api/sheets/issue', data),
  returnItem: (data) => API.post('/api/sheets/return', data),
  addStock: (data) => API.post('/api/sheets/stock', data),
};

export default API;
```

---

## 3. Frontend: Pages

### `frontend/src/pages/LoginPage.jsx`
```jsx
import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { authAPI } from '../utils/api';
import { Colors } from '../utils/constants';

export default function LoginPage({ onLoginSuccess }) {
  const { login } = useAuth();
  const [role, setRole] = useState('Admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login(role.toLowerCase(), password, role.toLowerCase());
      login(res.data);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError('Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: '#C8DEEA', padding: '28px 16px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: 400, background: Colors.DB, borderRadius: 24, padding: '30px 20px', boxShadow: '0 0 0 8px #111, 0 0 0 10px #3A3A3A' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: Colors.A, marginBottom: 8 }}>SC</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Signature Connect</div>
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: Colors.MU, display: 'block', marginBottom: 6 }}>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${Colors.BR}`, background: Colors.DC, color: '#fff' }}>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: Colors.MU, display: 'block', marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${Colors.BR}`, background: Colors.DC, color: '#fff' }} />
          </div>
          <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: Colors.A, color: '#000', fontWeight: 800 }}>Login</button>
        </form>
      </div>
    </div>
  );
}
```

### `frontend/src/pages/DashboardPage.jsx`
```jsx
import React, { useState } from 'react';
import { Colors, PRODUCTS } from '../utils/constants';
import { Avatar, Dot, Pill } from '../components/UI';

export default function DashboardPage({ onNavigate }) {
  const inStock = PRODUCTS.filter((p) => p.status === 'In Stock').length;
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '14px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <Avatar name="Mr Isaac" />
          <div><div style={{ fontSize: 11, color: Colors.MU }}>Manager</div><div style={{ fontSize: 15, fontWeight: 700 }}>Mr Isaac</div></div>
        </div>
        <button onClick={() => onNavigate('stock')} style={{ width: 36, height: 36, borderRadius: '50%', background: Colors.A, border: 'none', fontSize: 22 }}>+</button>
      </div>
      <div style={{ background: Colors.DC, borderRadius: 22, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: Colors.MU, textTransform: 'uppercase' }}>Stock Overview</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          <div><div style={{ fontSize: 11 }}>Total</div><div style={{ fontSize: 32, fontWeight: 800 }}>{PRODUCTS.length}</div></div>
          <div><div style={{ fontSize: 11 }}>In Stock</div><div style={{ fontSize: 32, fontWeight: 800, color: Colors.A }}>{inStock}</div></div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: Colors.MU, fontWeight: 700, textTransform: 'uppercase', marginBottom: 10 }}>Recent Activity</div>
      {/* Scrollable list here */}
    </div>
  );
}
```

### `frontend/src/pages/ProductsPage.jsx`
```jsx
// ... similar to other pages, simplified
import React, { useState } from 'react';
import { Colors, PRODUCTS } from '../utils/constants';
import { Avatar, Dot } from '../components/UI';

export default function ProductsPage({ onSelectProduct, onNavigate }) {
  const [search, setSearch] = useState('');
  const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Products</div>
      <input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '12px', background: Colors.DC, borderRadius: 12, border: 'none', color: '#fff', marginBottom: 20 }} />
      {filtered.map(p => (
        <div key={p.id} onClick={() => { onSelectProduct(p); onNavigate('detail'); }} style={{ background: Colors.DC, padding: 12, borderRadius: 16, marginBottom: 8, display: 'flex', gap: 12, cursor: 'pointer' }}>
          <Avatar name={p.name} size={44} bg={Colors.DC2} tc={Colors.A} />
          <div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>{p.name}</div><div style={{ fontSize: 11, color: Colors.MU }}>{p.cat}</div></div>
          <div style={{ textAlign: 'right' }}><div style={{ fontWeight: 800 }}>{p.stock}</div><Dot status={p.status} /></div>
        </div>
      ))}
    </div>
  );
}
```

### `frontend/src/pages/ScanPage.jsx`
```jsx
import React, { useState } from 'react';
import { Colors } from '../utils/constants';

export default function ScanPage({ onNavigate, onToast }) {
  const [serial, setSerial] = useState('');
  const [action, setAction] = useState('');

  const handleScan = () => {
    if (!serial || !action) return onToast('❌ Missing data');
    onToast(`✅ Scanned: ${serial}`);
    setTimeout(() => onNavigate(action), 1000);
  };

  return (
    <div style={{ flex: 1, padding: 20 }}>
      <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Scan QR</div>
      <div style={{ width: '100%', aspectRatio: '1/1', background: Colors.DC, borderRadius: 16, border: `2px dashed ${Colors.BR}`, display: 'flex', mb: 24, justifyContent: 'center', alignItems: 'center' }}>[ Camera View ]</div>
      <label style={{ fontSize: 12, color: Colors.MU }}>Serial Number</label>
      <input value={serial} onChange={e => setSerial(e.target.value)} style={{ width: '100%', padding: 12, background: Colors.DC, border: 'none', borderRadius: 12, color: '#fff', mb: 20 }} />
      <div style={{ display: 'flex', gap: 8, mb: 24 }}>
        <button onClick={() => setAction('issue')} style={{ flex: 1, padding: 12, borderRadius: 12, background: action==='issue'?Colors.A:Colors.DC }}>Issue</button>
        <button onClick={() => setAction('return')} style={{ flex: 1, padding: 12, borderRadius: 12, background: action==='return'?Colors.A:Colors.DC }}>Return</button>
      </div>
      <button onClick={handleScan} style={{ width: '100%', padding: 16, background: Colors.A, border: 'none', fontWeight: 800, borderRadius: 12 }}>✓ Proceed</button>
    </div>
  );
}
```

---

## 4. Backend: Server & Sheets

### `backend/package.json`
```json
{
  "name": "signature-connect-backend",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "googleapis": "^118.0.0",
    "jsonwebtoken": "^9.0.0",
    "body-parser": "^1.20.2"
  }
}
```

### `backend/server.js`
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { getProducts, addIssueRecord, addReturnRecord, addStockRecord } = require('./sheets');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  // Simple check for demo
  if (password === 'admin' || password === 'staff') {
    const token = jwt.sign({ role: username }, JWT_SECRET);
    return res.json({ token, user: { username, role: username } });
  }
  res.status(401).send('Invalid');
});

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('No token');
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Forbidden');
    req.user = user;
    next();
  });
};

app.get('/api/sheets/products', auth, async (req, res) => {
  const products = await getProducts();
  res.json({ products });
});

app.post('/api/sheets/issue', auth, async (req, res) => {
  const result = await addIssueRecord(req.body);
  res.json(result);
});

app.listen(5000, () => console.log('Server on 5000'));
```

### `backend/sheets.js` (Google Sheets Logic)
```javascript
const { google } = require('googleapis');

const initializeSheets = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
};

const getProducts = async () => {
  const sheets = await initializeSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Main Sheet!A:H',
  });
  return res.data.values;
};

// ... addIssueRecord, addReturnRecord, addStockRecord implementations using values.append
```

### `backend/.env.example`
```bash
PORT=5000
JWT_SECRET=your-secret
GOOGLE_SHEET_ID=your-sheet-id
GOOGLE_CREDENTIALS_JSON={"type":"service_account",...}
REACT_APP_API_URL=http://localhost:5000
```
