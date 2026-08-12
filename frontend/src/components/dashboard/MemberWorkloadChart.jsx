import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MemberWorkloadChart({ data }) {
    if (!data || data.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-2xl border shadow-sm h-[350px] flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Member Workload</h3>
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                        <Tooltip cursor={{ fill: '#f3f4f6' }} />
                        <Bar dataKey="taskCount" fill="#6366f1" radius={[4, 4, 0, 0]} name="Active Tasks" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
