import { format } from "date-fns";
import { FiAlertCircle, FiCalendar } from "react-icons/fi";

export default function OverdueTasksWidget({ overdue, upcoming }) {
    return (
        <div className="ui-card flex h-full flex-col overflow-hidden">
            <div className="border-b border-[var(--border-color)] p-5">
                <div className="mb-4 flex items-center gap-2">
                    <FiAlertCircle className="text-red-500" />
                    <h3 className="text-lg font-semibold text-[var(--title-color)]">Overdue Tasks</h3>
                </div>

                {!overdue || overdue.length === 0 ? (
                    <p className="text-sm text-[var(--subtitle-color)]">No overdue tasks.</p>
                ) : (
                    <div className="space-y-3">
                        {overdue.map((task) => (
                            <div key={task._id} className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/20">
                                <div>
                                    <p className="max-w-[200px] truncate text-sm font-medium text-[var(--title-color)]">{task.title}</p>
                                    <p className="text-xs font-medium text-red-600 dark:text-red-300">
                                        Due: {format(new Date(task.deadline), "MMM d, yyyy")}
                                    </p>
                                </div>
                                <span className="ui-badge badge-danger">Overdue</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-5">
                <div className="mb-4 flex items-center gap-2">
                    <FiCalendar className="text-[var(--title-color)]" />
                    <h3 className="text-lg font-semibold text-[var(--title-color)]">Upcoming Deadlines (7 Days)</h3>
                </div>

                {!upcoming || upcoming.length === 0 ? (
                    <p className="text-sm text-[var(--subtitle-color)]">No immediate deadlines.</p>
                ) : (
                    <div className="space-y-3">
                        {upcoming.map((task) => (
                            <div key={task._id} className="flex items-center justify-between rounded-lg border border-[var(--border-color)] bg-[var(--surface-muted)] p-3">
                                <div>
                                    <p className="max-w-[200px] truncate text-sm font-medium text-[var(--title-color)]">{task.title}</p>
                                    <p className="text-xs text-[var(--subtitle-color)]">
                                        Due: {format(new Date(task.deadline), "MMM d, yyyy")}
                                    </p>
                                </div>
                                <span className={`ui-badge ${task.priority === "High" || task.priority === "Critical" ? "badge-warning" : "badge-neutral"}`}>
                                    {task.priority}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}







