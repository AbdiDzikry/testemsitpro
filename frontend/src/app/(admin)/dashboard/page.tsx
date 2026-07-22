'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package } from 'lucide-react';
import Link from 'next/link';
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

    const handleExport = async () => {
        try {
            const response = await api.get('/products/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'products.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            console.error('Export error', e);
            alert('Failed to export data');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full text-slate-500">Loading...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
                <div className="flex gap-3">
                    <button onClick={handleExport} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all">
                        Export Report
                    </button>
                    <Link href="/products" className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-all shadow-sm shadow-orange-500/20">
                        New Product
                    </Link>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {data.map((item: any) => (
                    <div key={item.id} className="bg-white p-5 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between h-32">
                        <div className="flex justify-between items-start">
                            <div className="text-slate-500 text-sm font-medium">{item.name}</div>
                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                                <Package size={16} />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-slate-800">{item.products_count}</div>
                            <div className="text-xs text-slate-400 mt-1">Total produk aktif saat ini</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 min-h-[420px] h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-800">Products Overview</h2>
                        <select className="bg-white border border-slate-200 text-slate-500 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-500">
                            <option>Monthly</option>
                            <option>Weekly</option>
                        </select>
                    </div>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <Tooltip cursor={{fill: '#f8fafc'}} formatter={(value) => [value, 'Total Produk']} contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', color: '#475569'}} itemStyle={{color: '#475569', fontWeight: 600}} />
                                <Bar dataKey="products_count" name="Total Produk" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 min-h-[420px] h-full flex flex-col">
                    <h2 className="text-lg font-bold text-slate-800 mb-2">Category Status</h2>
                    <p className="text-sm text-slate-500 mb-8">Distribution of products across categories</p>
                    
                    <div className="flex-1 flex flex-col justify-center h-full">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="products_count"
                                    nameKey="name"
                                >
                                    {data.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'][index % 5]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [`${value} Produk`, name]} contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', color: '#475569'}} itemStyle={{color: '#475569', fontWeight: 600}} />
                            </PieChart>
                        </ResponsiveContainer>
                        
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            {data.map((item: any, i: number) => (
                                <div key={item.id} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'][i % 5] }}></div>
                                    <span className="text-xs font-medium text-slate-600 truncate" title={item.name}>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
