import { useCallback, useEffect, useState } from "react";
import { FiPlus, FiRefreshCw, FiUsers } from "react-icons/fi";

import { getTeams } from "../../services/teamService";

import TeamCard from "../../components/team/TeamCard";
import EmptyState from "../../components/team/EmptyState";
import CreateTeamModal from "../../components/team/CreateTeamModal";

export default function TeamList() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);

    const fetchTeams = useCallback(async () => {
        try {
            setError("");
            const data = await getTeams();
            setTeams(data.data);
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                    "Failed to load teams."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);

    const totalMembers = teams.reduce(
        (count, team) => count + (team.members?.length || 0),
        0
    );

    const handleRefresh = () => {
        setRefreshing(true);
        fetchTeams();
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="h-9 w-40 animate-pulse rounded-lg bg-gray-200" />
                <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-44 animate-pulse rounded-xl border border-gray-200 bg-white"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8 flex flex-col gap-5 border-b border-gray-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        Workspace
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-gray-900">
                        Teams
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Create, open, and manage your collaboration spaces.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
                        <FiUsers className="text-gray-400" />
                        <span>
                            {teams.length} teams
                        </span>
                        <span className="h-4 w-px bg-gray-200" />
                        <span>
                            {totalMembers} members
                        </span>
                    </div>

                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-700 hover:bg-gray-100 disabled:opacity-60"
                        title="Refresh teams"
                    >
                        <FiRefreshCw
                            className={refreshing ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>

                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-white hover:bg-gray-800"
                    >
                        <FiPlus />
                        New Team
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-red-600">
                    {error}
                </div>
            )}

            {teams.length === 0 ? (
                <EmptyState onCreate={() => setShowModal(true)} />
            ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                    {teams.map((team) => (
                        <TeamCard
                            key={team._id}
                            team={team}
                        />
                    ))}

                </div>
            )}

            {showModal && (
                <CreateTeamModal
                    close={() => setShowModal(false)}
                    refresh={fetchTeams}
                />
            )}

        </div>
    );
}
