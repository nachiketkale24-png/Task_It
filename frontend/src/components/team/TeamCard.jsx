import { FiArrowRight, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function TeamCard({ team }) {
    const memberCount = team.members?.length || 0;
    const ownerName = team.owner?.fullName || "Owner";

    return (
        <Link
            to={`/teams/${team._id}`}
            className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white">
                        <FiUsers size={20} />
                    </div>

                    <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold text-gray-900">
                            {team.teamName}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Owned by {ownerName}
                        </p>
                    </div>
                </div>

                <FiArrowRight className="mt-3 shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-gray-700" />
            </div>

            <p className="mt-5 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
                {team.description || "No description added yet."}
            </p>

            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">

                <div className="flex items-center gap-2 text-sm text-gray-600">

                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-700">
                        {memberCount}
                    </span>

                    <span>
                        {memberCount === 1 ? "Member" : "Members"}
                    </span>

                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                    {memberCount === 1 ? "Solo" : "Active"}
                </span>

            </div>

        </Link>
    );
}
