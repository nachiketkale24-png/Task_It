import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";

export default function AppShell({
    activePage = "dashboard",
    children,
}) {
    const navigate = useNavigate();

    const handlePageChange = (page) => {
        if (page === "dashboard") {
            navigate("/dashboard");
            return;
        }

        if (page === "teams") {
            navigate("/teams");
            return;
        }

        navigate("/dashboard");
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                activePage={activePage}
                setActivePage={handlePageChange}
            />

            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
