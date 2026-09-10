import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import Sidebar from "./Sidebar";
import NotificationBell from "../notifications/NotificationBell";

export default function AppShell({
    activePage = "dashboard",
    children,
}) {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

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

    useEffect(() => {
        const stored = localStorage.getItem("theme");
        const shouldUseDark = stored === "dark" || document.documentElement.classList.contains("dark");
        setIsDarkMode(shouldUseDark);
        document.documentElement.classList.toggle("dark", shouldUseDark);
    }, []);

    const toggleTheme = () => {
        const next = !isDarkMode;
        setIsDarkMode(next);
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
    };

    const pageTitle = activePage.replace(/-/g, " ");

    return (
        <div className="flex h-screen bg-[var(--main-bg)] text-[var(--title-color)] transition-colors duration-200">
            {sidebarOpen && (
                <button
                    aria-label="Close sidebar"
                    className="fixed inset-0 z-30 bg-black/30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <Sidebar
                activePage={activePage}
                setActivePage={(page) => {
                    handlePageChange(page);
                    setSidebarOpen(false);
                }}
                isOpen={sidebarOpen}
            />

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-[var(--border-color)] bg-[var(--surface-card)] px-4 transition-colors duration-200 sm:px-6">
                    <div className="flex items-center gap-3">
                        <button
                            className="ui-icon-button lg:hidden"
                            onClick={() => setSidebarOpen((open) => !open)}
                            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                        >
                            {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
                        </button>
                        <h2 className="text-sm font-medium capitalize text-[var(--subtitle-color)]">
                            {pageTitle}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <NotificationBell />
                        <button
                            className="ui-icon-button"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            title={isDarkMode ? "Use light mode" : "Use dark mode"}
                        >
                            {isDarkMode ? <FiSun size={17} /> : <FiMoon size={17} />}
                        </button>
                        <div className="flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-[var(--hover-bg)]">
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--icon-bg)] text-xs font-semibold text-[var(--icon-contrast)]">
                                {initials}
                            </div>
                            <span className="hidden text-sm font-medium text-[var(--title-color)] sm:inline">{user?.fullName || "User"}</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-[var(--main-bg)] transition-colors duration-200">
                    {children}
                </main>
            </div>
        </div>
    );
}






