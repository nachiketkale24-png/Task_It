import { useCallback, useEffect, useState } from "react";
import {
    FiArrowLeft,
    FiEdit2,
    FiMail,
    FiTrash2,
    FiUserMinus,
    FiUsers,
} from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    deleteTeam,
    getTeam,
    inviteMember,
    leaveTeam,
    removeMember,
} from "../../services/teamService";

const getCurrentUserId = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.id || user?._id) {
            return user.id || user._id;
        }
    } catch {
        // Fall back to the token below when saved user data is missing/stale.
    }

    try {
        const token = localStorage.getItem("token");
        const payload = token?.split(".")[1];

        if (!payload) return null;

        const decoded = JSON.parse(atob(payload));
        return decoded.id || decoded._id || null;
    } catch {
        return null;
    }
};

export default function TeamDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [team, setTeam] = useState(null);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [currentUserId] = useState(getCurrentUserId);

    const isOwner =
        team?.owner?._id === currentUserId ||
        team?.owner === currentUserId;

    const fetchTeam = useCallback(async () => {
        try {
            setError("");
            const response = await getTeam(id);
            setTeam(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Failed to load team."
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchTeam();
    }, [fetchTeam]);

    const handleInvite = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setError("Member email is required");
            return;
        }

        try {
            setActionLoading(true);
            setError("");
            setSuccess("");
            await inviteMember(id, email.trim());
            setEmail("");
            setSuccess("Member added successfully.");
            await fetchTeam();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Failed to invite member."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveMember = async (userId) => {
        if (!confirm("Remove this member from the team?")) return;

        try {
            setActionLoading(true);
            setError("");
            setSuccess("");
            await removeMember(id, userId);
            setSuccess("Member removed successfully.");
            await fetchTeam();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Failed to remove member."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleLeaveTeam = async () => {
        if (!confirm("Leave this team?")) return;

        try {
            setActionLoading(true);
            await leaveTeam(id);
            navigate("/teams");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Failed to leave team."
            );
            setActionLoading(false);
        }
    };

    const handleDeleteTeam = async () => {
        if (!confirm("Delete this team permanently?")) return;

        try {
            setActionLoading(true);
            await deleteTeam(id);
            navigate("/teams");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Failed to delete team."
            );
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-10 text-gray-500">
                Loading Team...
            </div>
        );
    }

    if (!team) {
        return (
            <div className="p-10">
                <p className="text-red-500">
                    {error || "Team not found."}
                </p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mx-auto max-w-5xl">
                <Link
                    to="/teams"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
                >
                    <FiArrowLeft />
                    Back to teams
                </Link>

                <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">
                            Team
                        </p>

                        <h1 className="mt-1 text-3xl font-bold text-gray-900">
                            {team.teamName}
                        </h1>

                        <p className="mt-2 max-w-2xl text-gray-500">
                            {team.description || "No description added yet."}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {isOwner ? (
                            <>
                                <Link
                                    to={`/teams/${id}/edit`}
                                    className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 hover:bg-white"
                                >
                                    <FiEdit2 />
                                    Edit
                                </Link>

                                <button
                                    onClick={handleDeleteTeam}
                                    disabled={actionLoading}
                                    className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-white hover:bg-red-600 disabled:opacity-60"
                                >
                                    <FiTrash2 />
                                    Delete
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleLeaveTeam}
                                disabled={actionLoading}
                                className="rounded-xl border border-red-200 px-4 py-3 text-red-500 hover:bg-red-50 disabled:opacity-60"
                            >
                                Leave Team
                            </button>
                        )}
                    </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Members
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {team.members.length} people in this team
                                </p>
                            </div>

                            <FiUsers className="text-gray-400" size={24} />
                        </div>

                        <div className="divide-y divide-gray-100">
                            {team.members.map((member) => {
                                const user = member.user;
                                const userId = user?._id || user;
                                const isTeamOwner =
                                    userId === (team.owner?._id || team.owner);

                                return (
                                    <div
                                        key={userId}
                                        className="flex items-center justify-between gap-4 py-4"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {user?.fullName || "Team Member"}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {user?.email || "No email available"}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                                                {member.role}
                                            </span>

                                            {isOwner && !isTeamOwner && (
                                                <button
                                                    onClick={() =>
                                                        handleRemoveMember(userId)
                                                    }
                                                    disabled={actionLoading}
                                                    className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-60"
                                                    title="Remove member"
                                                >
                                                    <FiUserMinus />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold">
                            Team Actions
                        </h2>

                        <div className="mt-5 space-y-4">
                            <div className="rounded-xl bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">
                                    Owner
                                </p>

                                <p className="mt-1 font-medium">
                                    {team.owner?.fullName || "Team Owner"}
                                </p>
                            </div>

                            {isOwner && (
                                <form
                                    onSubmit={handleInvite}
                                    className="space-y-3"
                                >
                                    <label className="block font-medium">
                                        Invite Member
                                    </label>

                                    <div className="flex gap-2">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="name@example.com"
                                            className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                        />

                                        <button
                                            type="submit"
                                            disabled={actionLoading}
                                            className="rounded-xl bg-black px-4 py-3 text-white hover:bg-gray-800 disabled:opacity-60"
                                            title="Invite member"
                                        >
                                            <FiMail />
                                        </button>
                                    </div>
                                </form>
                            )}

                            {error && (
                                <p className="text-sm text-red-500">
                                    {error}
                                </p>
                            )}

                            {success && (
                                <p className="text-sm text-green-600">
                                    {success}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
