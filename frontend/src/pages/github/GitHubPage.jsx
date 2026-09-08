import { useState, useEffect } from "react";
import {
  FiGithub, FiStar, FiGitBranch, FiAlertCircle, FiUsers,
  FiGitCommit, FiLink, FiExternalLink, FiRefreshCw, FiX,
  FiCheck, FiEye, FiCode, FiClock, FiBookOpen,
} from "react-icons/fi";
import {
  getLinkedProjects, getAllProjects, setProjectRepo, getRepoInfo,
} from "../../services/githubService";

// ─── Utility ──────────────────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

const langColors = {
  JavaScript: "#f7df1e", TypeScript: "#3178c6", Python: "#3572a5",
  Java: "#b07219", "C++": "#f34b7d", Go: "#00add8", Rust: "#dea584",
  Ruby: "#701516", PHP: "#4f5d95", Swift: "#fa7343", Kotlin: "#a97bff",
  CSS: "#563d7c", HTML: "#e34c26", Shell: "#89e051", Dart: "#00b4ab",
};

// ─── Sub-components ────────────────────────────────────────────────────────────
function StatBadge({ icon: Icon, label, value, color = "violet" }) {
  const colors = {
    violet: "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300",
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
      className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition group">
      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
        <FiGitCommit size={13} className="text-gray-500 dark:text-gray-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition">
          {commit.message}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          <span className="font-medium text-gray-700 dark:text-gray-300">{commit.author}</span>
          {" · "}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-[11px]">{commit.sha}</code>
          {" · "}{timeAgo(commit.date)}
        </p>
      </div>
      <FiExternalLink size={13} className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-violet-500 mt-1 transition" />
    </a>
  );
}

function ContributorCard({ contributor }) {
  return (
    <a href={contributor.url} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition group">
      <img src={contributor.avatar} alt={contributor.login}
        className="h-9 w-9 rounded-full border-2 border-white dark:border-gray-700 shadow-sm" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition">
          {contributor.login}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{contributor.contributions} commits</p>
      </div>
      <div className="flex-shrink-0 text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-2 py-0.5 rounded-full">
        #{contributor.contributions}
      </div>
    </a>
  );
}

function IssueCard({ issue }) {
  return (
    <a href={issue.url} target="_blank" rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition group">
      <FiAlertCircle size={16} className="mt-0.5 flex-shrink-0 text-green-500" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition">
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
          <span className="text-xs text-gray-500 dark:text-gray-400">by {issue.author} · {timeAgo(issue.createdAt)}</span>
        </div>
      </div>
    </a>
  );
}

