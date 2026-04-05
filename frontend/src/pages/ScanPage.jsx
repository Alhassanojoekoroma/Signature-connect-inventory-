import React, { useState } from 'react';
import { Colors } from '../utils/constants';

export default function ScanPage({ onNavigate, onToast }) {
  const [serial, setSerial] = useState('');
  const [action, setAction] = useState('');

  const handleScan = () => {
    if (!serial) {
      onToast('❌ Please enter or scan a serial number');
      return;
    }
    if (!action) {
      onToast('❌ Please select an action');
      return;
    }
    
    // Navigate to the appropriate page based on action
    onToast(`✅ Scanned: ${serial}`);
    setTimeout(() => {
      if (action === 'issue') {
        onNavigate('issue');
      } else if (action === 'return') {
        onNavigate('return');
      }
    }, 1000);
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: Colors.DB, display: 'flex', flexDirection: 'column', padding: '16px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24, flexShrink: 0 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Scan QR Code</div>
        <div style={{ fontSize: 12, color: Colors.MU }}>Point camera at QR code on item label</div>
      </div>

      {/* Scan Area Placeholder */}
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          background: Colors.DC,
          borderRadius: 16,
          border: `2px dashed ${Colors.BR}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
          flexShrink: 0,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📷</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Camera View</div>
          <div style={{ fontSize: 11, color: Colors.MU }}>QR codes will appear here</div>
        </div>
      </div>

      {/* Manual Entry */}
      <label style={{ fontSize: 12, color: Colors.MU, display: 'block', marginBottom: 6 }}>
        Or Enter Serial Number
      </label>
      <input
        type="text"
        value={serial}
        onChange={(e) => setSerial(e.target.value)}
        placeholder="e.g., XPONDD87A2D2"
        style={{
          width: '100%',
          padding: '12px 14px',
          borderRadius: 12,
          border: `1.5px solid ${Colors.BR}`,
          background: Colors.DC,
          color: '#fff',
          fontSize: 14,
          marginBottom: 20,
          boxSizing: 'border-box',
        }}
      />

      {/* Action Selection */}
      <label style={{ fontSize: 12, color: Colors.MU, display: 'block', marginBottom: 6 }}>
        Action
      </label>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button
          onClick={() => setAction('issue')}
          style={{
            flex: 1,
            padding: '12px 14px',
            borderRadius: 12,
            border: `1.5px solid ${action === 'issue' ? Colors.A : Colors.BR}`,
            background: action === 'issue' ? Colors.A : Colors.DC,
            color: action === 'issue' ? '#000' : '#fff',
            fontSize: 14,
            fontWeight: action === 'issue' ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          📤 Issue
        </button>
        <button
          onClick={() => setAction('return')}
          style={{
            flex: 1,
            padding: '12px 14px',
            borderRadius: 12,
            border: `1.5px solid ${action === 'return' ? Colors.A : Colors.BR}`,
            background: action === 'return' ? Colors.A : Colors.DC,
            color: action === 'return' ? '#000' : '#fff',
            fontSize: 14,
            fontWeight: action === 'return' ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          📥 Return
        </button>
      </div>

      {/* Scan Button */}
      <button
        onClick={handleScan}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: 12,
          border: 'none',
          background: Colors.A,
          color: '#000',
          fontWeight: 800,
          fontSize: 16,
          cursor: 'pointer',
          marginBottom: 16,
          flexShrink: 0,
        }}
      >
        ✓ Proceed
      </button>

      {/* Back Button */}
      <button
        onClick={() => onNavigate('dashboard')}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: 12,
          border: `1.5px solid ${Colors.BR}`,
          background: 'transparent',
          color: '#fff',
          fontWeight: 600,
          fontSize: 14,
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        ← Back
      </button>
    </div>
  );
}
