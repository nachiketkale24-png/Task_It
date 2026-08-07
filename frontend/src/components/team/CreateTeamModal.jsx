import { useState } from "react";
import { FiX } from "react-icons/fi";
import { createTeam } from "../../services/teamService";

export default function CreateTeamModal({
    close,
    refresh,
}) {

    const [teamName, setTeamName] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!teamName.trim()) {
            setError("Team name is required");
            return;
        }

        try {

            setLoading(true);
            setError("");

            await createTeam({
                teamName,
                description,
            });

            await refresh();

            close();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to create team."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">

                <div className="mb-8 flex items-center justify-between">

                    <div>

                        <h2 className="text-2xl font-bold">
                            Create Team
                        </h2>

                        <p className="mt-1 text-gray-500">
                            Create a workspace for your members.
                        </p>

                    </div>

                    <button
                        onClick={close}
                        className="rounded-lg p-2 hover:bg-gray-100"
                    >
                        <FiX size={22} />
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    <div>

                        <label className="mb-2 block font-medium">

                            Team Name

                        </label>

                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) =>
                                setTeamName(e.target.value)
                            }
                            placeholder="Backend Team"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block font-medium">

                            Description

                        </label>

                        <textarea
                            rows={4}
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            placeholder="What is this team for?"
                            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                        />

                    </div>

                    {error && (

                        <p className="text-red-500">

                            {error}

                        </p>

                    )}

                    <div className="flex justify-end gap-4">

                        <button
                            type="button"
                            onClick={close}
                            className="rounded-xl border border-gray-300 px-5 py-3"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-black px-6 py-3 text-white hover:bg-gray-800 disabled:opacity-60"
                        >

                            {loading
                                ? "Creating..."
                                : "Create Team"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}