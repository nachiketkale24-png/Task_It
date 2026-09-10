import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function TaskStatusChart({ data }) {
    if (!data || data.length === 0) return null;

    return (
        <div className="ui-card flex h-[350px] flex-col p-5">
            <h3 className="mb-4 text-lg font-semibold text-[var(--title-color)]">Task Status</h3>
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color || ["#111827", "#6B7280", "#9CA3AF", "#D1D5DB"][index % 4]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: 8, borderColor: "var(--border-color)", color: "var(--title-color)" }} />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}







