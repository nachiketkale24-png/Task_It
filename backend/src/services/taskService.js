const Task = require('../models/Task');

const createTask = async (taskData, userId) => {
  return await Task.create({
    ...taskData,
    createdBy: userId
  });
};

const getTasks = async (userId) => {
  // Returns tasks where the user is either the creator or the assignee
  return await Task.find({
    $or: [{ assignee: userId }, { createdBy: userId }]
  })
    .populate('assignee', 'fullName email')
    .populate('createdBy', 'fullName email')
    .sort({ createdAt: -1 });
};

const getTaskById = async (taskId, userId) => {
  const task = await Task.findById(taskId)
    .populate('assignee', 'fullName email')
    .populate('createdBy', 'fullName email')
    .populate('comments.user', 'fullName email');

  if (!task) return null;

  // Authorization check (only creator or assignee can view)
  const hasAccess = 
    task.createdBy._id.toString() === userId.toString() || 
    (task.assignee && task.assignee._id.toString() === userId.toString());

  if (!hasAccess) {
    throw new Error('Access denied to this task');
  }

  return task;
};

const updateTask = async (taskId, userId, updateData) => {
  const task = await Task.findById(taskId);
  if (!task) return null;

  // Authorization check
  const hasAccess = 
    task.createdBy.toString() === userId.toString() || 
    (task.assignee && task.assignee.toString() === userId.toString());

  if (!hasAccess) {
    throw new Error('Access denied to update this task');
  }

  // Handle clear assignee case
  if (updateData.assignee === '' || updateData.assignee === null) {
    updateData.assignee = undefined;
    task.set('assignee', undefined);
  }

  Object.assign(task, updateData);
  await task.save();

  return await task.populate('assignee', 'fullName email');
};

const deleteTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) return null;

  // Only the task creator can delete it
  if (task.createdBy.toString() !== userId.toString()) {
    throw new Error('Only the task creator can delete it');
  }

  await Task.findByIdAndDelete(taskId);
  return true;
};

// --- Subtasks Checklist CRUD ---
const addSubtask = async (taskId, userId, subtaskTitle) => {
  const task = await getTaskById(taskId, userId);
  if (!task) return null;

  task.subtasks.push({ title: subtaskTitle, isCompleted: false });
  await task.save();
  return task;
};

const toggleSubtask = async (taskId, userId, subtaskId, isCompleted) => {
  const task = await getTaskById(taskId, userId);
  if (!task) return null;

  const subtask = task.subtasks.id(subtaskId);
  if (!subtask) throw new Error('Subtask not found');

  subtask.isCompleted = isCompleted;
  await task.save();
  return task;
};

const deleteSubtask = async (taskId, userId, subtaskId) => {
  const task = await getTaskById(taskId, userId);
  if (!task) return null;

  task.subtasks.pull(subtaskId);
  await task.save();
  return task;
};

// --- Comments CRUD ---
const addComment = async (taskId, userId, text) => {
  const task = await getTaskById(taskId, userId);
  if (!task) return null;

  task.comments.push({ user: userId, text });
  await task.save();

  return await task.populate('comments.user', 'fullName email');
};

const deleteComment = async (taskId, userId, commentId) => {
  const task = await Task.findById(taskId);
  if (!task) return null;

  const comment = task.comments.id(commentId);
  if (!comment) throw new Error('Comment not found');

  // Only the comment author or task creator can delete
  if (comment.user.toString() !== userId.toString() && task.createdBy.toString() !== userId.toString()) {
    throw new Error('Not authorized to delete this comment');
  }

  task.comments.pull(commentId);
  await task.save();
  return task;
};

// --- Attachments CRUD ---
const addAttachment = async (taskId, userId, attachmentName, attachmentUrl) => {
  const task = await getTaskById(taskId, userId);
  if (!task) return null;

  task.attachments.push({ name: attachmentName, url: attachmentUrl });
  await task.save();
  return task;
};

const deleteAttachment = async (taskId, userId, attachmentId) => {
  const task = await getTaskById(taskId, userId);
  if (!task) return null;

  task.attachments.pull(attachmentId);
  await task.save();
  return task;
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addSubtask,
  toggleSubtask,
  deleteSubtask,
  addComment,
  deleteComment,
  addAttachment,
  deleteAttachment
};
