import React, { useState } from 'react';
import { Colors, PRODUCTS } from '../utils/constants';
import { Avatar, Dot, Pill } from '../components/UI';

export default function DashboardPage({ onNavigate }) {
  const [filter, setFilter] = useState('All');

  const inStock = PRODUCTS.filter((p) => p.status === 'In Stock').length;
  const lowStock = PRODUCTS.filter((p) => p.status === 'Low Stock').length;
  const outStock = PRODUCTS.filter((p) => p.status === 'Out of Stock').length;

  const TX = [
    {
      product: '769XR XPON Router',
      serial: 'XPONDD87A2D2',
      action: 'Issued',
      to: 'Fred',
      date: '12 Mar',
      status: 'In Field',
    },
    {
      product: 'Tender Router',
      serial: '230368950110005593',
      action: 'Returned',
      by: 'Foday',
      date: '13 Mar',
      status: 'Returned',
      cond: 'Faulty',
    },
    {
      product: 'Fiber Connectors',
      serial: null,
      action: 'Stock In',
      qty: 50,
      date: '12 Mar',
      status: 'Received',
    },
    {
      product: 'Black ONT',
      serial: 'ALCLF9DE9961',
      action: 'Returned',
      by: 'Foday',
      date: '13 Mar',
      status: 'Returned',
      cond: 'Good Condition',
    },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 20px 0', flexShrink: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 18,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name="Mr Isaac" size={40} />
            <div>
              <div style={{ fontSize: 11, color: Colors.MU }}>Store Manager</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Mr Isaac</div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('stock')}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: Colors.A,
              border: 'none',
              cursor: 'pointer',
              fontSize: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            +
          </button>
        </div>

        <div
          style={{
            borderRadius: 22,
            padding: '20px',
            marginBottom: 14,
            overflow: 'hidden',
            background:
              'repeating-linear-gradient(135deg,#1C1C1C 0px,#1C1C1C 14px,#212121 14px,#212121 28px)',
            border: `1px solid ${Colors.BR}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: Colors.MU,
              marginBottom: 6,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Stock Overview
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 18,
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: Colors.MU }}>Total Products</div>
              <div style={{ fontSize: 38, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                {PRODUCTS.length}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: Colors.MU }}>In Stock</div>
              <div style={{ fontSize: 38, fontWeight: 800, color: Colors.A, lineHeight: 1 }}>
                {inStock}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              {
                label: 'Low',
                count: lowStock,
                clr: '#FF9F0A',
                bg: 'rgba(255,159,10,0.15)',
              },
              {
                label: 'Empty',
                count: outStock,
                clr: '#FF3B30',
                bg: 'rgba(255,59,48,0.14)',
              },
              {
                label: 'Items',
                count: PRODUCTS.reduce((a, p) => a + p.stock, 0),
                clr: Colors.A,
                bg: 'rgba(170,239,53,0.12)',
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  flex: 1,
                  background: s.bg,
                  borderRadius: 12,
                  padding: '8px 10px',
                }}
              >
                <div style={{ fontSize: 10, color: s.clr, fontWeight: 600 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.clr }}>
                  {s.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 14, overflowX: 'auto', paddingBottom: 2 }}>
          {['All', 'In Field', 'Returned', 'Received'].map((f) => (
            <Pill
              key={f}
              label={f}
              active={filter === f}
              onClick={() => setFilter(f)}
            />
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px 16px', flex: 1 }}>
        <div
          style={{
            fontSize: 11,
            color: Colors.MU,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          Recent Activity
        </div>
        {TX.map((tx, i) => (
          <div
            key={i}
            onClick={() => onNavigate('detail')}
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
            <Avatar name={tx.product} size={44} bg={Colors.DC2} tc={Colors.A} />
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
                {tx.product}
              </div>
              <div style={{ fontSize: 11, color: Colors.MU }}>
                {tx.serial ? tx.serial.slice(0, 16) : `×${tx.qty} units`} · {tx.date}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
                {tx.action}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Dot status={tx.status} />
                <span style={{ fontSize: 11, color: Colors.MU }}>{tx.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
