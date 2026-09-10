import { useState, useEffect } from "react";
import {
  FiGithub, FiStar, FiGitBranch, FiAlertCircle, FiUsers,
  FiGitCommit, FiLink, FiExternalLink, FiRefreshCw, FiX,
  FiCheck, FiEye, FiCode, FiClock, FiBookOpen,
} from "react-icons/fi";
import {
  getLinkedProjects, getAllProjects, setProjectRepo, getRepoInfo,
} from "../../services/githubService";

// Section
const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

// Section
function StatBadge({ icon: Icon, label, value, color = "neutral" }) {
  const colors = {
    neutral: "bg-[var(--surface-muted)] dark:bg-[var(--hover-bg)] text-[var(--title-color)] dark:text-[var(--title-color)]",
    amber:  "bg-amber-50  dark:bg-amber-900/20  text-amber-700  dark:text-amber-300",
    blue:   "bg-blue-50   dark:bg-blue-900/20   text-blue-700   dark:text-blue-300",
    green:  "bg-green-50  dark:bg-green-900/20  text-green-700  dark:text-green-300",
    red:    "bg-red-50    dark:bg-red-900/20    text-red-700    dark:text-red-300",
  };
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${colors[color]}`}>
      <Icon size={13} />
      <span>{value}</span>
      <span className="opacity-70">{label}</span>
    </div>
  );
}

function CommitCard({ commit }) {
  return (
    <a href={commit.url} target="_blank" rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 rounded-md hover:bg-[var(--surface-muted)] dark:hover:bg-[var(--hover-bg)]/50 transition group">
      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--hover-bg)] dark:bg-gray-800">
        <FiGitCommit size={13} className="text-[var(--subtitle-color)] dark:text-[var(--muted-color)]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[var(--title-color)] dark:text-gray-200 truncate group-hover:text-[var(--title-color)] dark:group-hover:text-[var(--title-color)] transition">
          {commit.message}
        </p>
        <p className="text-xs text-[var(--subtitle-color)] dark:text-[var(--muted-color)] mt-0.5">
          <span className="font-medium text-[var(--title-color)] dark:text-[var(--muted-color)]">{commit.author}</span>
          {" · "}
          <code className="bg-[var(--hover-bg)] dark:bg-gray-800 px-1 rounded text-[11px]">{commit.sha}</code>
          {" · "}{timeAgo(commit.date)}
        </p>
      </div>
      <FiExternalLink size={13} className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-[var(--title-color)] mt-1 transition" />
    </a>
  );
}

function ContributorCard({ contributor }) {
  return (
    <a href={contributor.url} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-md hover:bg-[var(--surface-muted)] dark:hover:bg-[var(--hover-bg)]/50 transition group">
      <img src={contributor.avatar} alt={contributor.login}
        className="h-9 w-9 rounded-full border-2 border-white dark:border-gray-700 " />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--title-color)] dark:text-gray-200 group-hover:text-[var(--title-color)] dark:group-hover:text-[var(--title-color)] transition">
          {contributor.login}
        </p>
        <p className="text-xs text-[var(--subtitle-color)] dark:text-[var(--muted-color)]">{contributor.contributions} commits</p>
      </div>
      <div className="flex-shrink-0 text-xs font-bold text-[var(--title-color)] dark:text-[var(--title-color)] bg-[var(--surface-muted)] dark:bg-[var(--hover-bg)] px-2 py-0.5 rounded-full">
        #{contributor.contributions}
      </div>
    </a>
  );
}

function IssueCard({ issue }) {
  return (
    <a href={issue.url} target="_blank" rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 rounded-md hover:bg-[var(--surface-muted)] dark:hover:bg-[var(--hover-bg)]/50 transition group">
      <FiAlertCircle size={16} className="mt-0.5 flex-shrink-0 text-green-500" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[var(--title-color)] dark:text-gray-200 group-hover:text-[var(--title-color)] dark:group-hover:text-[var(--title-color)] transition">
          #{issue.number} {issue.title}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 mt-1">
          {issue.labels.map(l => (
            <span key={l.name}
              className="px-1.5 py-0.5 rounded text-[10px] font-medium"
              style={{ backgroundColor: `#${l.color}22`, color: `#${l.color}` }}>
              {l.name}
            </span>
          ))}
          <span className="text-xs text-[var(--subtitle-color)] dark:text-[var(--muted-color)]">by {issue.author} · {timeAgo(issue.createdAt)}</span>
        </div>
      </div>
    </a>
  );
}

