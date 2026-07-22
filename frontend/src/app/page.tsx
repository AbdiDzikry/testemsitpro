'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
            const res = await api.post('/login', { email, password });
            localStorage.setItem('token', res.data.access_token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Email atau password salah. Silakan coba lagi.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#F8F9FA] font-sans">
            <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Emsitpro</h1>
                    <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
                </div>
                
                {error && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 transition-all"
                            placeholder="admin123@email.com"
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                            <a 
                                href="#" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowToast(true);
                                    setTimeout(() => setShowToast(false), 3500);
                                }}
                                className="text-xs font-medium text-orange-500 hover:text-orange-600"
                            >
                                Forgot password?
                            </a>
                        </div>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 transition-all"
                                placeholder="••••••••"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="pt-2">
                        <button 
                            type="submit" 
                            className="w-full bg-orange-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-orange-600 transition-all shadow-sm shadow-orange-500/20"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>

            {/* Forgot Password Toast Notification */}
            {showToast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-[slideIn_0.3s_ease-out]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span className="text-sm font-medium">Permintaan reset password telah dikirimkan ke email Anda.</span>
                </div>
            )}

            <div className="fixed bottom-6 text-[12px] text-slate-400 text-center">
                &copy; {new Date().getFullYear()} Emsitpro Inventory. All rights reserved.<br/>
                Designed & Built by <a href="https://www.linkedin.com/in/sulthan-abdi-dzikry/" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-500 hover:text-orange-500 hover:underline transition-colors">Sulthan Abdi Dzikry</a>
            </div>
        </div>
    );
}
