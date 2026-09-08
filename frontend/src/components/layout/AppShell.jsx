import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import NotificationBell from "../notifications/NotificationBell";

export default function AppShell({
    activePage = "dashboard",
    children,
}) {
    const navigate = useNavigate();

    const handlePageChange = (page) => {
        const routes = {
            dashboard: "/dashboard",
            teams: "/teams",
            projects: "/projects",
            tasks: "/tasks",
            reports: "/reports",
            documents: "/documents",
            users: "/users",
            github: "/github",
            settings: "/settings",
        };
        navigate(routes[page] || "/dashboard");
    };

    // Get user info from localStorage
    const user = (() => {
        try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
    })();
    const initials = user?.fullName
        ? user.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";

    return (
        <div className="flex h-screen bg-[var(--main-bg)] dark:bg-zinc-950 text-[var(--title-color)] dark:text-zinc-50 transition-colors duration-200">
            <Sidebar
                activePage={activePage}
                setActivePage={handlePageChange}
            />

            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Navbar */}
                <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-[var(--border-color)] dark:border-zinc-800 bg-[var(--sidebar-bg)] dark:bg-zinc-950 px-6 transition-colors duration-200">
                    <h2 className="text-sm font-semibold capitalize text-[var(--title-color)] dark:text-zinc-50">
                        {activePage.replace(/-/g, " ")}
                    </h2>
                    <div className="flex items-center gap-3">
                        <NotificationBell />
                        {/* User Avatar */}
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
                                {initials}
                            </div>
                            <span className="text-sm font-medium text-[var(--title-color)] dark:text-zinc-50">{user?.fullName || "User"}</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-[var(--main-bg)] dark:bg-zinc-950 transition-colors duration-200">
                    {children}
                </main>
            </div>
        </div>
    );
}
