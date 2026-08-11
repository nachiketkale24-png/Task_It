import { useEffect, useState } from "react";
import { FiPlus, FiSearch, FiCalendar, FiCheckSquare, FiAlertCircle } from "react-icons/fi";
import { getTasks, createTask, updateTask, deleteTask, getUsers } from "../../services/taskService";
import TaskFormModal from "../../components/tasks/TaskFormModal";
import TaskDetailsModal from "../../components/tasks/TaskDetailsModal";

export default function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
            setError("Failed to load task dashboard.");
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
        } catch (err) {
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
        <div className="p-8">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Workspace Tasks</h1>
                        <p className="mt-1 text-gray-500">Create, assign, track checklist items, and discuss tasks.</p>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedTask(null);
                            setIsFormOpen(true);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800 transition active:scale-[0.98]"
                    >
                        <FiPlus />
                        Add New Task
                    </button>
                </div>

                {/* Filters Row */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    {/* Status Tabs */}
                    <div className="flex gap-1 border-b pb-1">
                        {["Pending", "In Progress", "Completed"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setStatusTab(tab)}
                                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition
                                ${
                                    statusTab === tab
                                        ? "bg-black text-white"
                                        : "text-gray-500 hover:bg-gray-100"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Search & Priority Selector */}
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 bg-white px-10 py-3 text-sm outline-none focus:border-black"
                            />
                        </div>
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
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
                    <div className="mt-12 text-center text-gray-500 font-medium">Loading Tasks...</div>
                ) : (
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredTasks.map((t) => {
                            const completedCount = t.subtasks?.filter((s) => s.isCompleted).length || 0;
                            const totalCount = t.subtasks?.length || 0;
                            const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                            return (
                                <div
                                    key={t._id}
                                    className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition cursor-pointer"
                                    onClick={() => {
                                        setActiveTaskId(t._id);
                                        setIsDetailsOpen(true);
                                    }}
                                >
                                    <div>
                                        {/* Badges */}
                                        <div className="flex items-center justify-between">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase
                                                ${
                                                    t.priority === "Critical" ? "bg-red-50 text-red-600" :
                                                    t.priority === "High" ? "bg-orange-50 text-orange-600" :
                                                    t.priority === "Medium" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-600"
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
                                                className="text-xs text-gray-400 hover:text-black opacity-0 group-hover:opacity-100 transition"
                                            >
                                                Edit
                                            </button>
                                        </div>

                                        {/* Title */}
                                        <h3 className="mt-3 text-lg font-bold text-gray-900 line-clamp-1">{t.title}</h3>
                                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{t.description || "No description."}</p>
                                    </div>

                                    <div className="mt-6 border-t pt-4">
                                        {/* Subtasks Progress */}
                                        {totalCount > 0 && (
                                            <div className="mb-4">
                                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                    <span className="flex items-center gap-1">
                                                        <FiCheckSquare /> Checklist
                                                    </span>
                                                    <span>{completedCount}/{totalCount} ({progressPercent}%)</span>
                                                </div>
                                                <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                                                    <div
                                                        className="h-full bg-black rounded-full transition-all duration-300"
                                                        style={{ width: `${progressPercent}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Date and Assignee */}
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <FiCalendar /> {t.deadline ? new Date(t.deadline).toLocaleDateString() : "No deadline"}
                                            </span>

                                            <span className="font-semibold text-gray-800 bg-gray-100 rounded-full px-2 py-0.5">
                                                {t.assignee?.fullName ? t.assignee.fullName.split(" ")[0] : "Unassigned"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredTasks.length === 0 && (
                            <div className="col-span-full mt-8 rounded-2xl border border-dashed border-gray-300 py-16 text-center">
                                <FiAlertCircle className="mx-auto text-gray-400" size={32} />
                                <h3 className="mt-4 text-lg font-semibold text-gray-900">No tasks found</h3>
                                <p className="mt-1 text-gray-500">Try changing status tabs or priority filters.</p>
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
