import React from 'react';
import { FiBriefcase, FiCheckSquare, FiUsers } from 'react-icons/fi';

export default function StatCards({ stats }) {
    if (!stats) return null;

    const cards = [
        {
            title: "Projects",
            value: stats.projects,
            icon: <FiBriefcase size={24} className="text-blue-500" />,
            bgColor: "bg-blue-50"
        },
        {
            title: "Tasks",
            value: stats.tasks,
            icon: <FiCheckSquare size={24} className="text-green-500" />,
            bgColor: "bg-green-50"
        },
        {
            title: "Teams",
            value: stats.teams,
            icon: <FiUsers size={24} className="text-purple-500" />,
            bgColor: "bg-purple-50"
        }
    ];

    return (
        <div className="grid gap-6 md:grid-cols-3">
            {cards.map((card, index) => (
                <div key={index} className="flex items-center p-6 bg-white rounded-2xl border shadow-sm">
                    <div className={`p-4 rounded-xl ${card.bgColor}`}>
                        {card.icon}
                    </div>
                    <div className="ml-5">
                        <h2 className="text-gray-500 text-sm font-medium">{card.title}</h2>
                        <p className="mt-1 text-3xl font-bold text-gray-900">{card.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
