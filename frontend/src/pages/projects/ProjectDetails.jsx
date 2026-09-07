import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectById } from "../../services/projectService";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await getProjectById(id);
      setProject(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-3">
          Project not found
        </h1>

        <button
          onClick={() => navigate("/projects")}
          className="border px-4 py-2 rounded-lg"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">

      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate("/projects")}
            className="text-sm text-gray-500 hover:text-black mb-3"
          >
            ← Back to Projects
          </button>

          <h1 className="text-3xl font-bold">
            {project.projectName}
          </h1>

          <p className="text-gray-500 mt-2">
            Project details and information
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/projects", {
                state: {
                    editProjectId: project._id,
                },  
            })
          }
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Edit Project
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Description */}
        <div className="border rounded-2xl p-6 bg-white shadow-sm md:col-span-2">
          <h2 className="text-lg font-semibold mb-3">
            Description
          </h2>

          <p className="text-gray-600 leading-relaxed">
            {project.description || "No description provided."}
          </p>
        </div>

        {/* Status */}
        <div className="border rounded-2xl p-6 bg-white shadow-sm">
          <h2 className="text-sm text-gray-500 mb-2">
            Status
          </h2>

          <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
            {project.status}
          </span>
        </div>

        {/* Priority */}
        <div className="border rounded-2xl p-6 bg-white shadow-sm">
          <h2 className="text-sm text-gray-500 mb-2">
            Priority
          </h2>

          <p className="font-semibold">
            {project.priority}
          </p>
        </div>

        {/* Start Date */}
        <div className="border rounded-2xl p-6 bg-white shadow-sm">
          <h2 className="text-sm text-gray-500 mb-2">
            Start Date
          </h2>

          <p>
            {project.startDate
              ? project.startDate.slice(0, 10)
              : "Not set"}
          </p>
        </div>

        {/* Deadline */}
        <div className="border rounded-2xl p-6 bg-white shadow-sm">
          <h2 className="text-sm text-gray-500 mb-2">
            Deadline
          </h2>

          <p>
            {project.deadline
              ? project.deadline.slice(0, 10)
              : "Not set"}
          </p>
        </div>

        {/* Technologies */}
        <div className="border rounded-2xl p-6 bg-white shadow-sm md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">
            Technologies
          </h2>

          <div className="flex flex-wrap gap-2">
            {project.technologies?.length > 0 ? (
              project.technologies.map((technology, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm"
                >
                  {technology}
                </span>
              ))
            ) : (
              <p className="text-gray-500">
                No technologies added.
              </p>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="border rounded-2xl p-6 bg-white shadow-sm md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">
            Project Links
          </h2>

          <div className="space-y-3">

            {project.githubRepo ? (
              <div>
                <span className="text-sm text-gray-500">
                  GitHub Repository
                </span>

                <br />

                <a
                  href={project.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {project.githubRepo}
                </a>
              </div>
            ) : (
              <p className="text-gray-500">
                No GitHub repository added.
              </p>
            )}

            {project.deploymentLink ? (
              <div>
                <span className="text-sm text-gray-500">
                  Deployment
                </span>

                <br />

                <a
                  href={project.deploymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {project.deploymentLink}
                </a>
              </div>
            ) : (
              <p className="text-gray-500">
                No deployment link added.
              </p>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetails;