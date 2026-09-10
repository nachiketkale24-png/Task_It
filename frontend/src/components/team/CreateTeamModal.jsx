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

            <div className="w-full max-w-lg rounded-lg bg-[var(--surface-card)] p-8 ">

                <div className="mb-8 flex items-center justify-between">

                    <div>

                        <h2 className="text-2xl font-bold">
                            Create Team
                        </h2>

                        <p className="mt-1 text-[var(--subtitle-color)]">
                            Create a workspace for your members.
                        </p>

                    </div>

                    <button
                        onClick={close}
                        className="rounded-lg p-2 hover:bg-[var(--hover-bg)]"
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
                            className="w-full rounded-md border border-[var(--border-color)] px-4 py-3 outline-none focus:border-[var(--title-color)] focus:ring-2 focus:ring-gray-200"
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
                            className="w-full resize-none rounded-md border border-[var(--border-color)] px-4 py-3 outline-none focus:border-[var(--title-color)] focus:ring-2 focus:ring-gray-200"
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
                            className="rounded-md border border-[var(--border-color)] px-5 py-3"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-md bg-[var(--accent)] px-6 py-3 text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)] disabled:opacity-60"
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





