import { useState } from "react";
import {
    FiFolder, FiUsers, FiUser, FiCalendar,
    FiCheckCircle, FiAlertTriangle, FiDownload,
    FiChevronRight, FiX, FiFileText
} from "react-icons/fi";
import {
    getProjectReport, getTeamReport, getInternReport,
    getMonthlyReport, getCompletedTasksReport, getDelayedTasksReport,
    exportReport,
} from "../../services/reportService";

// ── Priority / Status badge colours ────────────────────────────────────────
const priorityColor = {
    Low: "bg-gray-100 text-gray-600",
    Medium: "bg-blue-50 text-blue-600",
    High: "bg-orange-50 text-orange-600",
    Critical: "bg-red-50 text-red-600",
};

const statusColor = {
    Pending: "bg-yellow-50 text-yellow-700",
    "In Progress": "bg-blue-50 text-blue-700",
    Completed: "bg-green-50 text-green-700",
};

const Badge = ({ text, colorMap }) => (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorMap?.[text] || "bg-gray-100 text-gray-600"}`}>
        {text}
    </span>
);

// ── Report definitions ──────────────────────────────────────────────────────
const REPORTS = [
    {
        key: "projects",
        label: "Project Report",
        description: "All your projects with status, priority, owner, and timeline details.",
        icon: FiFolder,
        accentFrom: "#6366f1",
        accentTo: "#8b5cf6",
        fetch: getProjectReport,
        columns: ["Project Name", "Status", "Priority", "Owner", "Start Date", "Deadline", "Technologies"],
        renderRow: (r) => [
            r.name,
            <Badge text={r.status} colorMap={statusColor} />,
            <Badge text={r.priority} colorMap={priorityColor} />,
            r.owner,
            r.startDate,
            r.deadline,
            r.technologies,
        ],
    },
    {
        key: "teams",
        label: "Team Report",
        description: "All teams you belong to with member lists and ownership details.",
        icon: FiUsers,
        accentFrom: "#0ea5e9",
        accentTo: "#06b6d4",
        fetch: getTeamReport,
        columns: ["Team Name", "Owner", "Members", "Created At"],
        renderRow: (r) => [
            r.teamName,
            r.owner,
            r.members.map((m) => m.name).join(", "),
            r.createdAt,
        ],
    },
    {
        key: "interns",
        label: "Intern Report",
        description: "Per-member task breakdown: completion rates, overdue counts, workload.",
        icon: FiUser,
        accentFrom: "#f59e0b",
        accentTo: "#f97316",
        fetch: getInternReport,
        columns: ["Name", "Role", "Total", "Done", "In Progress", "Pending", "Overdue", "Rate"],
        renderRow: (r) => [
            r.name,
            r.role,
            r.totalTasks,
            r.completed,
            r.inProgress,
            r.pending,
            <span className={r.overdue > 0 ? "text-red-600 font-semibold" : ""}>{r.overdue}</span>,
            <span className="font-semibold">{r.completionRate}</span>,
        ],
    },
    {
        key: "monthly",
        label: "Monthly Report",
        description: "Task breakdown for any given month — creation, completion and overdue counts.",
        icon: FiCalendar,
        accentFrom: "#10b981",
        accentTo: "#06d6a0",
        isMonthly: true,
        fetch: getMonthlyReport,
        columns: ["Title", "Status", "Priority", "Assignee", "Deadline", "Created At"],
        renderRow: (r) => [
            r.title,
            <Badge text={r.status} colorMap={statusColor} />,
            <Badge text={r.priority} colorMap={priorityColor} />,
            r.assignee,
            r.deadline,
            r.createdAt,
        ],
        formatData: (d) => d.tasks,
        summaryOf: (d) => [
            { label: "Total Tasks", value: d.totalTasks },
            { label: "Completed", value: d.completed },
            { label: "In Progress", value: d.inProgress },
            { label: "Pending", value: d.pending },
            { label: "Overdue", value: d.overdue },
        ],
    },
    {
        key: "completedTasks",
        label: "Completed Tasks",
        description: "Full list of all tasks that have been marked as Completed.",
        icon: FiCheckCircle,
        accentFrom: "#22c55e",
        accentTo: "#16a34a",
        fetch: getCompletedTasksReport,
        columns: ["Title", "Priority", "Assignee", "Created By", "Deadline", "Completed On", "Subtasks"],
        renderRow: (r) => [
            r.title,
            <Badge text={r.priority} colorMap={priorityColor} />,
            r.assignee,
            r.createdBy,
            r.deadline,
            r.completedOn,
            `${r.subtasksDone}/${r.subtasksTotal}`,
        ],
    },
    {
        key: "delayedTasks",
        label: "Delayed Tasks",
        description: "Tasks that are past their deadline and still not completed.",
        icon: FiAlertTriangle,
        accentFrom: "#ef4444",
        accentTo: "#dc2626",
        fetch: getDelayedTasksReport,
        columns: ["Title", "Priority", "Status", "Assignee", "Deadline", "Days Overdue"],
        renderRow: (r) => [
            r.title,
            <Badge text={r.priority} colorMap={priorityColor} />,
            <Badge text={r.status} colorMap={statusColor} />,
            r.assignee,
            r.deadline,
            <span className={`font-bold ${r.daysOverdue > 7 ? "text-red-600" : "text-orange-500"}`}>
                {r.daysOverdue}d
            </span>,
        ],
    },
];

// ── ExportDropdown ─────────────────────────────────────────────────────────
function ExportDropdown({ reportKey, month, onExport }) {
    const [open, setOpen] = useState(false);

    const handle = async (type) => {
        setOpen(false);
        await onExport(reportKey, type, month);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((o) => !o)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
            >
                <FiDownload size={14} />
                Export
                <FiChevronRight size={12} className={`transition-transform ${open ? "rotate-90" : ""}`} />
            </button>
            {open && (
                <div className="absolute right-0 z-50 mt-1 w-36 rounded-xl border border-gray-100 bg-white shadow-lg">
                    <button
                        onClick={() => handle("excel")}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 rounded-t-xl transition"
                    >
                        <FiFileText size={14} /> Excel (.xlsx)
                    </button>
                    <button
                        onClick={() => handle("pdf")}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 rounded-b-xl transition"
                    >
                        <FiFileText size={14} /> PDF (.pdf)
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Detail Panel ───────────────────────────────────────────────────────────
function DetailPanel({ report, data, loading, error, month, onClose, onExport }) {
    if (!report) return null;

    const rows = report.formatData ? report.formatData(data) : data;
    const summary = report.summaryOf ? report.summaryOf(data) : null;

    return (
        <div className="fixed inset-0 z-40 flex">
            {/* Backdrop */}
            <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />

            {/* Slide-in panel */}
            <div className="w-full max-w-4xl overflow-y-auto bg-white shadow-2xl animate-slide-in-right">
                {/* Panel Header */}
                <div
                    className="sticky top-0 z-10 flex items-center justify-between border-b px-8 py-5"
                    style={{ background: `linear-gradient(135deg, ${report.accentFrom}, ${report.accentTo})` }}
                >
                    <div className="flex items-center gap-3 text-white">
                        <report.icon size={22} />
                        <div>
                            <h2 className="text-xl font-bold">{report.label}</h2>
                            <p className="text-sm opacity-80">{report.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ExportDropdown reportKey={report.key} month={month} onExport={onExport} />
                        <button onClick={onClose} className="ml-2 rounded-xl p-2 text-white/80 hover:bg-white/20 transition">
                            <FiX size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    {/* Monthly Summary Pills */}
                    {summary && (
                        <div className="mb-6 grid grid-cols-5 gap-3">
                            {summary.map((s) => (
                                <div key={s.label} className="rounded-2xl border bg-gray-50 p-4 text-center">
                                    <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                                    <p className="mt-1 text-xs text-gray-500">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
                        </div>
                    )}

                    {error && (
                        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">{error}</div>
                    )}

                    {!loading && !error && rows?.length === 0 && (
                        <div className="py-16 text-center text-gray-400">
                            <FiFileText size={36} className="mx-auto mb-3" />
                            <p className="font-medium">No data found for this report.</p>
                        </div>
                    )}

                    {!loading && !error && rows?.length > 0 && (
                        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-900 text-white">
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider rounded-tl-2xl">#</th>
                                        {report.columns.map((col, i) => (
                                            <th
                                                key={col}
                                                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${i === report.columns.length - 1 ? "rounded-tr-2xl" : ""}`}
                                            >
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, ri) => (
                                        <tr key={ri} className={`border-t border-gray-50 ${ri % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-indigo-50/30 transition`}>
                                            <td className="px-4 py-3 text-xs text-gray-400">{ri + 1}</td>
                                            {report.renderRow(row).map((cell, ci) => (
                                                <td key={ci} className="px-4 py-3 text-gray-700">
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="border-t bg-gray-50 px-6 py-3 text-xs text-gray-400 rounded-b-2xl">
                                {rows.length} record{rows.length !== 1 ? "s" : ""} found
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main Reports Page ───────────────────────────────────────────────────────
export default function Reports() {
    const [activeReport, setActiveReport] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [exporting, setExporting] = useState(null);

    const openReport = async (report) => {
        setActiveReport(report);
        setReportData(null);
        setError("");
        setLoading(true);
        try {
            const res = report.isMonthly
                ? await report.fetch(month)
                : await report.fetch();
            setReportData(res.data.data);
        } catch (err) {
            setError("Failed to load report data.");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (key, type, m) => {
        setExporting(`${key}-${type}`);
        try {
            await exportReport(key, type, m);
        } catch {
            alert("Export failed. Make sure the backend server is running.");
        } finally {
            setExporting(null);
        }
    };

    return (
        <div className="min-h-full bg-gray-50 p-8">
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
                        <p className="mt-1 text-gray-500">
                            Generate, view and export analytical reports across your workspace.
                        </p>
                    </div>
                    {/* Month picker for Monthly Report quick access */}
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
                        <FiCalendar size={16} className="text-gray-400" />
                        <label className="text-xs font-medium text-gray-500 mr-1">Month:</label>
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="text-sm outline-none bg-transparent text-gray-800"
                        />
                    </div>
                </div>

                {/* Report Cards Grid */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {REPORTS.map((report) => {
                        const Icon = report.icon;
                        return (
                            <div
                                key={report.key}
                                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
                            >
                                {/* Accent strip */}
                                <div
                                    className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
                                    style={{ background: `linear-gradient(90deg, ${report.accentFrom}, ${report.accentTo})` }}
                                />

                                <div className="p-6 pt-7">
                                    {/* Icon */}
                                    <div
                                        className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm"
                                        style={{ background: `linear-gradient(135deg, ${report.accentFrom}, ${report.accentTo})` }}
                                    >
                                        <Icon size={20} />
                                    </div>

                                    <h3 className="text-base font-bold text-gray-900">{report.label}</h3>
                                    <p className="mt-1 text-sm text-gray-500 leading-relaxed">{report.description}</p>

                                    {/* Actions */}
                                    <div className="mt-5 flex items-center gap-2">
                                        <button
                                            id={`view-report-${report.key}`}
                                            onClick={() => openReport(report)}
                                            className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98]"
                                            style={{ background: `linear-gradient(135deg, ${report.accentFrom}, ${report.accentTo})` }}
                                        >
                                            View Report
                                        </button>
                                        <ExportDropdown
                                            reportKey={report.key}
                                            month={report.isMonthly ? month : null}
                                            onExport={handleExport}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Detail Panel */}
            {activeReport && (
                <DetailPanel
                    report={activeReport}
                    data={reportData}
                    loading={loading}
                    error={error}
                    month={month}
                    onClose={() => setActiveReport(null)}
                    onExport={handleExport}
                />
            )}

            {/* Inline style for slide-in animation */}
            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to   { transform: translateX(0);    opacity: 1; }
                }
                .animate-slide-in-right {
                    animation: slideInRight 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
                }
            `}</style>
        </div>
    );
}
