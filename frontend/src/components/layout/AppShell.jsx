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
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                activePage={activePage}
                setActivePage={handlePageChange}
            />

            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Navbar */}
                <header className="flex h-14 flex-shrink-0 items-center justify-between border-b bg-white px-6">
                    <h2 className="text-sm font-semibold capitalize text-gray-600">
                        {activePage.replace(/-/g, " ")}
                    </h2>
                    <div className="flex items-center gap-3">
                        <NotificationBell />
                        {/* User Avatar */}
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
                                {initials}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{user?.fullName || "User"}</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
