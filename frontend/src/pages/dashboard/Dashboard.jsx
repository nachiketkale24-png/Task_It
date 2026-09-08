import DashboardHome from "../../components/dashboard/DashboardHome";
import TeamList from "../team/TeamList";
import TaskList from "../tasks/TaskList";


export default function Dashboard() {
    const [activePage, setActivePage] = useState("dashboard");

    const renderPage = () => {
        switch (activePage) {
            case "dashboard":
                return <DashboardHome />;

            case "teams":
                return <TeamList />;

            case "tasks":
                return <TaskList />;

            default:
                return <DashboardHome />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">

            <Sidebar
                activePage={activePage}
                setActivePage={setActivePage}
            />

            <main className="flex-1 overflow-y-auto">
                {renderPage()}
            </main>

        </div>
    );
}