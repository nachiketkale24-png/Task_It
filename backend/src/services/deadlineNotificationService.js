const Task = require('../models/Task');
const { createNotification } = require('./notificationService');

const DAY_MS = 24 * 60 * 60 * 1000;

const sendDeadlineNotifications = async () => {
  const now = new Date();
  const soon = new Date(now.getTime() + DAY_MS);

  const dueSoonTasks = await Task.find({
    assignee: { $exists: true, $ne: null },
    status: { $ne: 'Completed' },
    deadline: { $gte: now, $lte: soon },
    deadlineReminderSentAt: { $exists: false },
  }).populate('project', 'projectName');

  for (const task of dueSoonTasks) {
    await createNotification(
      task.assignee,
      'deadline_reminder',
      `Task "${task.title}" is due by ${new Date(task.deadline).toLocaleDateString()}.`,
      task._id,
      { path: '/tasks' }
    );
    task.deadlineReminderSentAt = new Date();
    await task.save();
  }

  const overdueTasks = await Task.find({
    assignee: { $exists: true, $ne: null },
    status: { $ne: 'Completed' },
    deadline: { $lt: now },
    overdueNotificationSentAt: { $exists: false },
  }).populate('project', 'projectName');

  for (const task of overdueTasks) {
    await createNotification(
      task.assignee,
      'task_overdue',
      `Task "${task.title}" is overdue.`,
      task._id,
      { path: '/tasks' }
    );
    task.overdueNotificationSentAt = new Date();
    await task.save();
  }
};

const startDeadlineNotificationJob = () => {
  if (process.env.DISABLE_DEADLINE_JOB === 'true') {
    return;
  }

  const intervalMinutes = Number(process.env.DEADLINE_JOB_INTERVAL_MINUTES || 60);
  const intervalMs = Math.max(intervalMinutes, 5) * 60 * 1000;

  setTimeout(() => {
    sendDeadlineNotifications().catch((error) => {
      console.error('[DeadlineNotificationJob] Initial run failed:', error.message);
    });
  }, 5000);

  setInterval(() => {
    sendDeadlineNotifications().catch((error) => {
      console.error('[DeadlineNotificationJob] Scheduled run failed:', error.message);
    });
  }, intervalMs);
};

module.exports = {
  sendDeadlineNotifications,
  startDeadlineNotificationJob,
};
