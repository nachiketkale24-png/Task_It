import { useState, useRef, useCallback } from "react";
import {
    FiUploadCloud, FiFile, FiFileText, FiImage, FiTrash2,
    FiEye, FiX, FiDownload, FiFilter, FiSearch, FiPlus
} from "react-icons/fi";
import {
    getDocuments, uploadDocument, deleteDocument
} from "../../services/documentService";
import { useEffect } from "react";

// ── File type config ────────────────────────────────────────────────────────
const FILE_TYPES = ["All", "PDF", "PPT", "Image", "Research Paper", "Dataset", "Meeting Notes"];

const TYPE_META = {
    PDF:              { color: "bg-red-100 text-red-700",    icon: FiFileText, ext: ".pdf" },
    PPT:              { color: "bg-orange-100 text-orange-700", icon: FiFileText, ext: ".pptx" },
    Image:            { color: "bg-blue-100 text-blue-700",  icon: FiImage,    ext: ".png/.jpg" },
    "Research Paper": { color: "bg-purple-100 text-purple-700", icon: FiFile,  ext: ".pdf/.doc" },
    Dataset:          { color: "bg-green-100 text-green-700", icon: FiFile,    ext: ".csv/.xlsx" },
    "Meeting Notes":  { color: "bg-yellow-100 text-yellow-700", icon: FiFileText, ext: ".doc/.txt" },
};

function formatSize(bytes) {
    if (!bytes || bytes === 0) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
}

