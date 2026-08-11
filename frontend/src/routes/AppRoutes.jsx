import { Routes, Route, Navigate } from "react-router-dom";
import TaskList from "../pages/tasks/TaskList";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import TeamList from "../pages/team/TeamList";
import CreateTeam from "../pages/team/CreateTeam";
import TeamDetails from "../pages/team/TeamDetails";
import EditTeam from "../pages/team/EditTeam";
import AppShell from "../components/layout/AppShell";

function AppRoutes() {
    return (
        <Routes>

            <Route path="/" element={<Login />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route
                path="/teams"
                element={
                    <AppShell activePage="teams">
                        <TeamList />
                    </AppShell>
                }
            />

            <Route
                path="/teams/new"
                element={
                    <AppShell activePage="teams">
                        <CreateTeam />
                    </AppShell>
                }
            />

            <Route
                path="/teams/:id"
                element={
                    <AppShell activePage="teams">
                        <TeamDetails />
                    </AppShell>
                }
            />

            <Route
                path="/teams/:id/edit"
                element={
                    <AppShell activePage="teams">
                        <EditTeam />
                    </AppShell>
                }
            />

            <Route
                path="/tasks"
                element={
                    <AppShell activePage="tasks">
                        <TaskList />
                    </AppShell>
                }
            />
    
            <Route path="*" element={<Navigate to="/" />} />

        </Routes>
    );
}

export default AppRoutes;
