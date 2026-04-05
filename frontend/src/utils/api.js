import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (username, password, role) =>
    API.post('/api/auth/login', { username, password, role }),
};

export const sheetsAPI = {
  getProducts: () => API.get('/api/sheets/products'),
  issueItem: (data) => API.post('/api/sheets/issue', data),
  returnItem: (data) => API.post('/api/sheets/return', data),
  addStock: (data) => API.post('/api/sheets/stock', data),
  getTransactions: () => API.get('/api/sheets/transactions'),
};

export const qrAPI = {
  generateQR: (serial) => API.post('/api/qr/generate', { serial }),
  generateBatch: (serials) => API.post('/api/qr/batch', { serials }),
};

export default API;
