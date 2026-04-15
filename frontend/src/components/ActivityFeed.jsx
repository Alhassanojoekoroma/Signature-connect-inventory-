/**
 * ActivityFeed Component
 * Displays activity logs in a timeline format
 */

import React, { useState, useEffect } from 'react';
import { getProductActivityLogs, getItemActivityLogs } from '../services/activityLogService';
import './ActivityFeed.css';

const ActivityFeed = ({ productId = null, serialNumber = null, limit = 10 }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, [productId, serialNumber]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      let logs = [];

      if (serialNumber) {
        logs = await getItemActivityLogs(serialNumber, limit);
      } else if (productId) {
        logs = await getProductActivityLogs(productId, limit);
      }

      setActivities(logs || []);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activity feed');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);

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

  const getActivityIcon = (action) => {
    const iconMap = {
      LOGIN: '🔓',
      VIEW_PRODUCT: '👁️',
      VIEW_ITEM: '👁️',
      ADD_STOCK: '📦',
      ISSUE: '📤',
      RETURN: '📥',
      MARK_FAULTY: '⚠️',
      VIEW: '👁️',
    };
    return iconMap[action] || '•';
  };

  if (loading) {
    return (
      <div className="activity-feed loading">
        <p>Loading activities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="activity-feed error">
        <p>{error}</p>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="activity-feed empty">
        <p>No activity yet</p>
      </div>
    );
  }

  return (
    <div className="activity-feed">
      <div className="activity-timeline">
        {activities.map((activity, index) => (
          <div key={activity.id || index} className="activity-item">
            <div className="activity-icon">{getActivityIcon(activity.action)}</div>
            <div className="activity-content">
              <p className="activity-message">{activity.message}</p>
              <p className="activity-time">{formatTimeAgo(activity.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
