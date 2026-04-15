import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useAuth } from '../utils/AuthContext';
import { itemService } from '../utils/productService';
import { transactionService } from '../utils/transactionService';
import { Colors } from '../utils/constants';

export default function ScanPage({ onNavigate, onToast }) {
  const { user } = useAuth();
  const [scannedSerial, setScannedSerial] = useState('');
  const [scannedItem, setScannedItem] = useState(null);
  const [manualSerial, setManualSerial] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [loading, setLoading] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const scannerRef = useRef(null);
  const scannerInstanceRef = useRef(null);

  // Initialize scanner
  useEffect(() => {
    if (scannerActive && scannerRef.current && !scannerInstanceRef.current) {
      try {
        scannerInstanceRef.current = new Html5QrcodeScanner('qr-reader', {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        });

        scannerInstanceRef.current.render(
          (decodedText) => handleQRScan(decodedText),
          (error) => {
            // Log errors silently (too many error messages)
          }
        );
      } catch (err) {
        console.error('Error initializing scanner:', err);
        onToast('❌ Camera access denied or unavailable');
        setScannerActive(false);
      }
    }

    return () => {
      if (scannerInstanceRef.current) {
        try {
          scannerInstanceRef.current.clear();
          scannerInstanceRef.current = null;
        } catch (err) {
          console.warn('Error clearing scanner:', err);
        }
      }
    };
  }, [scannerActive, onToast]);

  // Handle QR code scan
  const handleQRScan = async (decodedText) => {
    const serial = decodedText.trim();
    setScannedSerial(serial);
    setManualSerial(serial);

    // Stop scanner to prevent multiple rapid scans
    if (scannerInstanceRef.current) {
      try {
        await scannerInstanceRef.current.pause();
      } catch (err) {
        console.warn('Error pausing scanner:', err);
      }
    }

    // Fetch item details
    await fetchItemDetails(serial);
  };

  // Fetch item details from database
  const fetchItemDetails = async (serial) => {
    setLoading(true);
    try {
      const item = await itemService.getItemBySerial(serial);

      if (!item) {
        onToast(`❌ Item not found: ${serial}`);
        setScannedItem(null);
        setSelectedAction('');

        // Resume scanner
        if (scannerInstanceRef.current) {
          try {
            await scannerInstanceRef.current.resume();
          } catch (err) {
            console.warn('Error resuming scanner:', err);
          }
        }
        return;
      }

      setScannedItem(item);
      onToast(`✅ Scanned: ${item.product?.name || 'Item'}`);

      // Log view action for audit trail
      await transactionService.viewTransaction(serial, user.id).catch(() => {
        // Silently fail for view transactions
      });
    } catch (error) {
      console.error('Error fetching item:', error);
      onToast('❌ Error scanning item');
      setScannedItem(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle manual serial entry
  const handleManualScan = async () => {
    if (!manualSerial.trim()) {
      onToast('❌ Please enter a serial number');
      return;
    }

    setScannedSerial(manualSerial.trim());
    await fetchItemDetails(manualSerial.trim());
  };

  // Handle action selection
  const handleActionSelect = (action) => {
    if (!scannedItem) {
      onToast('❌ Please scan an item first');
      return;
    }

    setSelectedAction(action);

    // Navigate to appropriate form
    switch (action) {
      case 'issue':
        onNavigate('issue');
        break;
      case 'return':
        onNavigate('return');
        break;
      case 'faulty':
        onNavigate('faulty');
        break;
      case 'view':
        onNavigate('detail');
        break;
      default:
        break;
    }
  };

  // Clear current scan
  const handleClearScan = async () => {
    setScannedSerial('');
    setManualSerial('');
    setScannedItem(null);
    setSelectedAction('');

    // Resume scanner if it was active
    if (scannerInstanceRef.current && scannerActive) {
      try {
        await scannerInstanceRef.current.resume();
      } catch (err) {
        console.warn('Error resuming scanner:', err);
      }
    }
  };

  const ActionButton = ({ label, icon, onClick, disabled = false, color = Colors.A }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1,
        padding: '12px 14px',
        borderRadius: 12,
        border: `2px solid ${disabled ? Colors.BR : color}`,
        background: disabled ? Colors.DC : color,
        color: disabled ? Colors.MU : '#000',
        fontSize: 13,
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s',
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      {label}
    </button>
  );

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        background: Colors.DB,
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 20px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 20, flexShrink: 0 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
          Scan QR Code
        </div>
        <div style={{ fontSize: 12, color: Colors.MU }}>
          {scannedItem
            ? `${scannedItem.product?.name}`
            : 'Point camera at item label'}
        </div>
      </div>

      {/* Camera / Scanner Area */}
      {!scannedItem ? (
        <div style={{ marginBottom: 16 }}>
          {scannerActive ? (
            <div
              id="qr-reader"
              ref={scannerRef}
              style={{
                width: '100%',
                borderRadius: 12,
                overflow: 'hidden',
                border: `2px solid ${Colors.BR}`,
                marginBottom: 12,
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                aspectRatio: '1/1',
                background: Colors.DC,
                borderRadius: 12,
                border: `2px dashed ${Colors.BR}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 8 }}>📷</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>
                Camera View
              </div>
              <div style={{ fontSize: 11, color: Colors.MU }}>
                Tap "Start Camera" to begin
              </div>
            </div>
          )}

          <button
            onClick={() => setScannerActive(!scannerActive)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 10,
              border: 'none',
              background: scannerActive ? '#FF9F0A' : Colors.A,
              color: '#000',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: 12,
            }}
          >
            {scannerActive ? '⏹ Stop Camera' : '▶ Start Camera'}
          </button>
        </div>
      ) : (
        <div
          style={{
            background: Colors.DC,
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
            border: `2px solid ${Colors.A}`,
          }}
        >
          <div style={{ fontSize: 12, color: Colors.MU, marginBottom: 4 }}>Serial Number</div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#fff',
              marginBottom: 8,
              wordBreak: 'break-all',
            }}
          >
            {scannedItem.serial_number}
          </div>
          <div
            style={{
              fontSize: 11,
              color: Colors.MU,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Status: {scannedItem.status}</span>
            <span style={{ color: Colors.A }}>✓ OK</span>
          </div>
        </div>
      )}

      {/* Manual Entry */}
      {!scannedItem && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: Colors.MU, display: 'block', marginBottom: 6 }}>
            Or Enter Serial Number
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={manualSerial}
              onChange={(e) => setManualSerial(e.target.value)}
              placeholder="e.g., XPONDD87A2D2"
              onKeyPress={(e) => e.key === 'Enter' && handleManualScan()}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: 10,
                border: `1.5px solid ${Colors.BR}`,
                background: Colors.DC,
                color: '#fff',
                fontSize: 13,
              }}
            />
            <button
              onClick={handleManualScan}
              disabled={loading}
              style={{
                padding: '10px 16px',
                borderRadius: 10,
                border: 'none',
                background: Colors.A,
                color: '#000',
                fontSize: 13,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* Item Info & Actions */}
      {scannedItem && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Item Details */}
          <div
            style={{
              background: Colors.DC,
              borderRadius: 12,
              padding: 12,
              fontSize: 12,
              color: Colors.MU,
            }}
          >
            <div style={{ marginBottom: 8 }}>
              <div style={{ color: '#fff', fontWeight: 600, marginBottom: 2 }}>
                {scannedItem.product?.name}
              </div>
              <div>Category: {scannedItem.product?.category}</div>
              <div>Status: {scannedItem.status}</div>
              <div>Condition: {scannedItem.condition}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingBottom: 8 }}>
            <ActionButton
              label="Issue"
              icon="📤"
              onClick={() => handleActionSelect('issue')}
              disabled={loading}
            />
            <ActionButton
              label="Return"
              icon="📥"
              onClick={() => handleActionSelect('return')}
              disabled={loading}
              color="#5AC8FA"
            />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <ActionButton
              label="Faulty"
              icon="⚠️"
              onClick={() => handleActionSelect('faulty')}
              disabled={loading}
              color="#FF3B30"
            />
            <ActionButton
              label="History"
              icon="📋"
              onClick={() => handleActionSelect('view')}
              disabled={loading}
              color="#FF9F0A"
            />
          </div>

          {/* Clear Scan Button */}
          <button
            onClick={handleClearScan}
            style={{
              padding: '10px 12px',
              borderRadius: 10,
              border: `1.5px solid ${Colors.BR}`,
              background: Colors.DC,
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 8,
            }}
          >
            Scan Another Item
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 24,
          }}
        >
          <div style={{ color: '#fff', fontSize: 14 }}>Loading...</div>
        </div>
      )}
    </div>
  );
}

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
