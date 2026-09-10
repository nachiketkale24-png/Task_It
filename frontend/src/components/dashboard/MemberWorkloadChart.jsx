import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MemberWorkloadChart({ data }) {
    if (!data || data.length === 0) return null;

    return (
        <div className="ui-card flex h-[350px] flex-col p-5">
            <h3 className="mb-4 text-lg font-semibold text-[var(--title-color)]">Member Workload</h3>
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--subtitle-color)" }} axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "var(--subtitle-color)" }} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: "var(--hover-bg)" }} contentStyle={{ borderRadius: 8, borderColor: "var(--border-color)" }} />
                        <Bar dataKey="taskCount" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Active Tasks" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}







