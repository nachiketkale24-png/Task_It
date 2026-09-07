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

function AppRoutes() {
  return (
    <Routes>
    <Route path="/" element={<Login />} />

    <Route path="/login" element={<Login />} />

    <Route path="/register" element={<Register />} />

    <Route
        path="/dashboard"
        element={
        <AppShell activePage="dashboard">
            <Dashboard />
        </AppShell>
        }
    />

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
        path="/projects"
        element={
        <AppShell activePage="projects">
            <ProjectsPage />
        </AppShell>
        }
    />

    <Route
        path="/projects/:id"
        element={
        <AppShell activePage="projects">
            <ProjectDetails />
        </AppShell>
        }
    />

    <Route path="*" element={<Navigate to="/" />} />
</Routes>
  );
}

export default AppRoutes;