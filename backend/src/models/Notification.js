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
      enum: ['task_assigned', 'task_completed', 'deadline_reminder', 'project_update'],
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
