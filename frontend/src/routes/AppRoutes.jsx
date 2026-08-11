import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";

import AppShell from "../components/layout/AppShell";

import TeamList from "../pages/teams/TeamList";
import CreateTeam from "../pages/teams/CreateTeam";
import TeamDetails from "../pages/teams/TeamDetails";
import EditTeam from "../pages/teams/EditTeam";

import ProjectsPage from "../pages/projects/ProjectsPage";

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
        path="/projects"
        element={
          <AppShell activePage="projects">
            <ProjectsPage />
          </AppShell>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;