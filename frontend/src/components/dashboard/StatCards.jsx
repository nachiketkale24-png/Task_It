import { FiBriefcase, FiCheckSquare, FiUsers } from 'react-icons/fi';

export default function StatCards({ stats }) {
    if (!stats) return null;

    const cards = [
        {
            title: "Projects",
            value: stats.projects,
            icon: FiBriefcase,
        },
        {
            title: "Tasks",
            value: stats.tasks,
            icon: FiCheckSquare,
        },
        {
            title: "Teams",
            value: stats.teams,
            icon: FiUsers,
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-3">
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







