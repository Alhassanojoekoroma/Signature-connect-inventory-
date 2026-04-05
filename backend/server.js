require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { getProducts, addIssueRecord, addReturnRecord, addStockRecord, getTransactions } = require('./sheets');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Auth Routes
app.post('/api/auth/login', (req, res) => {
  const { username, password, role } = req.body;

  // Simple auth for demo - replace with real authentication
  const normalizedRole = role.toLowerCase();
  const validCredentials = {
    admin: 'admin',
    staff: 'staff',
  };

  if (validCredentials[normalizedRole] !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ role: normalizedRole, username }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    token,
    user: {
      username,
      role: normalizedRole,
      name: normalizedRole === 'admin' ? 'Mr Isaac' : 'Staff Member',
    },
  });
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Google Sheets API Routes
app.get('/api/sheets/products', authenticateToken, async (req, res) => {
  try {
    const products = await getProducts();
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

app.post('/api/sheets/issue', authenticateToken, async (req, res) => {
  try {
    const { product, serial, category, qty, to, auth, customer } = req.body;
    
    const result = await addIssueRecord({
      product,
      serial,
      category,
      qty,
      issuedTo: to,
      authorizedBy: auth,
      customer,
    });

    res.json({ success: true, message: 'Item issued successfully', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error issuing item', error: error.message });
  }
});

app.post('/api/sheets/return', authenticateToken, async (req, res) => {
  try {
    const { product, serial, returnedBy, receivedBy, condition } = req.body;
    
    const result = await addReturnRecord({
      product,
      serial,
      returnedBy,
      receivedBy,
      condition,
    });

    res.json({ success: true, message: 'Item returned successfully', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error returning item', error: error.message });
  }
});

app.post('/api/sheets/stock', authenticateToken, async (req, res) => {
  try {
    const { product, quantity, serial, receivedBy, condition } = req.body;
    
    const result = await addStockRecord({
      product,
      qty: quantity,
      serial,
      receivedBy,
      condition,
    });

    res.json({ success: true, message: 'Stock added successfully', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding stock', error: error.message });
  }
});

app.get('/api/sheets/transactions', authenticateToken, async (req, res) => {
  try {
    const transactions = await getTransactions(20);
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
});

// QR Routes (Placeholder)
app.post('/api/qr/generate', authenticateToken, (req, res) => {
  const { serial } = req.body;
  res.json({ success: true, message: 'QR code generated', qr: 'data:image/png;base64,...' });
});

app.post('/api/qr/batch', authenticateToken, (req, res) => {
  const { serials } = req.body;
  res.json({ success: true, message: 'Batch QR codes generated', count: serials.length });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
