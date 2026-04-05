import React from 'react';
import { Colors } from '../utils/constants';
import { Avatar, Dot } from '../components/UI';

export default function DetailPage({ product, onNavigate, onAction }) {
  if (!product) return null;

  const serial = product.serials?.[0] || 'N/A';

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
          onClick={() => onNavigate('products')}
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
          Details
        </div>
        <div style={{ width: 28 }} />
      </div>
      <div style={{ padding: '0 20px 20px', flex: 1 }}>
        <div
          style={{
            background: '#fff',
            borderRadius: 18,
            padding: '16px',
            marginBottom: 12,
            border: '1px solid #EBEBEB',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 12 }}>
            {product.name}
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 4 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>Serial Number</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#111', wordBreak: 'break-all' }}>
                {serial}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>Category</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>{product.cat}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>Status</div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Dot status={product.status} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>
                  {product.status}
                </span>
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 12,
              paddingTop: 12,
              borderTop: '1px solid #F0F0F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 12, color: '#888' }}>Outstanding Balance</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#111' }}>
              {product.stock} pcs
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            onAction('issue');
            onNavigate('issue');
          }}
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
            marginBottom: 10,
          }}
        >
          Issue Item
        </button>

        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <button
            onClick={() => {
              onAction('return');
              onNavigate('return');
            }}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: 16,
              background: 'none',
              border: '1.5px solid #DEDEDE',
              color: '#111',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            ↩ Return
          </button>
          <button
            onClick={() => alert('⚠️ Faulty flag noted — update Sheets')}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: 16,
              background: 'none',
              border: '1.5px solid #DEDEDE',
              color: '#111',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            ⚠ Mark Faulty
          </button>
        </div>

        <div
          style={{
            background: '#fff',
            borderRadius: 18,
            padding: '18px 16px 14px',
            border: '1px solid #EBEBEB',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>↓ Download QR Code</div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #F0F0F0' }}>
              <svg width={147} height={147} style={{ display: 'block' }}>
                <rect width="100%" height="100%" fill="white" />
              </svg>
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#999', fontFamily: 'monospace' }}>
            {serial}
          </div>
        </div>
      </div>
    </div>
  );
}
