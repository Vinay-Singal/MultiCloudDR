import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn, Lock, Mail, ArrowRight, HardDrive, Server } from 'lucide-react';
import LetterGlitch from '../components/LetterGlitch';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/login', { email, password });
            localStorage.setItem('user', JSON.stringify(res.data));
            
            toast.success("Login successful! Redirecting...", {
                style: {
                    background: 'white',
                    color: '#10b981',
                    border: '1px solid #047857',
                    fontWeight: '900',
                    fontSize: '11px'
                }
            });

            setTimeout(() => {
                if (res.data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            }, 1000);
            
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed", {
                style: {
                    background: '#090d16',
                    color: '#ef4444',
                    border: '1px solid #7f1d1d',
                    fontWeight: '900',
                    fontSize: '11px'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full h-screen text-white overflow-hidden font-sans">
            {/* Toast Configuration Panel */}
            <Toaster position="top-center" reverseOrder={false} size={'0'}/>

            {/* Background Glitch Canvas Area */}
            <div className="absolute inset-0 z-0">
                <LetterGlitch 
                    glitchSpeed={50}
                    centerVignette={true}
                    outerVignette={false}
                    smooth={true}
                    glitchColors={['#3b82f6', '#10b981', '#6366f1']}
                />
            </div>

            {/* Foreground Content */}
            <div className="relative z-10 flex justify-center items-center h-screen px-6 pointer-events-none">
                <div className="w-full max-w-md bg-slate-950/80 border-t-2 border-b-2 border-emerald-400 p-10 rounded-[35px] backdrop-blur-2xl shadow-2xl pointer-events-auto">
                    
                    {/* Heading */}
                    <div className="mb-8 text-center">
                        <div className='flex justify-center items-center'>
                            <Server className="text-blue-500 mx-auto mb-3 animate-pulse" size={32} />
                            <LogIn className="text-blue-500 mx-auto ml-[-90px] mb-3 animate-pulse" size={32} />
                        </div>
                        
                        <h2 className="text-2xl font-black tracking-tight text-white uppercase">
                            Cloud Sentinel
                        </h2>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">
                            Multi-Cloud DR node login
                        </p>
                    </div>

                    {/* Form Elements */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Work Email
                            </label>
                            <div className="relative flex items-center">
                                <Mail size={16} className="absolute left-4 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-900 text-white border border-slate-800 rounded-2xl pl-12 p-4 text-xs outline-none focus:border-blue-600 transition"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Password
                            </label>
                            <div className="relative flex items-center">
                                <Lock size={16} className="absolute left-4 text-slate-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-900 text-white border border-slate-800 rounded-2xl pl-12 p-4 text-xs outline-none focus:border-blue-600 transition"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs tracking-widest uppercase p-4 rounded-2xl transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3 shadow-2xl mt-8"
                        >
                            {loading ? "Authenticating..." : "Authenticate Node"} <ArrowRight size={14} />
                        </button>
                    </form>

                    <p className="text-sm text-slate-400 text-center font-bold mt-6 uppercase tracking-widest">
                        Don't have an account? <Link to="/register" className="text-emerald-400 font-bold animate-pulse hover:underline">Register Now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;