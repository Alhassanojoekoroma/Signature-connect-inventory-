import React, { useState } from 'react';
import { Colors, STAFF, CATS } from '../utils/constants';
import { Avatar, Label, SelectField } from '../components/UI';

export default function IssuePage({ product, onNavigate, onSubmit, onToast }) {
  const [cat, setCat] = useState('Installation');
  const [to, setTo] = useState('Fred');
  const [auth, setAuth] = useState('Mr Isaac');
  const [cust, setCust] = useState('');
  const [qty, setQty] = useState(1);

  const handleSubmit = async () => {
    try {
      await onSubmit('issue', {
        product: product?.name,
        serial: product?.serials?.[0],
        category: cat,
        qty,
        to,
        auth,
        customer: cust,
      });
      onToast('✅ Item issued — Sheets updated!');
      setTimeout(() => onNavigate('dashboard'), 1000);
    } catch (err) {
      onToast('❌ Error issuing item');
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
          onClick={() => onNavigate('detail')}
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
          Issue Item
        </div>
        <div style={{ width: 28 }} />
      </div>
      <div
        style={{
          margin: '0 20px 2px',
          background: '#fff',
          borderRadius: 14,
          padding: '12px 14px',
          border: '1px solid #EBEBEB',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexShrink: 0,
        }}
      >
        <Avatar name={product?.name || '?'} size={40} bg={Colors.A} tc="#000" />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>
            {product?.name}
          </div>
          <div style={{ fontSize: 11, color: '#888' }}>
            {product?.serials?.[0] || 'No serial'}
          </div>
        </div>
      </div>
      <div style={{ padding: '0 20px', flex: 1 }}>
        <Label text="Category *" />
        <SelectField val={cat} set={setCat} opts={CATS} />

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
        <Label text="Issued To *" />
        <SelectField val={to} set={setTo} opts={STAFF} />

        <Label text="Authorized By *" />
        <SelectField val={auth} set={setAuth} opts={STAFF} />

        <Label text="Customer Name (optional)" />
        <input
          value={cust}
          onChange={(e) => setCust(e.target.value)}
          placeholder="e.g. John Doe"
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
          Submit → Log to Sheets
        </button>
      </div>
    </div>
  );
}
