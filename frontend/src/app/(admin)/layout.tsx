'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, LogOut, Bell, Search, Hexagon } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setIsClient(true);
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
        } else {
            fetchNotifications(token);
            const interval = setInterval(() => fetchNotifications(token), 10000);
            return () => clearInterval(interval);
        }
    }, [router]);

    const fetchNotifications = async (token: string) => {
        try {
            const res = await fetch('http://localhost:8000/api/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const unreadCount = notifications.filter((n: any) => !n.is_read).length;

    const handleToggleNotifications = () => {
        const token = localStorage.getItem('token');
        if (!showNotifications && unreadCount > 0 && token) {
            fetch('http://localhost:8000/api/notifications/read', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch(console.error);
            
            setNotifications(notifications.map((n: any) => ({ ...n, is_read: true })));
        }
        setShowNotifications(!showNotifications);
    };

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
                    <span className="font-bold text-xl tracking-tight uppercase">EMSITPRO</span>
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

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
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
                    
                    <div className="pt-4 pb-1 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Operational
                    </div>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900">
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        Orders <span className="ml-auto bg-slate-100 text-slate-500 py-0.5 px-2 rounded-full text-[10px]">Soon</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900">
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        Customers <span className="ml-auto bg-slate-100 text-slate-500 py-0.5 px-2 rounded-full text-[10px]">Soon</span>
                    </a>

                    <div className="pt-4 pb-1 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        System
                    </div>
                    <Link 
                        href="/logs" 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${pathname === '/logs' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Activity Logs
                    </Link>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900">
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        Settings <span className="ml-auto bg-slate-100 text-slate-500 py-0.5 px-2 rounded-full text-[10px]">Soon</span>
                    </a>
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
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={handleToggleNotifications} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all relative">
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#F8F9FA]"></span>
                                )}
                            </button>
                            
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50">
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-4 text-center text-sm text-slate-500">No notifications yet</div>
                                        ) : (
                                            notifications.map((notif: any) => (
                                                <div key={notif.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${notif.is_read ? 'bg-white' : 'bg-orange-50/50'}`}>
                                                    <p className={`text-sm ${notif.is_read ? 'text-slate-600' : 'text-slate-800 font-medium'}`}>{notif.message}</p>
                                                    <span className="text-xs text-slate-400 mt-1 block">{new Date(notif.created_at).toLocaleString('id-ID')}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
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
