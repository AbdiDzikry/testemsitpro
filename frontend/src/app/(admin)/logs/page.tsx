'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Activity, Clock } from 'lucide-react';

export default function LogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get('/notifications');
                setLogs(res.data);
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        };
        fetchLogs();
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 p-6 min-h-[calc(100vh-4rem)]">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                    <Activity size={20} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-800 tracking-tight">System Activity Logs</h1>
                    <p className="text-sm text-slate-500">Track all system activities, data modifications, and events.</p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-500">Loading logs...</div>
            ) : logs.length === 0 ? (
                <div className="text-center py-10 text-slate-500">No activity recorded yet.</div>
            ) : (
                <div className="relative border-l border-slate-200 ml-3 md:ml-6 space-y-8 pb-4">
                    {logs.map((log: any) => {
                        // Attempt to parse action type for coloring
                        let type = 'info';
                        if (log.message.toLowerCase().includes('added') || log.message.toLowerCase().includes('created')) type = 'success';
                        if (log.message.toLowerCase().includes('updated')) type = 'warning';
                        if (log.message.toLowerCase().includes('deleted')) type = 'danger';

                        const colorClasses = {
                            info: 'bg-blue-100 text-blue-600 border-blue-200',
                            success: 'bg-emerald-100 text-emerald-600 border-emerald-200',
                            warning: 'bg-amber-100 text-amber-600 border-amber-200',
                            danger: 'bg-red-100 text-red-600 border-red-200',
                        }[type];

                        return (
                            <div key={log.id} className="relative pl-6 md:pl-8">
                                <span className={`absolute -left-3 top-1 flex items-center justify-center w-6 h-6 rounded-full border-2 border-white ${colorClasses}`}>
                                    <div className="w-2 h-2 rounded-full bg-current"></div>
                                </span>
                                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                        <h3 className="font-semibold text-slate-800">{log.message}</h3>
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-white px-2.5 py-1 rounded-md border border-slate-100 shadow-sm w-fit">
                                            <Clock size={12} />
                                            {new Date(log.created_at).toLocaleString('id-ID', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        Action performed by <span className="font-medium text-slate-700">Administrator</span> via Dashboard.
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
