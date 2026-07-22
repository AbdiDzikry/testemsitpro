'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, LogOut } from 'lucide-react';

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
        <div className="flex min-h-screen bg-slate-50">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-slate-800 text-white font-bold text-xl">
                    Emsitpro
                </div>
                <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
                    <Link 
                        href="/dashboard" 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded transition ${pathname === '/dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link 
                        href="/products" 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded transition ${pathname === '/products' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Package size={20} />
                        Products
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button 
                        onClick={handleLogout} 
                        className="flex w-full items-center justify-center gap-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white py-2.5 rounded transition"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-8 text-slate-800 h-screen overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
