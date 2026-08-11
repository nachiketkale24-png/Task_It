import { FiPlus, FiUsers } from "react-icons/fi";

export default function EmptyState({ onCreate }) {
    return (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                <FiUsers size={26} />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-gray-900">
                No Teams Yet
            </h2>

            <p className="mt-2 max-w-sm text-gray-500">
                Create your first team to start collaborating.
            </p>

            <button
                onClick={onCreate}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-white hover:bg-gray-800"
            >
                <FiPlus />
                New Team
            </button>

        </div>
    );
}
