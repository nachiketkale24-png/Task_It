import { useEffect, useState } from "react";
import { FiPlus, FiSearch, FiCalendar, FiCheckSquare, FiAlertCircle } from "react-icons/fi";
import { getTasks, createTask, updateTask, deleteTask, getUsers } from "../../services/taskService";
import TaskFormModal from "../../components/tasks/TaskFormModal";
import TaskDetailsModal from "../../components/tasks/TaskDetailsModal";

export default function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [statusTab, setStatusTab] = useState("Pending");
    const [searchQuery, setSearchQuery] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("All");

    // Modal control states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [activeTaskId, setActiveTaskId] = useState(null);

    const loadData = async () => {
        try {
            setLoading(true);
            const taskRes = await getTasks();
            const userRes = await getUsers();
            setTasks(taskRes.data);
            setUsers(userRes.data);
        } catch (err) {
            console.error("Failed to load task dashboard.", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreateOrUpdate = async (formData) => {
        if (selectedTask) {
            await updateTask(selectedTask._id, formData);
        } else {
            await createTask(formData);
        }
        await loadData();
    };

    const handleDeleteTask = async (id) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            await deleteTask(id);
            setIsDetailsOpen(false);
            await loadData();
        } catch {
            alert("Failed to delete task.");
        }
    };

    // Filter Tasks
    const filteredTasks = tasks.filter((t) => {
        const matchesStatus = t.status === statusTab;
        const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;
        const matchesSearch = 
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesPriority && matchesSearch;
    });

    return (
        <div className="app-page">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Workspace Tasks</h1>
                        <p className="page-description">Create, assign, track checklist items, and discuss tasks.</p>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedTask(null);
                            setIsFormOpen(true);
                        }}
                        className="ui-button ui-button-primary"
                    >
                        <FiPlus />
                        Add New Task
                    </button>
                </div>

                {/* Filters Row */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    {/* Status Tabs */}
                    <div className="flex gap-1 rounded-md border border-[var(--border-color)] bg-[var(--surface-card)] p-1">
                        {["Pending", "In Progress", "Completed"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setStatusTab(tab)}
                                className={`rounded-md px-4 py-2 text-sm font-medium transition
                                ${
                                    statusTab === tab
                                        ? "bg-[var(--accent)] text-[var(--accent-contrast)]"
                                        : "text-[var(--subtitle-color)] hover:bg-[var(--hover-bg)]"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Search & Priority Selector */}
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-color)]" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-md border border-[var(--border-color)] bg-[var(--surface-card)] px-10 py-3 text-sm outline-none focus:border-[var(--title-color)] focus:ring-2 focus:ring-gray-200"
                            />
                        </div>
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="rounded-md border border-[var(--border-color)] bg-[var(--surface-card)] px-4 py-3 text-sm outline-none focus:border-[var(--title-color)] focus:ring-2 focus:ring-gray-200"
                        >
                            <option value="All">All Priorities</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="mt-12 text-center text-[var(--subtitle-color)] font-medium">Loading Tasks...</div>
                ) : (
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredTasks.map((t) => {
                            const completedCount = t.subtasks?.filter((s) => s.isCompleted).length || 0;
                            const totalCount = t.subtasks?.length || 0;
                            const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                            return (
                                <div
                                    key={t._id}
                                    className="ui-card ui-card-hover group relative flex cursor-pointer flex-col justify-between p-5"
                                    onClick={() => {
                                        setActiveTaskId(t._id);
                                        setIsDetailsOpen(true);
                                    }}
                                >
                                    <div>
                                        {/* Badges */}
                                        <div className="flex items-center justify-between">
                                            <span className={`ui-badge uppercase
                                                ${
                                                    t.priority === "Critical" ? "badge-danger" :
                                                    t.priority === "High" ? "badge-warning" :
                                                    t.priority === "Medium" ? "badge-info" : "badge-neutral"
                                                }`}
                                            >
                                                {t.priority}
                                            </span>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedTask(t);
                                                    setIsFormOpen(true);
                                                }}
                                                className="text-xs text-[var(--muted-color)] hover:text-[var(--title-color)] opacity-0 group-hover:opacity-100 transition"
                                            >
                                                Edit
                                            </button>
                                        </div>

                                        {/* Title */}
                                        <h3 className="mt-3 line-clamp-1 text-base font-semibold text-[var(--title-color)]">{t.title}</h3>
                                        <p className="mt-1 text-sm text-[var(--subtitle-color)] line-clamp-2">{t.description || "No description."}</p>
                                    </div>

                                    <div className="mt-6 border-t pt-4">
                                        {/* Subtasks Progress */}
                                        {totalCount > 0 && (
                                            <div className="mb-4">
                                                <div className="flex justify-between text-xs text-[var(--subtitle-color)] mb-1">
                                                    <span className="flex items-center gap-1">
                                                        <FiCheckSquare /> Checklist
                                                    </span>
                                                    <span>{completedCount}/{totalCount} ({progressPercent}%)</span>
                                                </div>
                                                <div className="h-1.5 w-full rounded-full bg-[var(--hover-bg)] overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
                                                        style={{ width: `${progressPercent}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Date and Assignee */}
                                        <div className="flex items-center justify-between text-xs text-[var(--subtitle-color)]">
                                            <span className="flex items-center gap-1">
                                                <FiCalendar /> {t.deadline ? new Date(t.deadline).toLocaleDateString() : "No deadline"}
                                            </span>

                                            <span className="font-semibold text-[var(--title-color)] bg-[var(--hover-bg)] rounded-full px-2 py-0.5">
                                                {t.assignee?.fullName ? t.assignee.fullName.split(" ")[0] : "Unassigned"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredTasks.length === 0 && (
                            <div className="col-span-full mt-8 rounded-lg border border-dashed border-[var(--border-color)] py-16 text-center">
                                <FiAlertCircle className="mx-auto text-[var(--muted-color)]" size={32} />
                                <h3 className="mt-4 text-lg font-semibold text-[var(--title-color)]">No tasks found</h3>
                                <p className="mt-1 text-[var(--subtitle-color)]">Try changing status tabs or priority filters.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Modals */}
                <TaskFormModal
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleCreateOrUpdate}
                    task={selectedTask}
                    users={users}
                />

                <TaskDetailsModal
                    isOpen={isDetailsOpen}
                    onClose={() => setIsDetailsOpen(false)}
                    taskId={activeTaskId}
                    onTaskUpdated={loadData}
                    onDelete={handleDeleteTask}
                />
            </div>
        </div>
    );
}






