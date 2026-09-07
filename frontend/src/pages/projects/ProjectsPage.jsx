import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../services/projectService";

const ProjectsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    status: "Active",
    priority: "Medium",
    startDate: "",
    deadline: "",
    technologies: "",
    githubRepo: "",
    deploymentLink: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!location.state?.editProjectId || projects.length === 0) {
      return;
    }

    const project = projects.find(
      (p) => p._id === location.state.editProjectId
    );

    if (project) {
      openEditModal(project);
    }

    // Clear navigation state so refreshing doesn't reopen the modal
    navigate("/projects", { replace: true, state: {} });
  }, [location.state, projects]);

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      technologies: formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await updateProject(editingId, payload);
      } else {
        await createProject(payload);
      }

      setShowModal(false);
      setEditingId(null);

      setFormData({
        projectName: "",
        description: "",
        status: "Active",
        priority: "Medium",
        startDate: "",
        deadline: "",
        technologies: "",
        githubRepo: "",
        deploymentLink: "",
      });

      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);

    setFormData({
      projectName: "",
      description: "",
      status: "Active",
      priority: "Medium",
      startDate: "",
      deadline: "",
      technologies: "",
      githubRepo: "",
      deploymentLink: "",
    });

    setShowModal(true);
  };

  const openEditModal = (project) => {
    setEditingId(project._id);

    setFormData({
      projectName: project.projectName || "",
      description: project.description || "",
      status: project.status || "Active",
      priority: project.priority || "Medium",
      startDate: project.startDate?.slice(0, 10) || "",
      deadline: project.deadline?.slice(0, 10) || "",
      technologies: project.technologies?.join(", ") || "",
      githubRepo: project.githubRepo || "",
      deploymentLink: project.deploymentLink || "",
    });

    setShowModal(true);
  };

  if (loading) {
    return <div className="p-8">Loading projects...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-500 mt-1">
            Manage your startup projects and deployments
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition"
        >
          + New Project
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project._id}
            className="border border-gray-200 rounded-3xl p-6 shadow-sm bg-white hover:shadow-md transition h-fit"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {project.projectName}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {project.priority} priority
                </p>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                {project.status}
              </span>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-3">
              {project.description}
            </p>

            {project.technologies?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="space-y-1 text-sm text-gray-500 mb-4">
              <p>
                <span className="font-medium">Start:</span>{' '}
                {project.startDate?.slice(0, 10) || "Not set"}
              </p>
              <p>
                <span className="font-medium">Deadline:</span>{' '}
                {project.deadline?.slice(0, 10) || "Not set"}
              </p>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              {project.githubRepo && (
                <a
                  href={project.githubRepo}
                  target="_blank"
                  rel="noreferrer"
                  className="border px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
                >
                  GitHub
                </a>
              )}

              {project.deploymentLink && (
                <a
                  href={project.deploymentLink}
                  target="_blank"
                  rel="noreferrer"
                  className="border px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
                >
                  Live
                </a>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                className="border px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
                onClick={() => navigate(`/projects/${project._id}`)}
              >
                View
              </button>

              <button
                onClick={() => openEditModal(project)}
                className="border px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(project._id)}
                className="border border-red-300 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? "Edit Project" : "Create Project"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Project name"
                value={formData.projectName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    projectName: e.target.value,
                  })
                }
                className="w-full border rounded-xl px-4 py-3"
                required
              />

              <textarea
                placeholder="Project description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="w-full border rounded-xl px-4 py-3"
                rows={4}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      startDate: e.target.value,
                    })
                  }
                  className="border rounded-xl px-4 py-3"
                />

                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deadline: e.target.value,
                    })
                  }
                  className="border rounded-xl px-4 py-3"
                />
              </div>

              <input
                type="text"
                placeholder="React, Node, MongoDB"
                value={formData.technologies}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    technologies: e.target.value,
                  })
                }
                className="w-full border rounded-xl px-4 py-3"
              />

              <input
                type="url"
                placeholder="GitHub repository URL"
                value={formData.githubRepo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    githubRepo: e.target.value,
                  })
                }
                className="w-full border rounded-xl px-4 py-3"
              />

              <input
                type="url"
                placeholder="Live deployment URL"
                value={formData.deploymentLink}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deploymentLink: e.target.value,
                  })
                }
                className="w-full border rounded-xl px-4 py-3"
              />

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value,
                    })
                  }
                  className="border rounded-xl px-4 py-3"
                >
                  <option>Active</option>
                  <option>Planning</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                </select>

                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value,
                    })
                  }
                  className="border rounded-xl px-4 py-3"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                  }}
                  className="border px-5 py-3 rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;