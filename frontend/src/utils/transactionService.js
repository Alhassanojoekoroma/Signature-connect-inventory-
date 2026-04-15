import { supabase } from './supabaseClient';

/**
 * Transaction Service
 * Handles all transaction logging and management
 */

export const transactionService = {
  /**
   * Get all transactions
   */
  getAllTransactions: async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(
          `
          *,
          user:user_id(id, name, email),
          issued_to_user:issued_to(id, name, email),
          returned_by_user:returned_by(id, name, email),
          received_by_user:received_by(id, name, email),
          authorized_by_user:authorized_by(id, name, email)
        `
        )
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  /**
   * Get transactions for a specific serial number
   */
  getTransactionsBySerial: async (serialNumber) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(
          `
          *,
          user:user_id(id, name, email),
          issued_to_user:issued_to(id, name, email),
          returned_by_user:returned_by(id, name, email),
          received_by_user:received_by(id, name, email),
          authorized_by_user:authorized_by(id, name, email)
        `
        )
        .eq('serial_number', serialNumber)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching transactions by serial:', error);
      throw error;
    }
  },

  /**
   * Get transactions by user ID
   */
  getTransactionsByUser: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(
          `
          *,
          user:user_id(id, name, email),
          issued_to_user:issued_to(id, name, email),
          returned_by_user:returned_by(id, name, email),
          received_by_user:received_by(id, name, email),
          authorized_by_user:authorized_by(id, name, email)
        `
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching transactions by user:', error);
      throw error;
    }
  },

  /**
   * Get transactions by action type
   */
  getTransactionsByAction: async (action) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(
          `
          *,
          user:user_id(id, name, email),
          issued_to_user:issued_to(id, name, email),
          returned_by_user:returned_by(id, name, email),
          received_by_user:received_by(id, name, email),
          authorized_by_user:authorized_by(id, name, email)
        `
        )
        .eq('action', action)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching transactions by action:', error);
      throw error;
    }
  },

  /**
   * Get transactions by date range
   */
  getTransactionsByDateRange: async (startDate, endDate) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(
          `
          *,
          user:user_id(id, name, email),
          issued_to_user:issued_to(id, name, email),
          returned_by_user:returned_by(id, name, email),
          received_by_user:received_by(id, name, email),
          authorized_by_user:authorized_by(id, name, email)
        `
        )
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching transactions by date range:', error);
      throw error;
    }
  },

  /**
   * Create ADD_STOCK transaction
   */
  addStockTransaction: async (serialNumber, userId, productData) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            serial_number: serialNumber,
            action: 'ADD_STOCK',
            user_id: userId,
            received_by: userId,
            condition: productData.condition || 'Good Condition',
            quantity: productData.quantity || 1,
            notes: productData.notes,
            approval_status: 'APPROVED',
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating add stock transaction:', error);
      throw error;
    }
  },

  /**
   * Create ISSUE transaction
   */
  issueTransaction: async (serialNumber, userId, issueData) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            serial_number: serialNumber,
            action: 'ISSUE',
            user_id: userId,
            customer_name: issueData.customer_name,
            issued_to: issueData.issued_to,
            authorized_by: issueData.authorized_by,
            category: issueData.category,
            quantity: issueData.quantity || 1,
            notes: issueData.notes,
            approval_status: 'PENDING', // Requires approval
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating issue transaction:', error);
      throw error;
    }
  },

  /**
   * Create RETURN transaction
   */
  returnTransaction: async (serialNumber, userId, returnData) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            serial_number: serialNumber,
            action: 'RETURN',
            user_id: userId,
            returned_by: returnData.returned_by,
            received_by: returnData.received_by,
            condition: returnData.condition,
            quantity: returnData.quantity || 1,
            notes: returnData.notes,
            approval_status: 'APPROVED',
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating return transaction:', error);
      throw error;
    }
  },

  /**
   * Create MARK_FAULTY transaction
   */
  markFaultyTransaction: async (serialNumber, userId, faultyData) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            serial_number: serialNumber,
            action: 'MARK_FAULTY',
            user_id: userId,
            condition: 'Faulty',
            notes: faultyData.notes || 'Marked as faulty',
            approval_status: 'APPROVED',
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating mark faulty transaction:', error);
      throw error;
    }
  },

  /**
   * Create VIEW transaction (audit trail)
   */
  viewTransaction: async (serialNumber, userId) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            serial_number: serialNumber,
            action: 'VIEW',
            user_id: userId,
            approval_status: 'APPROVED',
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // Silently fail for view transactions (they're just for logging)
      console.warn('Could not log view transaction:', error);
      return null;
    }
  },

  /**
   * Get pending approvals
   */
  getPendingApprovals: async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(
          `
          *,
          user:user_id(id, name, email),
          issued_to_user:issued_to(id, name, email),
          authorized_by_user:authorized_by(id, name, email)
        `
        )
        .eq('approval_status', 'PENDING')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      throw error;
    }
  },

  /**
   * Update transaction approval status (Admin only)
   */
  updateApprovalStatus: async (transactionId, status, rejectionReason = null) => {
    try {
      const updateData = {
        approval_status: status,
        updated_at: new Date(),
      };

      const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', transactionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating approval status:', error);
      throw error;
    }
  },

  /**
   * Get transaction statistics
   */
  getTransactionStats: async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Today's transactions
      const todayStart = `${today}T00:00:00`;
      const todayEnd = `${today}T23:59:59`;

      const { data: todayData, error: todayError } = await supabase
        .from('transactions')
        .select('action')
        .gte('created_at', todayStart)
        .lte('created_at', todayEnd);

      if (todayError) throw todayError;

      const stats = {
        today: {
          issues: todayData.filter((t) => t.action === 'ISSUE').length,
          returns: todayData.filter((t) => t.action === 'RETURN').length,
          added: todayData.filter((t) => t.action === 'ADD_STOCK').length,
          marked_faulty: todayData.filter((t) => t.action === 'MARK_FAULTY')
            .length,
        },
      };

      return stats;
    } catch (error) {
      console.error('Error fetching transaction stats:', error);
      throw error;
    }
  },
};

export default transactionService;
