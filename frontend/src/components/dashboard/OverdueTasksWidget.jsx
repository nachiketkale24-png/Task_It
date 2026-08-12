import React from 'react';
import { format } from 'date-fns';
import { FiAlertCircle, FiCalendar } from 'react-icons/fi';

export default function OverdueTasksWidget({ overdue, upcoming }) {
    return (
        <div className="bg-white rounded-2xl border shadow-sm flex flex-col h-full overflow-hidden">
            
            {/* Overdue Section */}
            <div className="p-6 border-b">
                <div className="flex items-center gap-2 mb-4">
                    <FiAlertCircle className="text-red-500" />
                    <h3 className="text-lg font-bold text-gray-900">Overdue Tasks</h3>
                </div>
                
                {!overdue || overdue.length === 0 ? (
                    <p className="text-sm text-gray-500">No overdue tasks! 🎉</p>
                ) : (
                    <div className="space-y-3">
                        {overdue.map(task => (
                            <div key={task._id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{task.title}</p>
                                    <p className="text-xs text-red-600 font-medium">Due: {format(new Date(task.deadline), 'MMM d, yyyy')}</p>
                                </div>
                                <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800">
                                    Overdue
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Upcoming Deadlines Section */}
            <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <FiCalendar className="text-blue-500" />
                    <h3 className="text-lg font-bold text-gray-900">Upcoming Deadlines (7 Days)</h3>
                </div>
                
                {!upcoming || upcoming.length === 0 ? (
                    <p className="text-sm text-gray-500">No immediate deadlines.</p>
                ) : (
                    <div className="space-y-3">
                        {upcoming.map(task => (
                            <div key={task._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{task.title}</p>
                                    <p className="text-xs text-gray-500">Due: {format(new Date(task.deadline), 'MMM d, yyyy')}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded ${task.priority === 'High' || task.priority === 'Critical' ? 'bg-orange-100 text-orange-800' : 'bg-gray-200 text-gray-800'}`}>
                                    {task.priority}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
