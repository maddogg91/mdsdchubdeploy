import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext.jsx';
import * as notificationsApi from '../../api/notifications.js';

export default function InboxPage() {
  const { notifications, refresh } = useDashboard();
  const [error, setError] = useState('');

  async function handleMarkRead(id) {
    setError('');
    try {
      await notificationsApi.markNotificationRead(id);
      await refresh();
    } catch (err) {
      setError(err.message ?? 'Could not mark notification as read');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this notification? It will be archived for 30 days.')) {
      return;
    }
    setError('');
    try {
      await notificationsApi.deleteNotification(id);
      await refresh();
    } catch (err) {
      setError(err.message ?? 'Could not delete notification');
    }
  }

  return (
    <div>
      <div className="dash-heading">
        <h1>Inbox</h1>
        <p>Updates and requests related to your projects.</p>
      </div>

      {error && <p className="auth-alert">{error}</p>}

      {notifications.length === 0 ? (
        <div className="dash-empty">No notifications yet.</div>
      ) : (
        <div className="notif-list">
          {notifications.map((n) => (
            <div className={`notif-item${n.isRead ? '' : ' unread'}`} key={n._id}>
              <div className="notif-item-body">
                <h4>{n.header}</h4>
                <p>{n.notification?.update}</p>
                {n.notification?.request?.user?.email && (
                  <div className="notif-item-meta">From: {n.notification.request.user.email}</div>
                )}
              </div>
              <div className="notif-item-actions">
                <button
                  type="button"
                  className="btn-brand-outline btn-brand-sm"
                  onClick={() => handleMarkRead(n._id)}
                >
                  Mark read
                </button>
                <button
                  type="button"
                  className="btn-brand-danger"
                  onClick={() => handleDelete(n._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
