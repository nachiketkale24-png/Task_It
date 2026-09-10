import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import Input from "../common/Input";

export default function TaskFormModal({ isOpen, onClose, onSubmit, task, users }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "Medium",
        status: "Pending",
        deadline: "",
        assignee: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || "",
                description: task.description || "",
                priority: task.priority || "Medium",
                status: task.status || "Pending",
                deadline: task.deadline ? task.deadline.substring(0, 10) : "",
                assignee: task.assignee?._id || task.assignee || "",
            });
        } else {
            setFormData({
                title: "",
                description: "",
                priority: "Medium",
                status: "Pending",
                deadline: "",
                assignee: "",
            });
        }
        setError("");
    }, [task, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            setError("Title is required");
            return;
        }

        try {
            setLoading(true);
            setError("");
            
            const submitData = { ...formData };
            if (submitData.assignee === "") {
                submitData.assignee = null;
            }

            await onSubmit(submitData);
            onClose();
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-lg bg-[var(--surface-card)] p-6  border border-[var(--border-color)]">
                <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-xl font-semibold text-[var(--title-color)]">
                        {task ? "Edit Task" : "Create New Task"}
                    </h2>
                    <button onClick={onClose} className="rounded-lg p-1 text-[var(--muted-color)] hover:bg-[var(--hover-bg)] hover:text-[var(--title-color)]">
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <Input
                        label="Task Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="What needs to be done?"
                    />

                    <div>
                        <label className="text-sm font-medium text-[var(--title-color)] block mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Add task details..."
                            rows="3"
                            className="w-full rounded-md border border-[var(--border-color)] bg-[var(--surface-card)] text-[var(--title-color)] placeholder:text-[var(--muted-color)] px-4 py-3 outline-none focus:border-[var(--title-color)] focus:ring-2 focus:ring-gray-200 focus:ring-2 focus:ring-gray-200 transition"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-[var(--title-color)] block mb-1">
                                Priority
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full rounded-md border border-[var(--border-color)] bg-[var(--surface-card)] text-[var(--title-color)] px-4 py-3 outline-none focus:border-[var(--title-color)] focus:ring-2 focus:ring-gray-200 transition"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-[var(--title-color)] block mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full rounded-md border border-[var(--border-color)] bg-[var(--surface-card)] text-[var(--title-color)] px-4 py-3 outline-none focus:border-[var(--title-color)] focus:ring-2 focus:ring-gray-200 transition"
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Deadline"
                            name="deadline"
                            type="date"
                            value={formData.deadline}
                            onChange={handleChange}
                        />

                        <div>
                            <label className="text-sm font-medium text-[var(--title-color)] block mb-1">
                                Assignee
                            </label>
                            <select
                                name="assignee"
                                value={formData.assignee}
                                onChange={handleChange}
                                className="w-full rounded-md border border-[var(--border-color)] bg-[var(--surface-card)] text-[var(--title-color)] px-4 py-3 outline-none focus:border-[var(--title-color)] focus:ring-2 focus:ring-gray-200 transition"
                            >
                                <option value="">Unassigned</option>
                                {users.map((u) => (
                                    <option key={u._id} value={u._id}>
                                        {u.fullName} ({u.role})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-[var(--border-color)] px-4 py-3 hover:bg-[var(--surface-muted)] transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-md bg-[var(--accent)] px-6 py-3 text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)] disabled:opacity-60 transition"
                        >
                            {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}






