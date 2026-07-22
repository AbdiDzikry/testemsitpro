'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, LogOut, Bell, Search, Hexagon } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    if (!isClient) return null;

    return (
        <div className="flex h-screen bg-[#F8F9FA] text-slate-800 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-[260px] bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
                <div className="h-20 flex items-center px-6 gap-3">
                    <div className="text-orange-500">
                        <Hexagon size={28} fill="currentColor" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">Emsitpro</span>
                </div>

                <div className="px-6 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search" 
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                        />
                    </div>
                </div>

                <div className="px-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Menu Utama
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    <Link 
                        href="/dashboard" 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${pathname === '/dashboard' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </Link>
                    <Link 
                        href="/products" 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${pathname === '/products' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                        <Package size={18} />
                        Products
                    </Link>
                </nav>

                <div className="p-4 mt-auto">
                    <button 
                        onClick={handleLogout} 
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-20 bg-[#F8F9FA] flex items-center justify-between px-8 flex-shrink-0">
                    <div className="flex items-center text-sm font-medium text-slate-500">
                        Home <span className="mx-2 text-slate-300">/</span> 
                        <span className="text-slate-900 capitalize">{pathname.replace('/', '')}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
                            <Bell size={20} />
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-semibold text-slate-900">Admin</div>
                                <div className="text-xs text-slate-500">Administrator</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 px-8 pb-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
