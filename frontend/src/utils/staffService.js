import { supabase } from './supabaseClient';

/**
 * Staff Directory Service
 * Manages staff members and dropdown data
 */

export const staffService = {
  /**
   * Get all staff members
   */
  getAllStaff: async () => {
    try {
      const { data, error } = await supabase
        .from('staff_directory')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  },

  /**
   * Get staff by category (e.g., "Field Team", "Office", "Admin")
   */
  getStaffByCategory: async (category) => {
    try {
      const { data, error } = await supabase
        .from('staff_directory')
        .select('*')
        .eq('category', category)
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching staff by category:', error);
      throw error;
    }
  },

  /**
   * Get staff member by name
   */
  getStaffByName: async (name) => {
    try {
      const { data, error } = await supabase
        .from('staff_directory')
        .select('*')
        .ilike('name', name)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching staff by name:', error);
      throw error;
    }
  },

  /**
   * Create new staff member (Admin only)
   */
  createStaff: async (staffData, userId) => {
    try {
      const { data, error } = await supabase
        .from('staff_directory')
        .insert([
          {
            name: staffData.name,
            email: staffData.email,
            role: staffData.role,
            category: staffData.category,
            created_by: userId,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating staff member:', error);
      throw error;
    }
  },

  /**
   * Get names for dropdowns (quick lookup)
   */
  getStaffNames: async () => {
    try {
      const staff = await staffService.getAllStaff();
      return staff.map((s) => s.name);
    } catch (error) {
      console.error('Error fetching staff names:', error);
      return [];
    }
  },

  /**
   * Get staff directory as simple key-value for dropdowns
   */
  getStaffDropdownData: async () => {
    try {
      const staff = await staffService.getAllStaff();
      const options = {};

      staff.forEach((s) => {
        options[s.id] = s.name;
      });

      return options;
    } catch (error) {
      console.error('Error fetching staff dropdown data:', error);
      return {};
    }
  },
};

/**
 * Audit Logs Service
 * Manages comprehensive audit trail
 */

export const auditLogService = {
  /**
   * Get all audit logs
   */
  getAllAuditLogs: async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(
          `
          *,
          user:user_id(id, name, email)
        `
        )
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  },

  /**
   * Get audit logs for specific user
   */
  getAuditLogsByUser: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(
          `
          *,
          user:user_id(id, name, email)
        `
        )
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user audit logs:', error);
      throw error;
    }
  },

  /**
   * Get audit logs by action
   */
  getAuditLogsByAction: async (action) => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(
          `
          *,
          user:user_id(id, name, email)
        `
        )
        .eq('action', action)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching audit logs by action:', error);
      throw error;
    }
  },

  /**
   * Get audit logs by table
   */
  getAuditLogsByTable: async (table) => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(
          `
          *,
          user:user_id(id, name, email)
        `
        )
        .eq('affected_table', table)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching audit logs by table:', error);
      throw error;
    }
  },

  /**
   * Get audit logs by date range
   */
  getAuditLogsByDateRange: async (startDate, endDate) => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(
          `
          *,
          user:user_id(id, name, email)
        `
        )
        .gte('timestamp', startDate)
        .lte('timestamp', endDate)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching audit logs by date range:', error);
      throw error;
    }
  },

  /**
   * Get audit log details (for viewing detailed changes)
   */
  getAuditLogDetail: async (logId) => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(
          `
          *,
          user:user_id(id, name, email)
        `
        )
        .eq('id', logId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching audit log detail:', error);
      throw error;
    }
  },

  /**
   * Create audit log entry (typically called by database trigger)
   */
  createAuditLog: async (auditData) => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .insert([
          {
            user_id: auditData.user_id,
            action: auditData.action,
            description: auditData.description,
            affected_table: auditData.affected_table,
            affected_id: auditData.affected_id,
            old_values: auditData.old_values || null,
            new_values: auditData.new_values || null,
            ip_address: auditData.ip_address,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating audit log:', error);
      // Don't throw - audit logs should never block operations
      return null;
    }
  },

  /**
   * Get user activity summary
   */
  getUserActivitySummary: async (userId, days = 7) => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const logs = await auditLogService.getAuditLogsByUser(userId);
      const recentLogs = logs.filter(
        (l) => new Date(l.timestamp) >= startDate
      );

      const actionCounts = {};
      recentLogs.forEach((log) => {
        actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
      });

      return {
        userId,
        period: `Last ${days} days`,
        totalActions: recentLogs.length,
        actions: actionCounts,
        firstAction: recentLogs[recentLogs.length - 1]?.timestamp,
        lastAction: recentLogs[0]?.timestamp,
      };
    } catch (error) {
      console.error('Error getting user activity summary:', error);
      throw error;
    }
  },

  /**
   * Export audit logs as JSON
   */
  exportAuditLogs: async (filters = {}) => {
    try {
      let query = supabase
        .from('audit_logs')
        .select(
          `
          *,
          user:user_id(id, name, email)
        `
        );

      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters.action) {
        query = query.eq('action', filters.action);
      }
      if (filters.table) {
        query = query.eq('affected_table', filters.table);
      }

      const { data, error } = await query.order('timestamp', {
        ascending: false,
      });

      if (error) throw error;

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      throw error;
    }
  },
};

export default { staffService, auditLogService };
