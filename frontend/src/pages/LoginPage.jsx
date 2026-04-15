import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { Colors } from '../utils/constants';

export default function LoginPage() {
  const { login, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email.trim(), password);
      // Navigation handled by AuthContext
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading || authLoading;

  return (
    <div
      style={{
        background: '#C8DEEA',
        padding: '28px 16px 24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: Colors.DB,
          borderRadius: 24,
          padding: '30px 20px',
          boxShadow: '0 0 0 8px #111, 0 0 0 10px #3A3A3A',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: Colors.A,
              marginBottom: 8,
            }}
          >
            SC
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>
            Signature Connect
          </div>
          <div style={{ fontSize: 12, color: Colors.MU, marginTop: 4 }}>
            Inventory Tracking System
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 12,
                color: Colors.MU,
                display: 'block',
                marginBottom: 6,
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., staff@signatureconnect.com"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 12,
                border: `1.5px solid ${error ? '#FF3B30' : Colors.BR}`,
                background: Colors.DC,
                color: '#fff',
                fontSize: 14,
                boxSizing: 'border-box',
                opacity: isLoading ? 0.6 : 1,
              }}
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                fontSize: 12,
                color: Colors.MU,
                display: 'block',
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  paddingRight: 44,
                  borderRadius: 12,
                  border: `1.5px solid ${error ? '#FF3B30' : Colors.BR}`,
                  background: Colors.DC,
                  color: '#fff',
                  fontSize: 14,
                  boxSizing: 'border-box',
                  opacity: isLoading ? 0.6 : 1,
                }}
              />
              {/* Eye Icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: Colors.MU,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: 18,
                  padding: 4,
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                marginBottom: 16,
                padding: '10px 12px',
                borderRadius: 8,
                background: 'rgba(255, 59, 48, 0.1)',
                border: `1px solid #FF3B30`,
                fontSize: 12,
                color: '#FF9F9F',
              }}
            >
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 12,
              border: 'none',
              background: isLoading ? Colors.BR : Colors.A,
              color: '#000',
              fontSize: 14,
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 0.2s',
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Info */}
        <div
          style={{
            marginTop: 20,
            padding: '12px',
            borderRadius: 8,
            background: Colors.DC,
            fontSize: 11,
            color: Colors.MU,
            lineHeight: 1.5,
          }}
        >
          <strong>Demo Credentials:</strong>
          <br />
          Admin: admin@signatureconnect.com
          <br />
          Staff: staff@signatureconnect.com
        </div>
      </div>
    </div>
  );
}

export default function LoginPage({ onLoginSuccess }) {
  const { login } = useAuth();
  const [role, setRole] = useState('Admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter a password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.login(role.toLowerCase(), password, role.toLowerCase());
      login(res.data);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: '#C8DEEA',
        padding: '28px 16px 24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: Colors.DB,
          borderRadius: 24,
          padding: '30px 20px',
          boxShadow: '0 0 0 8px #111, 0 0 0 10px #3A3A3A',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: Colors.A,
              marginBottom: 8,
            }}
          >
            SC
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>
            Signature Connect
          </div>
          <div style={{ fontSize: 12, color: Colors.MU, marginTop: 4 }}>
            Inventory Tracking
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: Colors.MU, display: 'block', marginBottom: 6 }}>
              Role
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 14px',
                  paddingRight: '40px',
                  borderRadius: 12,
                  border: `1.5px solid ${Colors.BR}`,
                  background: Colors.DC,
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                }}
              >
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
              </select>
              {/* Dropdown Icon */}
              <div
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: Colors.MU,
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                ▼
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: Colors.MU, display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 14px',
                  paddingRight: 44,
                  borderRadius: 12,
                  border: `1.5px solid ${Colors.BR}`,
                  background: Colors.DC,
                  color: '#fff',
                  fontSize: 14,
                }}
              />
              {/* Eye Icon for Password Visibility */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: Colors.MU,
                  cursor: 'pointer',
                  fontSize: 18,
                  padding: '4px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(255, 59, 48, 0.1)',
                color: '#FF3B30',
                padding: '10px 12px',
                borderRadius: 8,
                fontSize: 12,
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 12,
              border: 'none',
              background: Colors.A,
              color: '#000',
              fontWeight: 800,
              fontSize: 16,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div
          style={{
            marginTop: 20,
            padding: '12px',
            background: Colors.DC,
            borderRadius: 12,
            fontSize: 11,
            color: Colors.MU,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Demo Credentials:</div>
          <div>Admin: Pass: admin</div>
          <div>Staff: Pass: staff</div>
        </div>
      </div>
    </div>
  );
}
