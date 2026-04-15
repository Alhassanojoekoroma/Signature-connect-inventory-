/**
 * Activity Log Service
 * Handles logging and retrieving user activities
 * Activities are auto-generated based on user actions
 */

import { supabase } from './supabaseClient';

/**
 * Log a user login activity
 * @param {UUID} userId - User ID
 * @param {string} userName - User's name
 * @returns {Promise<Object>} Activity log record
 */
export const logLoginActivity = async (userId, userName) => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert([
        {
          user_id: userId,
          user_name: userName,
          action: 'LOGIN',
          message: `${userName} logged into the system`,
        },
      ])
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error logging login activity:', error);
    return null;
  }
};

/**
 * Log a product view activity
 * @param {UUID} userId - User ID
 * @param {string} userName - User's name
 * @param {UUID} productId - Product ID
 * @param {string} productName - Product name
 * @returns {Promise<Object>} Activity log record
 */
export const logProductViewActivity = async (
  userId,
  userName,
  productId,
  productName
) => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert([
        {
          user_id: userId,
          user_name: userName,
          action: 'VIEW_PRODUCT',
          product_id: productId,
          product_name: productName,
          message: `${userName} viewed ${productName}`,
        },
      ])
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error logging product view:', error);
    return null;
  }
};

/**
 * Log an item view activity
 * @param {UUID} userId - User ID
 * @param {string} userName - User's name
 * @param {string} serialNumber - Item serial number
 * @returns {Promise<Object>} Activity log record
 */
export const logItemViewActivity = async (userId, userName, serialNumber) => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert([
        {
          user_id: userId,
          user_name: userName,
          action: 'VIEW_ITEM',
          serial_number: serialNumber,
          message: `${userName} viewed item ${serialNumber}`,
        },
      ])
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error logging item view:', error);
    return null;
  }
};

/**
 * Get all activity logs with pagination
 * @param {number} page - Page number (default 1)
 * @param {number} limit - Items per page (default 50)
 * @returns {Promise<Array>} Activity logs
 */
export const getAllActivityLogs = async (page = 1, limit = 50) => {
  try {
    const start = (page - 1) * limit;
    const { data, error, count } = await supabase
      .from('activity_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(start, start + limit - 1);

    if (error) throw error;
    return { data: data || [], total: count || 0 };
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return { data: [], total: 0 };
  }
};

/**
 * Get activity logs for a specific product
 * @param {UUID} productId - Product ID
 * @param {number} limit - Max records (default 20)
 * @returns {Promise<Array>} Activity logs for product
 */
export const getProductActivityLogs = async (productId, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching product activity logs:', error);
    return [];
  }
};

/**
 * Get activity logs for a specific item
 * @param {string} serialNumber - Item serial number
 * @param {number} limit - Max records (default 50)
 * @returns {Promise<Array>} Activity logs for item
 */
export const getItemActivityLogs = async (serialNumber, limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('serial_number', serialNumber)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching item activity logs:', error);
    return [];
  }
};

/**
 * Get activity logs by user
 * @param {UUID} userId - User ID
 * @param {number} limit - Max records (default 20)
 * @returns {Promise<Array>} Activity logs by user
 */
export const getUserActivityLogs = async (userId, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user activity logs:', error);
    return [];
  }
};

/**
 * Get activity logs by action type
 * @param {string} action - Action type (LOGIN, VIEW_PRODUCT, VIEW_ITEM, ISSUE, RETURN, etc.)
 * @param {number} limit - Max records (default 20)
 * @returns {Promise<Array>} Activity logs by action
 */
export const getActivityLogsByAction = async (action, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('action', action)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching activity logs by action:', error);
    return [];
  }
};

/**
 * Get activity logs within date range
 * @param {string} startDate - Start date (ISO format)
 * @param {string} endDate - End date (ISO format)
 * @param {number} limit - Max records (default 50)
 * @returns {Promise<Array>} Activity logs in date range
 */
export const getActivityLogsByDateRange = async (
  startDate,
  endDate,
  limit = 50
) => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching activity logs by date range:', error);
    return [];
  }
};

/**
 * Get activity statistics for dashboard
 * @returns {Promise<Object>} Activity statistics
 */
export const getActivityStats = async () => {
  try {
    // Get total activities today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.toISOString();

    const { data: todayData, error: todayError } = await supabase
      .from('activity_logs')
      .select('*', { count: 'exact' })
      .gte('created_at', todayStart);

    // Get count by action
    const { data: actionData, error: actionError } = await supabase
      .from('activity_logs')
      .select('action')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (todayError || actionError) throw todayError || actionError;

    const actionCounts = {};
    actionData?.forEach((log) => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
    });

    return {
      todayActivities: todayData?.length || 0,
      actionCounts: actionCounts,
    };
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    return { todayActivities: 0, actionCounts: {} };
  }
};

/**
 * Export activity logs as JSON
 * @param {Array} logs - Activity logs to export
 * @returns {string} JSON string
 */
export const exportActivityLogsAsJSON = (logs) => {
  return JSON.stringify(logs, null, 2);
};

/**
 * Format activity log for display
 * @param {Object} log - Activity log record
 * @returns {Object} Formatted log
 */
export const formatActivityLogForDisplay = (log) => {
  const date = new Date(log.created_at);
  const timeAgo = getTimeAgo(date);

  return {
    ...log,
    timeAgo: timeAgo,
    displayMessage: log.message,
    formattedDate: date.toLocaleString(),
  };
};

/**
 * Get time ago string (e.g., "2 mins ago")
 * @param {Date} date - Date to format
 * @returns {string} Time ago string
 */
const getTimeAgo = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' mins ago';

  return 'just now';
};

export default {
  logLoginActivity,
  logProductViewActivity,
  logItemViewActivity,
  getAllActivityLogs,
  getProductActivityLogs,
  getItemActivityLogs,
  getUserActivityLogs,
  getActivityLogsByAction,
  getActivityLogsByDateRange,
  getActivityStats,
  exportActivityLogsAsJSON,
  formatActivityLogForDisplay,
};
