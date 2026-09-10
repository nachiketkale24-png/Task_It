import { formatDistanceToNow } from 'date-fns';
import { FiClock, FiActivity } from 'react-icons/fi';

export default function ActivityFeedWidget({ activities }) {
    if (!activities || activities.length === 0) {
        return (
            <div className="ui-card p-5">
                <h3 className="mb-4 text-lg font-semibold text-[var(--title-color)]">Activity Feed</h3>
                <p className="text-sm text-[var(--subtitle-color)]">No recent activity.</p>
            </div>
        );
    }

    return (
        <div className="ui-card flex h-full flex-col p-5">
            <div className="flex items-center gap-2 mb-4">
                <FiActivity className="text-[var(--muted-color)]" />
                <h3 className="text-lg font-semibold text-[var(--title-color)]">Activity Feed</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2">
                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex gap-4 relative">
                            {/* Timeline line */}
                            <div className="absolute left-[11px] top-6 bottom-[-16px] w-px bg-[var(--border-color)] last:hidden"></div>
                            
                            <div className="relative z-10 mt-1 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--surface-card)]">
                                <div className="h-2 w-2 rounded-full bg-[var(--accent)]"></div>
                            </div>
                            
                            <div className="flex-1 pb-1">
                                <p className="text-sm text-[var(--title-color)]">
                                    <span className="font-semibold">{activity.actionBy}</span> updated task <span className="font-medium text-[var(--title-color)]">"{activity.title}"</span> to <span className="ui-badge badge-neutral">{activity.status}</span>
                                </p>
                                <div className="mt-1 flex items-center gap-1 text-xs text-[var(--subtitle-color)]">
                                    <FiClock />
                                    <span>{formatDistanceToNow(new Date(activity.updatedAt), { addSuffix: true })}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}







