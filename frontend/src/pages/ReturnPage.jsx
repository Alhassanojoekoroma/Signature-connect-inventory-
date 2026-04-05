import React, { useState } from 'react';
import { Colors, STAFF, CONDITIONS } from '../utils/constants';
import { Avatar, Label, SelectField } from '../components/UI';

export default function ReturnPage({ product, onNavigate, onSubmit, onToast }) {
  const [retBy, setRetBy] = useState('Fred');
  const [recBy, setRecBy] = useState('Mr Isaac');
  const [cond, setCond] = useState('Good Condition');
  const isBad = ['Faulty', 'Damaged'].includes(cond);

  const handleSubmit = async () => {
    try {
      await onSubmit('return', {
        product: product?.name,
        serial: product?.serials?.[0],
        returnedBy: retBy,
        receivedBy: recBy,
        condition: cond,
      });
      onToast('✅ Return logged — Sheets updated!');
      setTimeout(() => onNavigate('dashboard'), 1000);
    } catch (err) {
      onToast('❌ Error logging return');
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
          Return Item
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
        <Label text="Returned By *" />
        <SelectField val={retBy} set={setRetBy} opts={STAFF} />

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
        {isBad && (
          <div
            style={{
              background: '#FFF8E1',
              borderRadius: 12,
              padding: '12px 14px',
              marginTop: 12,
              border: '1px solid #FFD54F',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: '#E65100' }}>
              ⚠ Faulty / Damaged
            </div>
            <div style={{ fontSize: 12, color: '#BF360C', marginTop: 3, lineHeight: 1.5 }}>
              Admin will be prompted to update the Faulty Units column in Google Sheets.
            </div>
          </div>
        )}
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
