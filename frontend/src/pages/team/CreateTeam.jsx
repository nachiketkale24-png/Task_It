import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

import { createTeam } from "../../services/teamService";

export default function CreateTeam() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        teamName: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.teamName.trim()) {
            setError("Team name is required");
            return;
        }

        try {
            setLoading(true);
            const response = await createTeam(formData);
            navigate(`/teams/${response.data._id}`);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Failed to create team."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="mx-auto max-w-2xl">
                <Link
                    to="/teams"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
                >
                    <FiArrowLeft />
                    Back to teams
                </Link>

                <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                    <h1 className="text-3xl font-bold">
                        Create Team
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Start a workspace for projects, tasks, and members.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-6"
                    >
                        <div>
                            <label className="mb-2 block font-medium">
                                Team Name
                            </label>

                            <input
                                name="teamName"
                                value={formData.teamName}
                                onChange={handleChange}
                                placeholder="Frontend Team"
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium">
                                Description
                            </label>

                            <textarea
                                name="description"
                                rows={5}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="What does this team work on?"
                                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                            />
                        </div>

                        {error && (
                            <p className="text-red-500">
                                {error}
                            </p>
                        )}

                        <div className="flex justify-end gap-4">
                            <Link
                                to="/teams"
                                className="rounded-xl border border-gray-300 px-5 py-3 hover:bg-gray-50"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl bg-black px-6 py-3 text-white hover:bg-gray-800 disabled:opacity-60"
                            >
                                {loading ? "Creating..." : "Create Team"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
