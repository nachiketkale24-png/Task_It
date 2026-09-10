import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectById } from "../../services/projectService";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="app-page">
        <p className="text-[var(--subtitle-color)]">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="app-page">
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
    <div className="app-page">

      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate("/projects")}
            className="text-sm text-[var(--subtitle-color)] hover:text-[var(--title-color)] mb-3"
          >
            Back to Projects
          </button>

          <h1 className="text-3xl font-bold">
            {project.projectName}
          </h1>

          <p className="text-[var(--subtitle-color)] mt-2">
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
          className="bg-[var(--accent)] text-[var(--accent-contrast)] px-4 py-2 rounded-lg"
        >
          Edit Project
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Description */}
        <div className="border rounded-lg p-6 bg-[var(--surface-card)]  md:col-span-2">
          <h2 className="text-lg font-semibold mb-3">
            Description
          </h2>

          <p className="text-[var(--subtitle-color)] leading-relaxed">
            {project.description || "No description provided."}
          </p>
        </div>

        {/* Status */}
        <div className="border rounded-lg p-6 bg-[var(--surface-card)] ">
          <h2 className="text-sm text-[var(--subtitle-color)] mb-2">
            Status
          </h2>

          <span className="inline-block px-3 py-1 rounded-full bg-[var(--hover-bg)] text-[var(--title-color)] text-sm">
            {project.status}
          </span>
        </div>

        {/* Priority */}
        <div className="border rounded-lg p-6 bg-[var(--surface-card)] ">
          <h2 className="text-sm text-[var(--subtitle-color)] mb-2">
            Priority
          </h2>

          <p className="font-semibold">
            {project.priority}
          </p>
        </div>

        {/* Start Date */}
        <div className="border rounded-lg p-6 bg-[var(--surface-card)] ">
          <h2 className="text-sm text-[var(--subtitle-color)] mb-2">
            Start Date
          </h2>

          <p>
            {project.startDate
              ? project.startDate.slice(0, 10)
              : "Not set"}
          </p>
        </div>

        {/* Deadline */}
        <div className="border rounded-lg p-6 bg-[var(--surface-card)] ">
          <h2 className="text-sm text-[var(--subtitle-color)] mb-2">
            Deadline
          </h2>

          <p>
            {project.deadline
              ? project.deadline.slice(0, 10)
              : "Not set"}
          </p>
        </div>

        {/* Technologies */}
        <div className="border rounded-lg p-6 bg-[var(--surface-card)]  md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">
            Technologies
          </h2>

          <div className="flex flex-wrap gap-2">
            {project.technologies?.length > 0 ? (
              project.technologies.map((technology, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-[var(--hover-bg)] text-[var(--title-color)] text-sm"
                >
                  {technology}
                </span>
              ))
            ) : (
              <p className="text-[var(--subtitle-color)]">
                No technologies added.
              </p>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="border rounded-lg p-6 bg-[var(--surface-card)]  md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">
            Project Links
          </h2>

          <div className="space-y-3">

            {project.githubRepo ? (
              <div>
                <span className="text-sm text-[var(--subtitle-color)]">
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
              <p className="text-[var(--subtitle-color)]">
                No GitHub repository added.
              </p>
            )}

            {project.deploymentLink ? (
              <div>
                <span className="text-sm text-[var(--subtitle-color)]">
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
              <p className="text-[var(--subtitle-color)]">
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





