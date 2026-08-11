import { useEffect, useState } from "react";
import { FiX, FiCheckSquare, FiPlus, FiTrash2, FiPaperclip, FiMessageSquare } from "react-icons/fi";
import {
    getTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    addComment,
    deleteComment,
    addAttachment,
    deleteAttachment
} from "../../services/taskService";

export default function TaskDetailsModal({ isOpen, onClose, taskId, onTaskUpdated, onDelete }) {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newSubtask, setNewSubtask] = useState("");
    const [commentText, setCommentText] = useState("");
    const [attachment, setAttachment] = useState({ name: "", url: "" });
    const [error, setError] = useState("");

    const fetchFullDetails = async () => {
        try {
            setLoading(true);
            const data = await getTask(taskId);
            setTask(data.data);
        } catch (err) {
            setError("Failed to fetch task details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && taskId) {
            fetchFullDetails();
        }
    }, [isOpen, taskId]);

    if (!isOpen) return null;

    const handleAddSubtask = async (e) => {
        e.preventDefault();
        if (!newSubtask.trim()) return;
        try {
            const res = await addSubtask(taskId, newSubtask.trim());
            setTask(res.data);
            setNewSubtask("");
            onTaskUpdated();
        } catch (err) {
            setError("Failed to add subtask.");
        }
    };

    const handleToggleSubtask = async (subtaskId, isCompleted) => {
        try {
            const res = await toggleSubtask(taskId, subtaskId, isCompleted);
            setTask(res.data);
            onTaskUpdated();
        } catch (err) {
            setError("Failed to toggle subtask.");
        }
    };

    const handleDeleteSubtask = async (subtaskId) => {
        try {
            const res = await deleteSubtask(taskId, subtaskId);
            setTask(res.data);
            onTaskUpdated();
        } catch (err) {
            setError("Failed to delete subtask.");
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        try {
            const res = await addComment(taskId, commentText.trim());
            setTask(res.data);
            setCommentText("");
            onTaskUpdated();
        } catch (err) {
            setError("Failed to add comment.");
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const res = await deleteComment(taskId, commentId);
            setTask(res.data);
            onTaskUpdated();
        } catch (err) {
            setError("Failed to delete comment.");
        }
    };

    const handleAddAttachment = async (e) => {
        e.preventDefault();
        if (!attachment.name.trim() || !attachment.url.trim()) return;
        try {
            const res = await addAttachment(taskId, attachment.name.trim(), attachment.url.trim());
            setTask(res.data);
            setAttachment({ name: "", url: "" });
            onTaskUpdated();
        } catch (err) {
            setError("Failed to add attachment.");
        }
    };

    const handleDeleteAttachment = async (attachmentId) => {
        try {
            const res = await deleteAttachment(taskId, attachmentId);
            setTask(res.data);
            onTaskUpdated();
        } catch (err) {
            setError("Failed to delete attachment.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/45 backdrop-blur-sm">
            <div className="h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col border-l border-gray-100">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-6">
                    <div>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase text-gray-600">
                            Task Details
                        </span>
                        <h2 className="mt-2 text-2xl font-bold text-gray-900">
                            {loading ? "Loading..." : task?.title}
                        </h2>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-black">
                        <FiX size={22} />
                    </button>
                </div>

                {loading ? (
                    <div className="flex-1 p-6 text-gray-500">Loading task details...</div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Meta Grid */}
                        <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 border text-sm text-gray-700">
                            <div>
                                <span className="font-semibold text-gray-500 block">Status</span>
                                <span className={`inline-block mt-1 font-semibold ${
                                    task?.status === "Completed" ? "text-green-600" :
                                    task?.status === "In Progress" ? "text-blue-600" : "text-amber-600"
                                }`}>
                                    {task?.status}
                                </span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-500 block">Priority</span>
                                <span className={`inline-block mt-1 font-semibold ${
                                    task?.priority === "Critical" ? "text-red-600" :
                                    task?.priority === "High" ? "text-orange-600" :
                                    task?.priority === "Medium" ? "text-blue-600" : "text-gray-600"
                                }`}>
                                    {task?.priority}
                                </span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-500 block">Assignee</span>
                                <span className="inline-block mt-1 font-medium text-gray-900">
                                    {task?.assignee?.fullName || "Unassigned"}
                                </span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-500 block">Deadline</span>
                                <span className="inline-block mt-1 font-medium text-gray-900">
                                    {task?.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="font-semibold text-gray-900">Description</h3>
                            <p className="mt-2 text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border">
                                {task?.description || "No description provided."}
                            </p>
                        </div>

                        {/* Subtasks (Checklist) */}
                        <div>
                            <div className="flex items-center gap-2 font-semibold text-gray-900">
                                <FiCheckSquare />
                                <h3>Subtasks Checklist</h3>
                            </div>
                            <form onSubmit={handleAddSubtask} className="mt-3 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add subtask..."
                                    value={newSubtask}
                                    onChange={(e) => setNewSubtask(e.target.value)}
                                    className="flex-1 rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-black"
                                />
                                <button type="submit" className="rounded-xl bg-black px-4 text-white hover:bg-gray-800">
                                    <FiPlus />
                                </button>
                            </form>
                            <div className="mt-4 space-y-2">
                                {task?.subtasks?.map((sub) => (
                                    <div key={sub._id} className="flex items-center justify-between rounded-xl border p-3 hover:bg-gray-50">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={sub.isCompleted}
                                                onChange={(e) => handleToggleSubtask(sub._id, e.target.checked)}
                                                className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                                            />
                                            <span className={sub.isCompleted ? "line-through text-gray-400" : "text-gray-700"}>
                                                {sub.title}
                                            </span>
                                        </label>
                                        <button onClick={() => handleDeleteSubtask(sub._id)} className="text-red-500 hover:text-red-700">
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Attachments */}
                        <div>
                            <div className="flex items-center gap-2 font-semibold text-gray-900">
                                <FiPaperclip />
                                <h3>Attachments (Links)</h3>
                            </div>
                            <form onSubmit={handleAddAttachment} className="mt-3 grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    placeholder="Link name (e.g. Figma)"
                                    value={attachment.name}
                                    onChange={(e) => setAttachment({ ...attachment, name: e.target.value })}
                                    className="rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-black"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="URL (https://...)"
                                        value={attachment.url}
                                        onChange={(e) => setAttachment({ ...attachment, url: e.target.value })}
                                        className="flex-1 rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-black"
                                    />
                                    <button type="submit" className="rounded-xl bg-black px-4 text-white hover:bg-gray-800">
                                        <FiPlus />
                                    </button>
                                </div>
                            </form>
                            <div className="mt-4 space-y-2">
                                {task?.attachments?.map((att) => (
                                    <div key={att._id} className="flex items-center justify-between rounded-xl border p-3 hover:bg-gray-50">
                                        <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {att.name}
                                        </a>
                                        <button onClick={() => handleDeleteAttachment(att._id)} className="text-red-500 hover:text-red-700">
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Comments */}
                        <div>
                            <div className="flex items-center gap-2 font-semibold text-gray-900">
                                <FiMessageSquare />
                                <h3>Discussion Comments</h3>
                            </div>
                            <form onSubmit={handleAddComment} className="mt-3 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ask a question or post update..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    className="flex-1 rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-black"
                                />
                                <button type="submit" className="rounded-xl bg-black px-6 text-white hover:bg-gray-800">
                                    Comment
                                </button>
                            </form>
                            <div className="mt-6 space-y-4">
                                {task?.comments?.map((com) => (
                                    <div key={com._id} className="rounded-xl border p-4 bg-gray-50/50">
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span className="font-semibold text-gray-700">{com.user?.fullName}</span>
                                            <div className="flex items-center gap-3">
                                                <span>{new Date(com.createdAt).toLocaleString()}</span>
                                                <button onClick={() => handleDeleteComment(com._id)} className="text-red-500 hover:text-red-700">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-700">{com.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="border-t p-6 bg-gray-50 flex justify-between gap-3">
                    <button
                        onClick={() => onDelete(task?._id)}
                        className="rounded-xl bg-red-500 px-5 py-3 text-white hover:bg-red-600 transition font-medium"
                    >
                        Delete Task
                    </button>
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-gray-300 px-5 py-3 bg-white hover:bg-gray-50 transition"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
}