// ── Upload Modal ─────────────────────────────────────────────────────────────
function UploadModal({ onClose, onSuccess }) {
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [form, setForm] = useState({ name: "", description: "", fileType: "PDF", tags: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef();

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) { setFile(dropped); setForm(f => ({ ...f, name: dropped.name })); }
    }, []);

    const handleFileSelect = (e) => {
        const selected = e.target.files[0];
        if (selected) { setFile(selected); setForm(f => ({ ...f, name: selected.name })); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return setError("Please select a file.");
        if (!form.fileType) return setError("Please select a file type.");
        setLoading(true); setError("");
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("name", form.name || file.name);
            fd.append("description", form.description);
            fd.append("fileType", form.fileType);
            fd.append("tags", form.tags);
            await uploadDocument(fd);
            onSuccess();
            onClose();
        } catch (err) {
            setError(err?.response?.data?.message || "Upload failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <div className="flex items-center gap-2">
                        <FiUploadCloud size={20} className="text-violet-600" />
                        <h2 className="text-lg font-bold text-gray-900">Upload Document</h2>
                    </div>
                    <button onClick={onClose} className="rounded-xl p-2 hover:bg-gray-100 transition">
                        <FiX size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Drop Zone */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current.click()}
                        className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition
                            ${dragging ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-violet-400 hover:bg-violet-50/40"}`}
                    >
                        <input ref={inputRef} type="file" className="hidden" onChange={handleFileSelect} />
                        <FiUploadCloud size={32} className="mx-auto mb-2 text-gray-400" />
                        {file ? (
                            <div>
                                <p className="font-semibold text-violet-700">{file.name}</p>
                                <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm font-medium text-gray-600">Drag & drop a file here</p>
                                <p className="text-xs text-gray-400 mt-1">or click to browse — Max 50 MB</p>
                            </>
                        )}
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Document Name</label>
                            <input
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200"
                                placeholder="Document name"
                                value={form.name}
                                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">File Type *</label>
                            <select
                                required
                                value={form.fileType}
                                onChange={(e) => setForm(f => ({ ...f, fileType: e.target.value }))}
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
                            >
                                {FILE_TYPES.filter(t => t !== "All").map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Tags (comma-separated)</label>
                            <input
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
                                placeholder="ml, research, q2"
                                value={form.tags}
                                onChange={(e) => setForm(f => ({ ...f, tags: e.target.value }))}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="mb-1 block text-xs font-semibold text-gray-600">Description</label>
                            <textarea
                                rows={2}
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400 resize-none"
                                placeholder="Brief description of this document..."
                                value={form.description}
                                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                            />
                        </div>
                    </div>

                    {error && <p className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">{error}</p>}

                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose}
                            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60 transition">
                            {loading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <FiUploadCloud size={14} />}
                            {loading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Preview Modal ────────────────────────────────────────────────────────────
function PreviewModal({ doc, onClose }) {
    if (!doc) return null;
    const isImage = doc.fileType === "Image";
    const isPDF = doc.fileType === "PDF" || doc.originalName?.endsWith(".pdf");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4 flex-shrink-0">
                    <div>
                        <h3 className="font-bold text-gray-900">{doc.name}</h3>
                        <p className="text-xs text-gray-400">{doc.fileType} · {formatSize(doc.fileSize)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer" download
                            className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                            <FiDownload size={14} /> Download
                        </a>
                        <button onClick={onClose} className="rounded-xl p-2 hover:bg-gray-100 transition">
                            <FiX size={18} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden bg-gray-100">
                    {isImage ? (
                        <div className="flex h-full items-center justify-center p-6">
                            <img src={doc.fileUrl} alt={doc.name}
                                className="max-h-full max-w-full rounded-xl object-contain shadow-lg" />
                        </div>
                    ) : isPDF ? (
                        <iframe src={doc.fileUrl} className="h-full w-full border-0" title={doc.name} />
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-4">
                            <FiFile size={56} className="text-gray-300" />
                            <p className="text-gray-500">Preview not available for this file type.</p>
                            <a href={doc.fileUrl} target="_blank" rel="noreferrer" download
                                className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition">
                                <FiDownload size={14} /> Download File
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Document Card ────────────────────────────────────────────────────────────
function DocumentCard({ doc, onPreview, onDelete }) {
    const meta = TYPE_META[doc.fileType] || { color: "bg-gray-100 text-gray-700", icon: FiFile };
    const Icon = meta.icon;
    const initials = doc.uploadedBy?.fullName
        ? doc.uploadedBy.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        : "?";

    return (
        <div className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
            {/* Type badge */}
            <span className={`mb-3 inline-flex w-fit items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${meta.color}`}>
                <Icon size={12} /> {doc.fileType}
            </span>

            <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900">{doc.name}</h3>
            {doc.description && (
                <p className="mb-2 line-clamp-1 text-xs text-gray-400">{doc.description}</p>
            )}

            {/* Tags */}
            {doc.tags?.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1">
                    {doc.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                        {initials}
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-700">{doc.uploadedBy?.fullName || "Unknown"}</p>
                        <p className="text-xs text-gray-400">{timeAgo(doc.createdAt)} · {formatSize(doc.fileSize)}</p>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-1">
                    <button
                        onClick={() => onPreview(doc)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-violet-50 hover:text-violet-600 transition"
                        title="Preview"
                    >
                        <FiEye size={15} />
                    </button>
                    <a href={doc.fileUrl} download target="_blank" rel="noreferrer"
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition"
                        title="Download">
                        <FiDownload size={15} />
                    </a>
                    <button
                        onClick={() => onDelete(doc)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                        title="Delete"
                    >
                        <FiTrash2 size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteConfirm({ doc, onConfirm, onCancel, loading }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
                    <FiTrash2 size={22} className="text-red-500" />
                </div>
                <h3 className="mb-1 text-lg font-bold text-gray-900">Delete Document</h3>
                <p className="text-sm text-gray-500">
                    Are you sure you want to delete <span className="font-semibold text-gray-800">"{doc.name}"</span>? This action cannot be undone.
                </p>
                <div className="mt-5 flex gap-2">
                    <button onClick={onCancel}
                        className="flex-1 rounded-xl border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={loading}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60 transition">
                        {loading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : null}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function DocumentsPage() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeType, setActiveType] = useState("All");
    const [search, setSearch] = useState("");
    const [showUpload, setShowUpload] = useState(false);
    const [previewDoc, setPreviewDoc] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchDocuments = async (type = activeType) => {
        try {
            setLoading(true);
            const res = await getDocuments(type);
            setDocuments(res.data.data || []);
        } catch {
            setError("Failed to load documents.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDocuments(activeType); }, [activeType]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteDocument(deleteTarget._id);
            setDocuments(prev => prev.filter(d => d._id !== deleteTarget._id));
            setDeleteTarget(null);
        } catch {
            alert("Failed to delete document.");
        } finally {
            setDeleting(false);
        }
    };

    const filtered = documents.filter(d =>
        !search || d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.description?.toLowerCase().includes(search.toLowerCase()) ||
        d.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="min-h-full bg-gray-50 p-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
                        <p className="mt-1 text-gray-500">Manage PPTs, PDFs, Datasets, Research Papers and more.</p>
                    </div>
                    <button
                        id="upload-document-btn"
                        onClick={() => setShowUpload(true)}
                        className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition shadow-sm"
                    >
                        <FiPlus size={16} /> Upload Document
                    </button>
                </div>

                {/* Filter Tabs + Search */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                        {FILE_TYPES.map(type => (
                            <button
                                key={type}
                                onClick={() => setActiveType(type)}
                                className={`rounded-xl px-4 py-2 text-sm font-medium transition
                                    ${activeType === type
                                        ? "bg-violet-600 text-white shadow-sm"
                                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-56 rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200"
                        />
                    </div>
                </div>

                {/* Content */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-violet-600" />
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">{error}</div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div className="py-20 text-center">
                        <FiUploadCloud size={48} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium text-gray-400">No documents found</p>
                        <p className="text-sm text-gray-400 mt-1">
                            {search ? "Try a different search term." : "Upload your first document to get started."}
                        </p>
                    </div>
                )}

                {!loading && !error && filtered.length > 0 && (
                    <>
                        <p className="mb-4 text-xs text-gray-400">{filtered.length} document{filtered.length !== 1 ? "s" : ""}</p>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filtered.map(doc => (
                                <DocumentCard
                                    key={doc._id}
                                    doc={doc}
                                    onPreview={setPreviewDoc}
                                    onDelete={setDeleteTarget}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Modals */}
            {showUpload && (
                <UploadModal onClose={() => setShowUpload(false)} onSuccess={() => fetchDocuments(activeType)} />
            )}
            {previewDoc && (
                <PreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
            )}
            {deleteTarget && (
                <DeleteConfirm
                    doc={deleteTarget}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                    loading={deleting}
                />
            )}
        </div>
    );
}
