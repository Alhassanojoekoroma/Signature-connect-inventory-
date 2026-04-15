import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase credentials. Ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set in .env'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export useful types
export const ItemStatus = {
  IN_STORE: 'IN_STORE',
  IN_FIELD: 'IN_FIELD',
  RETURNED: 'RETURNED',
  FAULTY: 'FAULTY',
  DAMAGED: 'DAMAGED',
};

export const TransactionAction = {
  ADD_STOCK: 'ADD_STOCK',
  ISSUE: 'ISSUE',
  RETURN: 'RETURN',
  MARK_FAULTY: 'MARK_FAULTY',
  VIEW: 'VIEW',
};

export const ApprovalStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export const Conditions = [
  'Good Condition',
  'Faulty',
  'Damaged',
  'New in Box',
  'New in Pack',
];
