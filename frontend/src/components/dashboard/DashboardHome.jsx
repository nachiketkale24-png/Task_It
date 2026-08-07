export default function DashboardHome() {
    return (
        <div className="p-10">

            <h1 className="text-4xl font-bold">
                Welcome Back 👋
            </h1>

            <p className="mt-3 text-gray-500">
                Here's what's happening in your workspace.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">

                <div className="rounded-2xl border bg-white p-6 shadow-sm">

                    <h2 className="text-gray-500">
                        Teams
                    </h2>

                    <p className="mt-3 text-4xl font-bold">
                        3
                    </p>

                </div>

                <div className="rounded-2xl border bg-white p-6 shadow-sm">

                    <h2 className="text-gray-500">
                        Tasks
                    </h2>

                    <p className="mt-3 text-4xl font-bold">
                        18
                    </p>

                </div>

                <div className="rounded-2xl border bg-white p-6 shadow-sm">

                    <h2 className="text-gray-500">
                        Projects
                    </h2>

                    <p className="mt-3 text-4xl font-bold">
                        5
                    </p>

                </div>

            </div>

        </div>
    );
}