// Section
function LinkRepoModal({ projects, onClose, onSave }) {
  const [projectId, setProjectId] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!projectId || !url) { setError("Please select a project and enter a URL."); return; }
    if (!url.includes("github.com")) { setError("Please enter a valid GitHub URL."); return; }
    setSaving(true); setError("");
    try {
      await onSave(projectId, url);
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to save.");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-lg bg-[var(--surface-card)] dark:bg-gray-900 border border-[var(--border-color)] dark:border-gray-700  p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FiLink size={18} className="text-[var(--title-color)]" />
            <h3 className="text-lg font-bold text-[var(--title-color)] dark:text-[var(--title-color)]">Link GitHub Repository</h3>
          </div>
          <button onClick={onClose} className="text-[var(--muted-color)] hover:text-[var(--subtitle-color)] dark:hover:text-gray-200 transition">
            <FiX size={20} />
          </button>
        </div>
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--title-color)] dark:text-[var(--muted-color)] mb-1">Project</label>
            <select value={projectId} onChange={e => setProjectId(e.target.value)}
              className="w-full rounded-md border border-[var(--border-color)] dark:border-gray-700 bg-[var(--surface-card)] dark:bg-gray-800 px-4 py-2.5 text-sm text-[var(--title-color)] dark:text-[var(--title-color)] outline-none focus:border-[var(--title-color)] focus:ring-1 focus:ring-gray-300">
              <option value="">Select a project...</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.projectName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--title-color)] dark:text-[var(--muted-color)] mb-1">GitHub Repository URL</label>
            <input type="url" placeholder="https://github.com/owner/repo" value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full rounded-md border border-[var(--border-color)] dark:border-gray-700 bg-[var(--surface-card)] dark:bg-gray-800 px-4 py-2.5 text-sm text-[var(--title-color)] dark:text-[var(--title-color)] placeholder-gray-400 outline-none focus:border-[var(--title-color)] focus:ring-1 focus:ring-gray-300" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 rounded-md border border-[var(--border-color)] dark:border-gray-700 py-2.5 text-sm font-medium text-[var(--subtitle-color)] dark:text-[var(--muted-color)] hover:bg-[var(--surface-muted)] dark:hover:bg-[var(--hover-bg)] transition">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 rounded-md bg-[var(--accent)] py-2.5 text-sm font-semibold text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)] transition disabled:opacity-70">
            {saving ? <FiRefreshCw size={14} className="animate-spin" /> : <FiCheck size={14} />}
            {saving ? "Saving..." : "Link Repository"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Section
export default function GitHubPage() {
  const [linkedProjects, setLinkedProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [repoData, setRepoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [activeTab, setActiveTab] = useState("commits");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadLinkedProjects();
    getAllProjects().then(r => setAllProjects(r.data.data)).catch(console.error);
  }, []);

  async function loadLinkedProjects() {
    try {
      const res = await getLinkedProjects();
      setLinkedProjects(res.data.data);
    } catch (e) { console.error(e); }
  }

  const handleSelectProject = async (project) => {
    setSelectedProject(project);
    setRepoData(null);
    setFetchError("");
    setActiveTab("commits");
    setLoading(true);
    try {
      const res = await getRepoInfo(project.githubRepo, project._id);
      setRepoData(res.data.data);
    } catch (e) {
      setFetchError(e.response?.data?.message || "Failed to load repository data.");
    } finally { setLoading(false); }
  };

  const handleLinkSave = async (projectId, url) => {
    await setProjectRepo(projectId, url);
    await loadLinkedProjects();
  };

  const handleRefresh = () => {
    if (selectedProject) handleSelectProject(selectedProject);
  };

  const tabs = [
    { id: "commits", label: "Commits", icon: FiGitCommit, count: repoData?.commits?.length },
    { id: "contributors", label: "Contributors", icon: FiUsers, count: repoData?.contributors?.length },
    { id: "issues", label: "Open Issues", icon: FiAlertCircle, count: repoData?.issues?.length },
  ];

  return (
    <div className="min-h-full bg-[var(--main-bg)] transition-colors duration-200">
      {showModal && (
        <LinkRepoModal
          projects={allProjects}
          onClose={() => setShowModal(false)}
          onSave={handleLinkSave}
        />
      )}

      {/* Header */}
      <div className="bg-[var(--surface-card)] dark:bg-gray-900 border-b border-[var(--border-color)] dark:border-gray-800 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--icon-bg)]">
              <FiGithub size={20} className="text-[var(--icon-contrast)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--title-color)] dark:text-[var(--title-color)]">GitHub Integration</h1>
              <p className="text-sm text-[var(--subtitle-color)] dark:text-[var(--muted-color)]">View repositories, commits, contributors & issues</p>
            </div>
          </div>
          {allProjects.length > 0 && (
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)] transition ">
              <FiLink size={15} />
              Link Repository
            </button>
          )}
        </div>
      </div>

      <div className="p-8 flex gap-6">
        {/* Sidebar - Project List */}
        <div className="w-72 flex-shrink-0 space-y-2">
          <p className="px-1 text-xs font-semibold text-[var(--muted-color)] dark:text-[var(--subtitle-color)] uppercase tracking-wide mb-3">
            Linked Repositories ({linkedProjects.length})
          </p>
          {linkedProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 rounded-lg border border-dashed border-[var(--border-color)] dark:border-gray-700 text-center">
              <FiGithub size={28} className="text-[var(--muted-color)] dark:text-[var(--subtitle-color)] mb-3" />
              <p className="text-sm text-[var(--subtitle-color)] dark:text-[var(--muted-color)]">No repositories linked yet.</p>
              {allProjects.length > 0 && (
                <button onClick={() => setShowModal(true)}
                  className="mt-3 text-xs text-[var(--title-color)] dark:text-[var(--title-color)] hover:underline font-medium">
                  + Link a repository
                </button>
              )}
            </div>
          ) : (
            linkedProjects.map(project => {
              const isActive = selectedProject?._id === project._id;
              return (
                <button key={project._id} onClick={() => handleSelectProject(project)}
                  className={`w-full text-left p-4 rounded-md border transition ${
                    isActive
                      ? "border-[var(--border-color)] dark:border-[var(--border-color)] bg-[var(--surface-muted)] dark:bg-[var(--hover-bg)] "
                      : "border-[var(--border-color)] dark:border-gray-800 bg-[var(--surface-card)] dark:bg-gray-900 hover:border-[var(--border-color)] dark:hover:border-gray-700"
                  }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <FiGithub size={14} className={isActive ? "text-[var(--title-color)] dark:text-[var(--title-color)]" : "text-[var(--muted-color)]"} />
                    <p className={`text-sm font-semibold truncate ${isActive ? "text-[var(--title-color)] dark:text-[var(--title-color)]" : "text-[var(--title-color)] dark:text-gray-200"}`}>
                      {project.projectName}
                    </p>
                  </div>
                  <p className="text-xs text-[var(--muted-color)] dark:text-[var(--subtitle-color)] truncate">{project.githubRepo?.replace("https://github.com/", "")}</p>
                  <span className={`mt-2 inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    project.status === "Active" ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400" :
                    project.status === "Completed" ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" :
                    "bg-[var(--hover-bg)] dark:bg-gray-800 text-[var(--subtitle-color)] dark:text-[var(--muted-color)]"
                  }`}>{project.status}</span>
                </button>
              );
            })
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {!selectedProject && (
            <div className="flex flex-col items-center justify-center h-80 rounded-lg border border-dashed border-[var(--border-color)] dark:border-gray-700 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[var(--hover-bg)] dark:bg-gray-800 mb-4">
                <FiBookOpen size={28} className="text-[var(--muted-color)] dark:text-[var(--subtitle-color)]" />
              </div>
              <p className="text-lg font-semibold text-[var(--title-color)] dark:text-[var(--muted-color)]">Select a repository</p>
              <p className="text-sm text-[var(--muted-color)] dark:text-[var(--subtitle-color)] mt-1">Choose a linked project to view GitHub data</p>
            </div>
          )}

          {selectedProject && loading && (
            <div className="flex flex-col items-center justify-center h-80">
              <FiRefreshCw size={28} className="text-[var(--title-color)] animate-spin mb-3" />
              <p className="text-sm text-[var(--subtitle-color)] dark:text-[var(--muted-color)]">Fetching repository data...</p>
            </div>
          )}

          {selectedProject && fetchError && !loading && (
            <div className="flex flex-col items-center justify-center h-80 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
              <FiAlertCircle size={28} className="text-red-400 mb-3" />
              <p className="text-sm font-medium text-red-600 dark:text-red-400">{fetchError}</p>
              <p className="text-xs text-[var(--subtitle-color)] dark:text-[var(--muted-color)] mt-1">The repository may be private or the URL may be incorrect.</p>
            </div>
          )}

          {selectedProject && repoData && !loading && (
            <div className="space-y-6">
              {/* Repo Header Card */}
              <div className="rounded-lg border border-[var(--border-color)] dark:border-gray-800 bg-[var(--surface-card)] dark:bg-gray-900 p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FiGithub size={18} className="text-[var(--title-color)] dark:text-[var(--muted-color)] flex-shrink-0" />
                      <a href={repoData.repo.url} target="_blank" rel="noopener noreferrer"
                        className="text-xl font-bold text-[var(--title-color)] dark:text-[var(--title-color)] hover:text-[var(--title-color)] dark:hover:text-[var(--title-color)] transition flex items-center gap-1.5">
                        {repoData.repo.name}
                        <FiExternalLink size={14} />
                      </a>
                    </div>
                    {repoData.repo.description && (
                      <p className="text-sm text-[var(--subtitle-color)] dark:text-[var(--muted-color)] mb-3 ml-6">{repoData.repo.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5 ml-6 mb-3">
                      {repoData.repo.topics.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 ml-6">
                      {repoData.repo.language && (
                        <StatBadge icon={FiCode} label={repoData.repo.language} value=""
                          color="blue" />
                      )}
                      <StatBadge icon={FiStar} label="stars" value={repoData.repo.stars} color="amber" />
                      <StatBadge icon={FiGitBranch} label="forks" value={repoData.repo.forks} color="neutral" />
                      <StatBadge icon={FiEye} label="watchers" value={repoData.repo.watchers} color="blue" />
                      <StatBadge icon={FiAlertCircle} label="open issues" value={repoData.repo.openIssues} color="red" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="flex items-center gap-1.5 text-xs text-[var(--muted-color)] dark:text-[var(--subtitle-color)]">
                      <FiClock size={12} /> Updated {timeAgo(repoData.repo.updatedAt)}
                    </span>
                    <button onClick={handleRefresh}
                      className="flex items-center gap-1.5 text-xs text-[var(--subtitle-color)] dark:text-[var(--muted-color)] hover:text-[var(--title-color)] dark:hover:text-[var(--title-color)] transition border border-[var(--border-color)] dark:border-gray-700 rounded-lg px-3 py-1.5">
                      <FiRefreshCw size={12} />
                      Refresh
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-[var(--surface-card)] dark:bg-gray-900 border border-[var(--border-color)] dark:border-gray-800 rounded-md p-1 w-fit">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                      activeTab === tab.id
                        ? "bg-[var(--accent)] text-[var(--accent-contrast)] "
                        : "text-[var(--subtitle-color)] dark:text-[var(--muted-color)] hover:bg-[var(--hover-bg)] dark:hover:bg-[var(--hover-bg)]"
                    }`}>
                    <tab.icon size={14} />
                    {tab.label}
                    {tab.count !== undefined && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        activeTab === tab.id ? "bg-[var(--surface-card)]/20" : "bg-[var(--hover-bg)] dark:bg-gray-800"
                      }`}>{tab.count}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="rounded-lg border border-[var(--border-color)] dark:border-gray-800 bg-[var(--surface-card)] dark:bg-gray-900 overflow-hidden">
                {activeTab === "commits" && (
                  <div>
                    <div className="px-6 py-4 border-b border-[var(--border-color)] dark:border-gray-800">
                      <h3 className="font-semibold text-[var(--title-color)] dark:text-[var(--title-color)] flex items-center gap-2">
                        <FiGitCommit size={16} /> Recent Commits
                      </h3>
                    </div>
                    <div className="divide-y divide-[var(--border-color)] dark:divide-gray-800 px-3 py-2">
                      {repoData.commits.length === 0 ? (
                        <p className="p-4 text-sm text-[var(--muted-color)] dark:text-[var(--subtitle-color)] text-center">No commits found.</p>
                      ) : repoData.commits.map(c => <CommitCard key={c.sha} commit={c} />)}
                    </div>
                  </div>
                )}
                {activeTab === "contributors" && (
                  <div>
                    <div className="px-6 py-4 border-b border-[var(--border-color)] dark:border-gray-800">
                      <h3 className="font-semibold text-[var(--title-color)] dark:text-[var(--title-color)] flex items-center gap-2">
                        <FiUsers size={16} /> Top Contributors
                      </h3>
                    </div>
                    <div className="divide-y divide-[var(--border-color)] dark:divide-gray-800 px-3 py-2">
                      {repoData.contributors.length === 0 ? (
                        <p className="p-4 text-sm text-[var(--muted-color)] dark:text-[var(--subtitle-color)] text-center">No contributor data available.</p>
                      ) : repoData.contributors.map(c => <ContributorCard key={c.login} contributor={c} />)}
                    </div>
                  </div>
                )}
                {activeTab === "issues" && (
                  <div>
                    <div className="px-6 py-4 border-b border-[var(--border-color)] dark:border-gray-800">
                      <h3 className="font-semibold text-[var(--title-color)] dark:text-[var(--title-color)] flex items-center gap-2">
                        <FiAlertCircle size={16} /> Open Issues
                      </h3>
                    </div>
                    <div className="divide-y divide-[var(--border-color)] dark:divide-gray-800 px-3 py-2">
                      {repoData.issues.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                          <FiCheck size={24} className="text-green-400 mb-2" />
                          <p className="text-sm text-[var(--subtitle-color)] dark:text-[var(--muted-color)]">No open issues - great job!</p>
                        </div>
                      ) : repoData.issues.map(i => <IssueCard key={i.number} issue={i} />)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}







