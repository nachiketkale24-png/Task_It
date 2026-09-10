import { useState, useEffect } from "react";
import { getDashboardStats } from "../../services/dashboardService";

import StatCards from "./StatCards";
import TaskStatusChart from "./TaskStatusChart";
import MemberWorkloadChart from "./MemberWorkloadChart";
import ActivityFeedWidget from "./ActivityFeedWidget";
import OverdueTasksWidget from "./OverdueTasksWidget";

export default function DashboardHome() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await getDashboardStats();
                setDashboardData(response.data);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full p-10">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border-color)] border-t-[var(--title-color)]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="app-page">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                    {error}
                </div>
            </div>
        );
    }

    if (!dashboardData) return null;

    return (
        <div className="app-page">

            <div className="page-header">
                <div>
                <h1 className="page-title">
                    Welcome Back 👋
                </h1>
                <p className="page-description">
                    Here's what's happening in your workspace today.
                </p>
                </div>
            </div>

            <div className="mb-8">
                <StatCards stats={dashboardData.totalStats} />
            </div>

            {/* Main Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2 mb-8">
                <TaskStatusChart data={dashboardData.taskStatus} />
                <MemberWorkloadChart data={dashboardData.memberWorkload} />
            </div>

            {/* Bottom Widgets Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                <ActivityFeedWidget activities={dashboardData.activityFeed} />
                <OverdueTasksWidget 
                    overdue={dashboardData.overdueTasks} 
                    upcoming={dashboardData.upcomingDeadlines} 
                />
            </div>

        </div>
    );
}






