import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../utils";
import { format } from "date-fns";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from "recharts";

type Log = {
    _id: string;
    userId: { _id: string; username: string | null; email: string; role: string } | null;
    event_type: string;
    severity: number;
    ip: string;
    details: string;
    createdAt: string;
};

const severityColor = (level: number) => {
    switch (level) {
        case 1:
            return "bg-gradient-to-r from-green-400 to-green-600";
        case 2:
            return "bg-gradient-to-r from-yellow-400 to-yellow-600";
        case 3:
            return "bg-gradient-to-r from-orange-400 to-orange-600";
        case 4:
            return "bg-gradient-to-r from-red-400 to-red-600";
        case 5:
            return "bg-gradient-to-r from-purple-400 to-purple-600";
        default:
            return "bg-gray-500";
    }
};

const severityHex = (level: number) => {
    switch (level) {
        case 1:
            return "#22c55e";
        case 2:
            return "#eab308";
        case 3:
            return "#f97316";
        case 4:
            return "#ef4444";
        case 5:
            return "#8b5cf6";
        default:
            return "#6b7280";
    }
};

const Dashboard = () => {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BACKEND_URL}/logs`, {
                    withCredentials: true,
                });
                setLogs(response.data.logs);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    // Safe filtering
    const filteredLogs = logs.filter(
        (log) =>
            log.userId?.username?.toLowerCase().includes(search.toLowerCase()) ||
            log.event_type.toLowerCase().includes(search.toLowerCase()) ||
            log.ip.includes(search)
    );

    // Aggregate severity data
    const severityData = [1, 2, 3, 4, 5].map((level) => ({
        name: `Severity ${level}`,
        value: logs.filter((log) => log.severity === level).length,
        color: severityHex(level),
    }));

    // Aggregate event type data
    const eventTypeData = Object.entries(
        logs.reduce((acc: Record<string, number>, log) => {
            acc[log.event_type] = (acc[log.event_type] || 0) + 1;
            return acc;
        }, {})
    ).map(([key, value]) => ({ name: key.replace("_", " "), value }));

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
            <h1 className="text-3xl font-bold mb-6 text-center">Admin SIEM Dashboard</h1>

            {/* Search */}
            <div className="mb-6 flex justify-end">
                <input
                    type="text"
                    placeholder="Search by user, event, or IP..."
                    className="p-2 text-white rounded-lg border border-white w-full md:w-1/3"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
                    <h2 className="font-semibold mb-4 text-lg">Logs by Severity</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={severityData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={80}
                            >
                                {severityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
                    <h2 className="font-semibold mb-4 text-lg">Logs by Event Type</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={eventTypeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Logs Table */}
            <div className="overflow-x-auto rounded-xl shadow-lg bg-gray-800 p-4">
                <table className="min-w-full table-auto text-left">
                    <thead className="bg-gray-700 text-gray-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-2">Time</th>
                            <th className="px-4 py-2">User</th>
                            <th className="px-4 py-2">Event</th>
                            <th className="px-4 py-2">Details</th>
                            <th className="px-4 py-2">Severity</th>
                            <th className="px-4 py-2">IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map((log) => (
                            <tr
                                key={log._id}
                                className="border-b border-gray-700 hover:bg-gray-700 transition-all"
                            >
                                <td className="px-4 py-2">
                                    {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm:ss")}
                                </td>
                                <td className="px-4 py-2">
                                    <div className="flex flex-col">
                                        <span className="font-semibold">
                                            {log.userId?.username || log.userId?._id || "Unknown"}
                                        </span>
                                        <span className="text-gray-400 text-sm">
                                            {log.userId?.email || "N/A"}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-2 capitalize">
                                    {log.event_type.replace("_", " ")}
                                </td>
                                <td className="px-4 py-2 text-gray-300">{log.details}</td>
                                <td className="px-4 py-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${severityColor(
                                            log.severity
                                        )}`}
                                    >
                                        {log.severity}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-gray-400">{log.ip}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredLogs.length === 0 && (
                    <p className="text-center text-gray-400 mt-4">No logs found</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
