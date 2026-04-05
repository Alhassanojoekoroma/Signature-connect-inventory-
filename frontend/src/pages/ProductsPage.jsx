import React, { useState } from 'react';
import { Colors, PRODUCTS } from '../utils/constants';
import { Avatar, Dot } from '../components/UI';

export default function ProductsPage({ onSelectProduct, onNavigate }) {
  const [search, setSearch] = useState('');

  const filteredProducts = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectProduct = (product) => {
    onSelectProduct(product);
    onNavigate('detail');
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 20px 0', flexShrink: 0 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
          Products
        </div>
        <div
          style={{
            background: Colors.DC,
            borderRadius: 12,
            padding: '0 12px',
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
            border: `1px solid ${Colors.BR}`,
          }}
        >
          <span style={{ color: Colors.MU, fontSize: 16 }}>⌕</span>
          <input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: '#fff',
              padding: '11px 8px',
              flex: 1,
              fontSize: 14,
            }}
          />
        </div>
      </div>
      <div style={{ padding: '0 20px 16px', flex: 1 }}>
        {filteredProducts.map((p, i) => {
          const tc = p.status === 'Out of Stock' ? '#FF3B30' : p.status === 'Low Stock' ? '#FF9F0A' : Colors.A;
          const ab =
            p.status === 'Out of Stock'
              ? '#2A1212'
              : p.status === 'Low Stock'
              ? '#2A2010'
              : Colors.DC2;
          return (
            <div
              key={i}
              onClick={() => handleSelectProduct(p)}
              style={{
                background: Colors.DC,
                borderRadius: 16,
                padding: '12px 14px',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                border: `1px solid ${Colors.BR}`,
              }}
            >
              <Avatar name={p.name} size={44} bg={ab} tc={tc} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {p.name}
                </div>
                <div style={{ fontSize: 11, color: Colors.MU }}>
                  {p.cat} · {p.serials.length || 'No'} serial{p.serials.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>
                  {p.stock}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Dot status={p.status} />
                  <span style={{ fontSize: 10, color: Colors.MU }}>{p.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
