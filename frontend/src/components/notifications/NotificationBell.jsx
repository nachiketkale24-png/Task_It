import { useState, useEffect, useRef } from 'react';
import { FiBell, FiCheck, FiCheckSquare, FiTrash2, FiX } from 'react-icons/fi';
import { getNotifications, markRead, markAllRead, deleteNotification } from '../../services/notificationService';

const TYPE_ICONS = {
  task_assigned: '📋',
  task_completed: '✅',
  deadline_reminder: '⏰',
  project_update: '📁',
};

const TYPE_COLORS = {
  task_assigned: 'bg-violet-50 border-violet-200',
  task_completed: 'bg-green-50 border-green-200',
  deadline_reminder: 'bg-amber-50 border-amber-200',
  project_update: 'bg-blue-50 border-blue-200',
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications();
      setNotifications(res.data.data || []);
      setUnread(res.data.unreadCount || 0);
    } catch {
      // silently fail if not authenticated yet
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleMarkRead = async (id) => {
    try {
      await markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnread((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnread(0);
    } catch {}
  };

  const handleDelete = async (id) => {
    const wasUnread = notifications.find((n) => n._id === id && !n.read);
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (wasUnread) setUnread((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        id="notification-bell-btn"
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition"
        aria-label="Notifications"
      >
        <FiBell size={20} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 top-11 z-50 w-96 rounded-2xl border border-gray-100 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-5 py-3">
            <div className="flex items-center gap-2">
              <FiBell size={16} className="text-violet-600" />
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unread > 0 && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                  {unread} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-violet-600 hover:bg-violet-50 transition"
                  title="Mark all as read"
                >
                  <FiCheckSquare size={12} />
                  All read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 transition"
              >
                <FiX size={14} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-violet-600" />
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="py-12 text-center">
                <FiBell size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-400">No notifications yet</p>
              </div>
            )}

            {!loading &&
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`group flex gap-3 border-b border-gray-50 px-4 py-3 transition hover:bg-gray-50/70 ${
                    !n.read ? 'bg-violet-50/40' : ''
                  }`}
                >
                  {/* Icon */}
                  <span className="mt-0.5 text-xl">{TYPE_ICONS[n.type] || '🔔'}</span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug ${!n.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                      {n.message}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">{timeAgo(n.createdAt)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition">
                    {!n.read && (
                      <button
                        onClick={() => handleMarkRead(n._id)}
                        className="rounded-lg p-1 text-violet-500 hover:bg-violet-100 transition"
                        title="Mark as read"
                      >
                        <FiCheck size={13} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(n._id)}
                      className="rounded-lg p-1 text-red-400 hover:bg-red-50 transition"
                      title="Delete"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>

                  {/* Unread dot */}
                  {!n.read && (
                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-violet-500" />
                  )}
                </div>
              ))}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t px-5 py-2.5 text-center">
              <p className="text-xs text-gray-400">
                Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
