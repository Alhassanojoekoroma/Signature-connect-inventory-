// Design System Colors
export const Colors = {
  A: '#AAEF35',      // Accent (bright green)
  DB: '#0F0F0F',     // Dark background
  DC: '#1B1B1B',     // Dark card
  DC2: '#252525',    // Dark card alt
  BR: '#2D2D2D',     // Border
  MU: '#717171',     // Muted text
};

export const statusColor = {
  'In Stock': '#4CD964',
  'In Field': '#FF9F0A',
  'Low Stock': '#FF9F0A',
  'Out of Stock': '#FF3B30',
  'Returned': '#5AC8FA',
  'Received': '#4CD964',
  'Faulty': '#FF3B30',
  'Damaged': '#FF3B30',
  'Active': '#FF9F0A',
};

export const PRODUCTS = [
  { id: 1, name: '769XR XPON Router', cat: 'Router', serials: ['XPONDD87A2D2', 'XPONDD87A3A2', 'XPONDD87A432'], stock: 8, status: 'In Stock' },
  { id: 2, name: 'Nokia ONU', cat: 'ONU', serials: ['NK-ONU-001', 'NK-ONU-002'], stock: 10, status: 'In Stock' },
  { id: 3, name: 'Mikrotik 951', cat: 'Router', serials: ['HKB0AMS5SH3', 'HKB0AVX59HR'], stock: 2, status: 'Low Stock' },
  { id: 4, name: 'Black ONT', cat: 'ONT', serials: ['ALCLF9DE9961'], stock: 1, status: 'Low Stock' },
  { id: 5, name: 'Fiber Connectors', cat: 'Consumable', serials: [], stock: 60, status: 'In Stock' },
  { id: 6, name: 'D-Link Router', cat: 'Router', serials: ['DL-WR001'], stock: 0, status: 'Out of Stock' },
  { id: 7, name: 'Sig. Connect ONT 122XR', cat: 'ONT', serials: ['SC-122XR-001', 'SC-122XR-002'], stock: 2, status: 'Low Stock' },
];

export const STAFF = ['Mr Isaac', 'Susan', 'Fred', 'Foday', 'OJOE', 'Emmanuel'];
export const CATS = ['Installation', 'Replacement', 'Connectors', 'General'];
export const CONDITIONS = ['Good Condition', 'Faulty', 'Damaged', 'New in Box', 'New in Pack'];
