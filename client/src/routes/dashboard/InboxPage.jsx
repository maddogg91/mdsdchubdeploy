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
    <div className="container">
      <h1 className="text-center text-white">Customer Inbox</h1>
      {error && <p className="text-danger">{error}</p>}
      <div className="panel panel-default">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Subject</th>
              <th>From</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((n) => (
              <tr key={n._id} className={n.isRead ? '' : 'fw-bold'}>
                <td>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary me-1"
                    title="Mark As Read"
                    onClick={() => handleMarkRead(n._id)}
                  >
                    Read
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    title="Delete Message"
                    onClick={() => handleDelete(n._id)}
                  >
                    Delete
                  </button>
                </td>
                <td>{n._id}</td>
                <td>{n.header}</td>
                <td>{n.notification?.request?.user?.email}</td>
                <td>{n.notification?.update}</td>
              </tr>
            ))}
            {notifications.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center">
                  No notifications.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
