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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10">
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
                    {error}
                </div>
            </div>
        );
    }

    if (!dashboardData) return null;

    return (
        <div className="p-8 max-w-7xl mx-auto">

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Dashboard Overview
                </h1>
                <p className="mt-2 text-gray-500">
                    Here's what's happening in your workspace today.
                </p>
            </div>

            {/* Top Stats Row */}
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