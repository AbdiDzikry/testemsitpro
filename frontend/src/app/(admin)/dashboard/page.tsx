'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '@/lib/api';

export default function DashboardPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/dashboard/stats')
           .then(res => {
               setData(res.data);
               setLoading(false);
           })
           .catch(err => {
               console.error(err);
               setLoading(false);
           });
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-full text-slate-500">Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-slate-800">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {data.map((item: any) => (
                    <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                        <div className="text-slate-500 text-sm font-medium mb-2">{item.name}</div>
                        <div className="text-3xl font-bold text-slate-800">{item.products_count} <span className="text-lg font-normal text-slate-500">Products</span></div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 h-96 pb-12">
                <h2 className="text-lg font-semibold mb-6 text-slate-800">Products by Category</h2>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="products_count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
