import { FiAlertTriangle, FiBriefcase, FiCheckCircle, FiCheckSquare, FiClock, FiUsers } from 'react-icons/fi';

export default function StatCards({ stats }) {
    if (!stats) return null;

    const cards = [
        {
            title: "Projects",
            value: stats.projects,
            icon: FiBriefcase,
        },
        {
            title: "Active Projects",
            value: stats.activeProjects || 0,
            icon: FiClock,
        },
        {
            title: "Tasks",
            value: stats.tasks,
            icon: FiCheckSquare,
        },
        {
            title: "Completed",
            value: stats.completedTasks || 0,
            icon: FiCheckCircle,
        },
        {
            title: "Overdue",
            value: stats.overdueTasks || 0,
            icon: FiAlertTriangle,
        },
        {
            title: "Teams",
            value: stats.teams,
            icon: FiUsers,
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            {cards.map((card, index) => (
                <div key={index} className="ui-card flex items-center gap-4 p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border-color)] bg-[var(--surface-muted)] text-[var(--title-color)]">
                        <card.icon size={17} />
                    </div>
                    <div>
                        <h2 className="text-sm font-medium text-[var(--subtitle-color)]">{card.title}</h2>
                        <p className="mt-1 text-3xl font-semibold text-[var(--title-color)]">{card.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
