const taskService = require('../services/taskService');
const { createNotification } = require('../services/notificationService');

const getId = (value) => value?._id?.toString?.() || value?.toString?.() || '';

const createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body, req.user._id);
    const assigneeId = getId(task.assignee);
    const projectName = task.project?.projectName || 'Unassigned project';

    // Notify assignee if different from creator
    if (assigneeId && assigneeId !== req.user._id.toString()) {
      await createNotification(
        assigneeId,
        'task_assigned',
        `You have been assigned "${task.title}" in ${projectName}. Priority: ${task.priority}. Deadline: ${task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Not set'}.`,
        task._id,
        { path: '/tasks' }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasks(req.user._id, req.query);
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getTask = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user._id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(error.statusCode || (error.message.includes('Access denied') ? 403 : 400)).json({
      success: false,
      message: error.message
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const previousTask = await taskService.getTaskById(req.params.id, req.user._id).catch(() => null);
    const task = await taskService.updateTask(req.params.id, req.user._id, req.body);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Notify new assignee when assignee changes
    const newAssigneeId = req.body.assignee || req.body.assignedTo;
    const oldAssigneeId = getId(previousTask?.assignee);
    const projectName = task.project?.projectName || 'Unassigned project';
    if (newAssigneeId && newAssigneeId !== req.user._id.toString() && newAssigneeId !== oldAssigneeId) {
      await createNotification(
        newAssigneeId,
        oldAssigneeId ? 'task_reassigned' : 'task_assigned',
        `You have been assigned "${task.title}" in ${projectName}. Priority: ${task.priority}. Deadline: ${task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Not set'}.`,
        task._id,
        { path: '/tasks' }
      );
    }

    if (req.body.status && previousTask?.status && req.body.status !== previousTask.status) {
      const assigneeId = getId(task.assignee);
      if (assigneeId && assigneeId !== req.user._id.toString()) {
        await createNotification(
          assigneeId,
          'task_status_changed',
          `Task "${task.title}" status changed to ${req.body.status}.`,
          task._id,
          { path: '/tasks', email: false }
        );
      }
    }

    // Notify creator when task is completed (if they're not the one updating)
    if (req.body.status === 'Completed' && previousTask?.status !== 'Completed') {
      const creatorId = getId(task.createdBy);
      if (creatorId && creatorId !== req.user._id.toString()) {
        await createNotification(
          creatorId,
          'task_completed',
          `Task "${task.title}" has been marked as Completed.`,
          task._id,
          { path: '/tasks' }
        );
      }
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    res.status(error.statusCode || (error.message.includes('Access denied') ? 403 : 400)).json({
      success: false,
      message: error.message
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await taskService.deleteTask(req.params.id, req.user._id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(error.statusCode || (error.message.includes('creator') ? 403 : 400)).json({
      success: false,
      message: error.message
    });
  }
};

// --- Subtasks ---
const addSubtask = async (req, res) => {
  try {
    const task = await taskService.addSubtask(req.params.id, req.user._id, req.body.title);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

const toggleSubtask = async (req, res) => {
  try {
    const task = await taskService.toggleSubtask(
      req.params.id,
      req.user._id,
      req.params.subtaskId,
      req.body.isCompleted
    );
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

const deleteSubtask = async (req, res) => {
  try {
    const task = await taskService.deleteSubtask(req.params.id, req.user._id, req.params.subtaskId);
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

// --- Comments ---
const addComment = async (req, res) => {
  try {
    const task = await taskService.addComment(req.params.id, req.user._id, req.body.text);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const task = await taskService.deleteComment(req.params.id, req.user._id, req.params.commentId);
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(error.statusCode || (error.message.includes('authorized') ? 403 : 400)).json({
      success: false,
      message: error.message
    });
  }
};

// --- Attachments ---
const addAttachment = async (req, res) => {
  try {
    const { name, url } = req.body;
    const task = await taskService.addAttachment(req.params.id, req.user._id, name, url);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

const deleteAttachment = async (req, res) => {
  try {
    const task = await taskService.deleteAttachment(req.params.id, req.user._id, req.params.attachmentId);
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
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
