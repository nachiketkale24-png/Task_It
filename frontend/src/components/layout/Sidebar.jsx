import {
    FiGrid,
    FiUsers,
    FiCheckSquare,
    FiFolder,
    FiCalendar,
    FiSettings,
    FiLogOut,
} from "react-icons/fi";

const menu = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: FiGrid,
    },
    {
        id: "teams",
        label: "Teams",
        icon: FiUsers,
    },
    {
        id: "tasks",
        label: "Tasks",
        icon: FiCheckSquare,
    },
    {
        id: "projects",
        label: "Projects",
        icon: FiFolder,
    },
    {
        id: "calendar",
        label: "Calendar",
        icon: FiCalendar,
    },
    {
        id: "settings",
        label: "Settings",
        icon: FiSettings,
    },
];

export default function Sidebar({
    activePage,
    setActivePage,
}) {
    return (
        <aside className="flex w-64 flex-col border-r bg-white">

            <div className="border-b p-6">

                <h1 className="text-2xl font-bold">
                    Task It
                </h1>

                <p className="text-sm text-gray-500">
                    Team Workspace
                </p>

            </div>

            <nav className="flex-1 p-4">

                {menu.map((item) => {

                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() =>
                                setActivePage(item.id)
                            }
                            className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 transition
                            ${
                                activePage === item.id
                                    ? "bg-black text-white"
                                    : "hover:bg-gray-100"
                            }`}
                        >
                            <Icon size={18} />

                            {item.label}

                        </button>
                    );

                })}

            </nav>

            <div className="border-t p-4">

                <button
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 hover:bg-red-50 hover:text-red-500"
                >
                    <FiLogOut />

                    Logout

                </button>

            </div>

        </aside>
    );
}