// ─── Link Repo Modal ────────────────────────────────────────────────────────────
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
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FiLink size={18} className="text-violet-600" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Link GitHub Repository</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
            <FiX size={20} />
          </button>
        </div>
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project</label>
            <select value={projectId} onChange={e => setProjectId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500">
              <option value="">Select a project...</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.projectName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub Repository URL</label>
            <input type="url" placeholder="https://github.com/owner/repo" value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition disabled:opacity-70">
            {saving ? <FiRefreshCw size={14} className="animate-spin" /> : <FiCheck size={14} />}
            {saving ? "Saving..." : "Link Repository"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
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

  const loadLinkedProjects = async () => {
    try {
      const res = await getLinkedProjects();
      setLinkedProjects(res.data.data);
    } catch (e) { console.error(e); }
  };

  const handleSelectProject = async (project) => {
    setSelectedProject(project);
    setRepoData(null);
    setFetchError("");
    setActiveTab("commits");
    setLoading(true);
    try {
      const res = await getRepoInfo(project.githubRepo);
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
    <div className="min-h-full bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {showModal && (
        <LinkRepoModal
          projects={allProjects}
          onClose={() => setShowModal(false)}
          onSave={handleLinkSave}
        />
      )}

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 dark:bg-gray-100">
              <FiGithub size={20} className="text-white dark:text-gray-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">GitHub Integration</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">View repositories, commits, contributors & issues</p>
            </div>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition shadow-sm">
            <FiLink size={15} />
            Link Repository
          </button>
        </div>
      </div>

      <div className="p-8 flex gap-6">
        {/* Sidebar — Project List */}
        <div className="w-72 flex-shrink-0 space-y-2">
          <p className="px-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
            Linked Repositories ({linkedProjects.length})
          </p>
          {linkedProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-center">
              <FiGithub size={28} className="text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No repositories linked yet.</p>
              <button onClick={() => setShowModal(true)}
                className="mt-3 text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium">
                + Link a repository
              </button>
            </div>
          ) : (
            linkedProjects.map(project => {
              const isActive = selectedProject?._id === project._id;
              return (
                <button key={project._id} onClick={() => handleSelectProject(project)}
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    isActive
                      ? "border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-900/20 shadow-sm"
                      : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700"
                  }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <FiGithub size={14} className={isActive ? "text-violet-600 dark:text-violet-400" : "text-gray-400"} />
                    <p className={`text-sm font-semibold truncate ${isActive ? "text-violet-700 dark:text-violet-300" : "text-gray-800 dark:text-gray-200"}`}>
                      {project.projectName}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{project.githubRepo?.replace("https://github.com/", "")}</p>
                  <span className={`mt-2 inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    project.status === "Active" ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400" :
                    project.status === "Completed" ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" :
                    "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}>{project.status}</span>
                </button>
              );
            })
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {!selectedProject && (
            <div className="flex flex-col items-center justify-center h-80 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
                <FiBookOpen size={28} className="text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Select a repository</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Choose a linked project to view GitHub data</p>
            </div>
          )}

          {selectedProject && loading && (
            <div className="flex flex-col items-center justify-center h-80">
              <FiRefreshCw size={28} className="text-violet-500 animate-spin mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Fetching repository data...</p>
            </div>
          )}

          {selectedProject && fetchError && !loading && (
            <div className="flex flex-col items-center justify-center h-80 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
              <FiAlertCircle size={28} className="text-red-400 mb-3" />
              <p className="text-sm font-medium text-red-600 dark:text-red-400">{fetchError}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">The repository may be private or the URL may be incorrect.</p>
            </div>
          )}

          {selectedProject && repoData && !loading && (
            <div className="space-y-6">
              {/* Repo Header Card */}
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FiGithub size={18} className="text-gray-700 dark:text-gray-300 flex-shrink-0" />
                      <a href={repoData.repo.url} target="_blank" rel="noopener noreferrer"
                        className="text-xl font-bold text-gray-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition flex items-center gap-1.5">
                        {repoData.repo.name}
                        <FiExternalLink size={14} />
                      </a>
                    </div>
                    {repoData.repo.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 ml-6">{repoData.repo.description}</p>
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
                      <StatBadge icon={FiGitBranch} label="forks" value={repoData.repo.forks} color="violet" />
                      <StatBadge icon={FiEye} label="watchers" value={repoData.repo.watchers} color="blue" />
                      <StatBadge icon={FiAlertCircle} label="open issues" value={repoData.repo.openIssues} color="red" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                      <FiClock size={12} /> Updated {timeAgo(repoData.repo.updatedAt)}
                    </span>
                    <button onClick={handleRefresh}
                      className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5">
                      <FiRefreshCw size={12} />
                      Refresh
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-1 w-fit">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                      activeTab === tab.id
                        ? "bg-violet-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}>
                    <tab.icon size={14} />
                    {tab.label}
                    {tab.count !== undefined && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        activeTab === tab.id ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800"
                      }`}>{tab.count}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
                {activeTab === "commits" && (
                  <div>
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                      <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FiGitCommit size={16} /> Recent Commits
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800 px-3 py-2">
                      {repoData.commits.length === 0 ? (
                        <p className="p-4 text-sm text-gray-400 dark:text-gray-500 text-center">No commits found.</p>
                      ) : repoData.commits.map(c => <CommitCard key={c.sha} commit={c} />)}
                    </div>
                  </div>
                )}
                {activeTab === "contributors" && (
                  <div>
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                      <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FiUsers size={16} /> Top Contributors
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800 px-3 py-2">
                      {repoData.contributors.length === 0 ? (
                        <p className="p-4 text-sm text-gray-400 dark:text-gray-500 text-center">No contributor data available.</p>
                      ) : repoData.contributors.map(c => <ContributorCard key={c.login} contributor={c} />)}
                    </div>
                  </div>
                )}
                {activeTab === "issues" && (
                  <div>
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                      <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FiAlertCircle size={16} /> Open Issues
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800 px-3 py-2">
                      {repoData.issues.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                          <FiCheck size={24} className="text-green-400 mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">No open issues — great job!</p>
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
