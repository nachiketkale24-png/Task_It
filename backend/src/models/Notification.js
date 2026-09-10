const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'team_invite',
        'team_removed',
        'team_role_changed',
        'task_assigned',
        'task_reassigned',
        'task_completed',
        'task_status_changed',
        'deadline_reminder',
        'task_overdue',
        'project_update'
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedId: {
      type: mongoose.Schema.Types.Mixed, // task._id or project._id
      default: null,
    },
    link: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
