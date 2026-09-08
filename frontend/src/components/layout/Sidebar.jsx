import { useNavigate } from "react-router-dom";
import {
    FiGrid,
    FiUsers,
    FiCheckSquare,
    FiFolder,
    FiBarChart2,
    FiFile,
    FiUserCheck,
    FiLogOut,
    FiSettings,
    FiGithub,
} from "react-icons/fi";

const menu = [
    { id: "dashboard",  label: "Dashboard",  icon: FiGrid },
    { id: "projects",   label: "Projects",   icon: FiFolder },
    { id: "teams",      label: "Teams",      icon: FiUsers },
    { id: "tasks",      label: "Tasks",      icon: FiCheckSquare },
    { id: "documents",  label: "Documents",  icon: FiFile },
    { id: "reports",    label: "Reports",    icon: FiBarChart2 },
    { id: "users",      label: "Users",      icon: FiUserCheck },
    { id: "github",     label: "GitHub",     icon: FiGithub },
    { id: "settings",   label: "Settings",   icon: FiSettings },
];

export default function Sidebar({ activePage, setActivePage }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <aside className="flex w-64 flex-shrink-0 flex-col border-r border-[var(--border-color)] dark:border-zinc-800 bg-[var(--sidebar-bg)] dark:bg-zinc-950 transition-colors duration-200">
            {/* Logo */}
            <div className="border-b border-[var(--border-color)] dark:border-zinc-800 p-6">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600">
                        <span className="text-sm font-bold text-white">T</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-[var(--title-color)] dark:text-zinc-50">Task It</h1>
                        <p className="text-xs text-[var(--subtitle-color)] dark:text-zinc-400">Team Workspace</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto p-3">
                {menu.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                        <button
                            key={item.id}
                            id={`nav-${item.id}`}
                            onClick={() => setActivePage(item.id)}
                            className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition
                                ${isActive
                                    ? "bg-violet-600 text-white shadow-sm dark:bg-zinc-800 dark:text-white"
                                    : "text-[var(--nav-inactive)] dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-900 hover:text-[var(--title-color)] dark:hover:text-zinc-50"
                                }`}
                        >
                            <Icon size={17} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="border-t border-[var(--border-color)] dark:border-zinc-800 p-3">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--nav-inactive)] dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-zinc-900 hover:text-red-500 dark:hover:text-red-400 transition"
                >
                    <FiLogOut size={17} />
                    Logout
                </button>
            </div>
        </aside>
    );
}