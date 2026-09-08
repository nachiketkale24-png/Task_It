import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import AppShell from "../components/layout/AppShell";

import TeamList from "../pages/team/TeamList";
import CreateTeam from "../pages/team/CreateTeam";
import TeamDetails from "../pages/team/TeamDetails";
import EditTeam from "../pages/team/EditTeam";

import ProjectsPage from "../pages/projects/ProjectsPage";
import ProjectDetails from "../pages/projects/ProjectDetails";

import TaskList from "../pages/tasks/TaskList";
import Reports from "../pages/reports/Reports";
import DocumentsPage from "../pages/documents/DocumentsPage";
import UsersPage from "../pages/users/UsersPage";
import SettingsPage from "../pages/settings/SettingsPage";
import GitHubPage from "../pages/github/GitHubPage";

function AppRoutes() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<AppShell activePage="dashboard"><Dashboard /></AppShell>} />

            {/* Teams */}
            <Route path="/teams"          element={<AppShell activePage="teams"><TeamList /></AppShell>} />
            <Route path="/teams/new"      element={<AppShell activePage="teams"><CreateTeam /></AppShell>} />
            <Route path="/teams/:id"      element={<AppShell activePage="teams"><TeamDetails /></AppShell>} />
            <Route path="/teams/:id/edit" element={<AppShell activePage="teams"><EditTeam /></AppShell>} />

            {/* Projects */}
            <Route path="/projects"     element={<AppShell activePage="projects"><ProjectsPage /></AppShell>} />
            <Route path="/projects/:id" element={<AppShell activePage="projects"><ProjectDetails /></AppShell>} />

            {/* Tasks */}
            <Route path="/tasks" element={<AppShell activePage="tasks"><TaskList /></AppShell>} />

            {/* Reports */}
            <Route path="/reports" element={<AppShell activePage="reports"><Reports /></AppShell>} />

            {/* Documents */}
            <Route path="/documents" element={<AppShell activePage="documents"><DocumentsPage /></AppShell>} />

            {/* Users */}
            <Route path="/users" element={<AppShell activePage="users"><UsersPage /></AppShell>} />

            {/* Settings */}
            <Route path="/settings" element={<AppShell activePage="settings"><SettingsPage /></AppShell>} />

            {/* GitHub */}
            <Route path="/github" element={<AppShell activePage="github"><GitHubPage /></AppShell>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default AppRoutes;