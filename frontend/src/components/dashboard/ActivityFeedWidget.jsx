import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FiClock, FiActivity } from 'react-icons/fi';

export default function ActivityFeedWidget({ activities }) {
    if (!activities || activities.length === 0) {
        return (
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Feed</h3>
                <p className="text-gray-500 text-sm">No recent activity.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
                <FiActivity className="text-gray-400" />
                <h3 className="text-lg font-bold text-gray-900">Activity Feed</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2">
                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex gap-4 relative">
                            {/* Timeline line */}
                            <div className="absolute left-[11px] top-6 bottom-[-16px] w-[2px] bg-gray-100 last:hidden"></div>
                            
                            <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 border border-blue-200 mt-1">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            </div>
                            
                            <div className="flex-1 pb-1">
                                <p className="text-sm text-gray-900">
                                    <span className="font-semibold">{activity.actionBy}</span> updated task <span className="font-medium text-blue-600">"{activity.title}"</span> to <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">{activity.status}</span>
                                </p>
                                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
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
