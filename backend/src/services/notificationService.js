const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

/**
 * Creates a DB notification record and optionally sends an email.
 * @param {string} recipientId - User._id
 * @param {string} type - notification type enum
 * @param {string} message - human-readable message
 * @param {string|null} relatedId - related task/project ID
 */
const createNotification = async (recipientId, type, message, relatedId = null) => {
  try {
    // Save to DB
    await Notification.create({ recipient: recipientId, type, message, relatedId });

    // Send email if user exists and has email
    const user = await User.findById(recipientId).select('email fullName');
    if (user && user.email) {
      const subjectMap = {
        task_assigned: '📋 New Task Assigned to You',
        task_completed: '✅ Task Completed',
        deadline_reminder: '⏰ Task Deadline Approaching',
        project_update: '📁 Project Update',
      };

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Task It</h1>
          </div>
          <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <p style="color: #374151; font-size: 16px;">Hi ${user.fullName},</p>
            <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">${message}</p>
            <div style="margin-top: 24px; padding: 12px 16px; background: #ede9fe; border-left: 4px solid #7c3aed; border-radius: 4px;">
              <p style="margin: 0; color: #5b21b6; font-size: 14px;">${message}</p>
            </div>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">You received this email because you are a member of Task It workspace.</p>
          </div>
        </div>
      `;

      await sendEmail({
        to: user.email,
        subject: subjectMap[type] || 'Task It Notification',
        html,
      });
    }
  } catch (err) {
    // Never crash the main request due to notification failure
    console.error('[NotificationService] Error creating notification:', err.message);
  }
};

module.exports = { createNotification };
