import React, { useState } from 'react';
import { Colors, PRODUCTS, STAFF, CONDITIONS } from '../utils/constants';
import { Label, SelectField } from '../components/UI';

export default function StockPage({ onNavigate, onSubmit, onToast }) {
  const [prodName, setProdName] = useState(PRODUCTS[0].name);
  const [qty, setQty] = useState(1);
  const [serial, setSerial] = useState('');
  const [recBy, setRecBy] = useState('Mr Isaac');
  const [cond, setCond] = useState('New in Box');

  const productNames = PRODUCTS.map((p) => p.name);

  const handleSubmit = async () => {
    if (!prodName || !qty) {
      onToast('❌ Please fill all required fields');
      return;
    }
    try {
      await onSubmit('stock', {
        product: prodName,
        quantity: qty,
        serial,
        receivedBy: recBy,
        condition: cond,
      });
      onToast('✅ Stock added — QR codes generated!');
      setTimeout(() => onNavigate('dashboard'), 1000);
    } catch (err) {
      onToast('❌ Error adding stock');
    }
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#F4F4F4', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          background: '#F4F4F4',
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => onNavigate('dashboard')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 24,
            color: '#111',
            padding: 4,
            lineHeight: 1,
          }}
        >
          ‹
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 700, color: '#111' }}>
          Add New Stock
        </div>
        <div style={{ width: 28 }} />
      </div>
      <div style={{ padding: '0 20px', flex: 1 }}>
        <Label text="Product Name *" />
        <SelectField val={prodName} set={setProdName} opts={productNames} />

        <Label text="Quantity *" />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 4 }}>
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              border: '1.5px solid #E8E8E8',
              background: '#fff',
              fontSize: 22,
              cursor: 'pointer',
              color: '#111',
              fontWeight: 700,
            }}
          >
            −
          </button>
          <div style={{ flex: 1, textAlign: 'center', fontSize: 26, fontWeight: 800, color: '#111' }}>
            {qty}
          </div>
          <button
            onClick={() => setQty((q) => q + 1)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              border: 'none',
              background: Colors.A,
              fontSize: 22,
              cursor: 'pointer',
              color: '#000',
              fontWeight: 700,
            }}
          >
            +
          </button>
        </div>

        <Label text="Serial Number(s) (optional)" />
        <input
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          placeholder="e.g. SN001 or SN001, SN002, SN003"
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 12,
            border: '1.5px solid #E8E8E8',
            background: '#fff',
            fontSize: 14,
            color: '#111',
            boxSizing: 'border-box',
          }}
        />

        <Label text="Received By *" />
        <SelectField val={recBy} set={setRecBy} opts={STAFF} />

        <Label text="Condition *" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
          {CONDITIONS.map((c) => (
            <button
              key={c}
              onClick={() => setCond(c)}
              style={{
                padding: '8px 14px',
                borderRadius: 999,
                fontSize: 12,
                cursor: 'pointer',
                border: cond === c ? `2px solid ${Colors.A}` : '1.5px solid #E0E0E0',
                background: cond === c ? `${Colors.A}22` : '#fff',
                color: cond === c ? '#1A2C00' : '#555',
                fontWeight: cond === c ? 700 : 400,
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 16,
            border: 'none',
            background: Colors.A,
            color: '#000',
            fontWeight: 800,
            fontSize: 16,
            cursor: 'pointer',
            marginTop: 20,
            marginBottom: 16,
          }}
        >
          Submit → Generate QR Codes
        </button>
      </div>
    </div>
  );
}
