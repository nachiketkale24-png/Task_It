import { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../services/projectService";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    status: "Active",
    priority: "Medium",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

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

    try {
      if (editingId) {
        await updateProject(editingId, formData);
      } else {
        await createProject(formData);
      }

      setShowModal(false);
      setEditingId(null);

      setFormData({
        projectName: "",
        description: "",
        status: "Active",
        priority: "Medium",
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

      // Update UI immediately
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
    });

    setShowModal(true);
  };

  const openEditModal = (project) => {
    setEditingId(project._id);

    setFormData({
      projectName: project.projectName,
      description: project.description,
      status: project.status,
      priority: project.priority,
    });

    setShowModal(true);
  };

  if (loading) {
    return <div className="p-6">Loading projects...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>

        <button
          onClick={openCreateModal}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          + New Project
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project._id}
            className="border rounded-2xl p-5 shadow-sm bg-white h-fit"
          >
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl font-semibold">
                {project.projectName}
              </h2>

              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                {project.status}
              </span>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">
              {project.description}
            </p>

            <div className="space-y-1 text-sm text-gray-500 mb-4">
              <p>Priority: {project.priority}</p>
              <p>
                Deadline: {project.deadline?.slice(0, 10) || "Not set"}
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button className="border px-3 py-2 rounded-lg text-sm">
                View
              </button>

              <button
                onClick={() => openEditModal(project)}
                className="border px-3 py-2 rounded-lg text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(project._id)}
                className="border border-red-300 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
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
                className="w-full border rounded-lg px-3 py-2"
                required
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
                rows={4}
                required
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
                  className="border rounded-lg px-3 py-2"
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
                  className="border rounded-lg px-3 py-2"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                  }}
                  className="border px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-lg"
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