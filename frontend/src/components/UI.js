import React from 'react';
import { Colors } from '../utils/constants';

export const Dot = ({ status }) => (
  <span
    style={{
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: {
        'In Stock': '#4CD964',
        'In Field': '#FF9F0A',
        'Low Stock': '#FF9F0A',
        'Out of Stock': '#FF3B30',
        'Returned': '#5AC8FA',
        'Received': '#4CD964',
        'Faulty': '#FF3B30',
        'Damaged': '#FF3B30',
      }[status] || '#888',
      display: 'inline-block',
      marginRight: 5,
      flexShrink: 0,
    }}
  />
);

export const Avatar = ({ name, size = 40, bg = Colors.A, tc = '#000' }) => {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg,
        color: tc,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: size * 0.34,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
};

export const Pill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '7px 15px',
      borderRadius: 999,
      border: 'none',
      cursor: 'pointer',
      background: active ? Colors.A : Colors.DC2,
      color: active ? '#000' : Colors.MU,
      fontWeight: active ? 700 : 400,
      fontSize: 13,
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </button>
);

export const NavBtn = ({ icon, label, active, onClick, light }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 3,
      padding: '8px 0',
      color: active ? Colors.A : light ? '#AAAAAA' : Colors.MU,
    }}
  >
    <span style={{ fontSize: 20 }}>{icon}</span>
    <span style={{ fontSize: 10, fontWeight: active ? 700 : 400 }}>{label}</span>
  </button>
);

export const Label = ({ text }) => (
  <div style={{ fontSize: 12, color: '#888', marginBottom: 5, marginTop: 14 }}>
    {text}
  </div>
);

export const SelectField = ({ value, onChange, options, val, set, opts }) => {
  // Handle both naming conventions
  const actualValue = value !== undefined ? value : val;
  const actualOnChange = onChange || set;
  const actualOptions = options || opts || [];

  return (
    <select
      value={actualValue || ''}
      onChange={(e) => actualOnChange(e.target.value)}
      style={{
        width: '100%',
        padding: '12px 14px',
        borderRadius: 12,
        border: '1.5px solid #E8E8E8',
        background: '#fff',
        fontSize: 14,
        color: '#111',
        WebkitAppearance: 'none',
        appearance: 'none',
      }}
    >
      <option value="">Select an option</option>
      {Array.isArray(actualOptions) && actualOptions.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
};

export const Toast = ({ message, show }) =>
  show && (
    <div
      style={{
        position: 'fixed',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#111',
        color: '#fff',
        padding: '11px 22px',
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        zIndex: 99,
        whiteSpace: 'nowrap',
        border: `1px solid ${Colors.BR}`,
      }}
    >
      {message}
    </div>
  );
