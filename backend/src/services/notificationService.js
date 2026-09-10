const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

const typeToPref = {
  team_invite: 'projectUpdates',
  team_removed: 'projectUpdates',
  team_role_changed: 'projectUpdates',
  task_assigned: 'taskAssigned',
  task_reassigned: 'taskAssigned',
  task_completed: 'taskCompleted',
  task_status_changed: 'taskCompleted',
  deadline_reminder: 'deadlineReminder',
  task_overdue: 'deadlineReminder',
  project_update: 'projectUpdates',
};

const subjectMap = {
  team_invite: 'You were added to a Task It team',
  team_removed: 'Task It team membership updated',
  team_role_changed: 'Task It team role updated',
  task_assigned: 'New task assigned to you',
  task_reassigned: 'Task reassigned to you',
  task_completed: 'Task completed',
  task_status_changed: 'Task status updated',
  deadline_reminder: 'Task deadline approaching',
  task_overdue: 'Task is overdue',
  project_update: 'Project update',
};

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const shouldSendEmail = (user, type) => {
  const pref = typeToPref[type];
  if (!pref) return true;
  return user.notificationPrefs?.[pref] !== false;
};

const buildEmail = ({ user, subject, message, link }) => {
  const safeMessage = escapeHtml(message);
  const safeName = escapeHtml(user.fullName || 'there');
  const safeLink = link ? escapeHtml(link) : '';

  return {
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
        <div style="padding: 20px 0; border-bottom: 1px solid #e5e7eb;">
          <h1 style="margin: 0; font-size: 20px; font-weight: 700;">Task It</h1>
        </div>
        <div style="padding: 24px 0;">
          <p style="font-size: 15px; margin: 0 0 16px;">Hi ${safeName},</p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px;">${safeMessage}</p>
          ${
            safeLink
              ? `<p style="margin: 24px 0;"><a href="${safeLink}" style="background: #111827; color: #ffffff; padding: 10px 14px; border-radius: 8px; text-decoration: none; font-size: 14px;">Open in Task It</a></p>`
              : ''
          }
          <p style="color: #6b7280; font-size: 12px; margin-top: 28px;">You received this email because notifications are enabled for your Task It account.</p>
        </div>
      </div>
    `,
    text: `${subject}\n\nHi ${user.fullName || 'there'},\n\n${message}${link ? `\n\nOpen: ${link}` : ''}`,
  };
};

const createNotification = async (recipientId, type, message, relatedId = null, options = {}) => {
  try {
    const link =
      options.link ||
      (options.path && process.env.FRONTEND_URL
        ? `${process.env.FRONTEND_URL.replace(/\/$/, '')}${options.path}`
        : '');

    await Notification.create({ recipient: recipientId, type, message, relatedId, link });

    const user = await User.findById(recipientId).select('email fullName notificationPrefs');
    if (!user?.email || options.email === false || !shouldSendEmail(user, type)) {
      return;
    }

    const subject = options.subject || subjectMap[type] || 'Task It notification';
    const { html, text } = buildEmail({ user, subject, message, link });
    await sendEmail({ to: user.email, subject, html, text });
  } catch (err) {
    console.error('[NotificationService] Error creating notification:', err.message);
  }
};

module.exports = { createNotification };
