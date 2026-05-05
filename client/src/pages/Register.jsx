import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Mail, Lock, User, ArrowRight } from 'lucide-react';
import LetterGlitch from '../components/LetterGlitch';
import toast, { Toaster } from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/register', formData);
            
            toast.success("Registration Successful! Redirecting to login...", {
                style: {
                    background: 'white',
                    color: '#10b981',
                    border: '1px solid #047857',
                    fontWeight: '900',
                    fontSize: '12px',
                    padding: '16px',
                    borderRadius: '20px',
                    maxWidth: '450px'
                },
                duration: 4000
            });

            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        } catch (err) {
            toast.error(err.response?.data?.error || "Registration Failed", {
                style: {
                    background: '#ef4444',
                    color: '#090d16',
                    border: '1px solid #7f1d1d',
                    fontWeight: '900',
                    fontSize: '12px',
                    padding: '16px',
                    borderRadius: '20px',
                    maxWidth: '450px'
                },
                duration: 4000
            });
        }
    };

    return (
        <div className="relative w-full h-screen text-white overflow-hidden font-sans">
            {/* Toast Container */}
            <Toaster position="top-right" reverseOrder={false} />

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
                <div className="w-full max-w-md bg-slate-950/80 border border-t-5 border-b-1 border-emerald-400 border-l-0 border-r-0 p-6 md:p-8 rounded-[28px] backdrop-blur-2xl shadow-2xl pointer-events-auto">
                    
                    {/* Heading */}
                    <div className="text-center mb-6">
                        <UserPlus className="mx-auto text-emerald-400 mb-2 animate-pulse" size={32} />
                        <h1 className="text-xl font-black tracking-tight text-white uppercase">Create Account</h1>
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-0.5">Join the Multi-Cloud DR Network</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <div className="relative flex items-center">
                                <User className="absolute left-4 text-slate-500" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Full Name" 
                                    required 
                                    className="w-full bg-slate-900 text-white border border-slate-800 rounded-2xl pl-12 p-3.5 text-xs outline-none focus:border-blue-600 transition" 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="relative flex items-center">
                                <Mail className="absolute left-4 text-slate-500" size={16} />
                                <input 
                                    type="email" 
                                    placeholder="name@company.com" 
                                    required 
                                    className="w-full bg-slate-900 text-white border border-slate-800 rounded-2xl pl-12 p-3.5 text-xs outline-none focus:border-blue-600 transition" 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="relative flex items-center">
                                <Lock className="absolute left-4 text-slate-500" size={16} />
                                <input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    required 
                                    className="w-full bg-slate-900 text-white border border-slate-800 rounded-2xl pl-12 p-3.5 text-xs outline-none focus:border-blue-600 transition" 
                                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <select 
                                className="w-full bg-slate-900 text-slate-300 border border-slate-800 rounded-2xl p-3.5 text-xs outline-none focus:border-blue-600 transition" 
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="user">Standard User</option>
                                <option value="admin">System Admin</option>
                            </select>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs tracking-widest uppercase p-3.5 rounded-2xl transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3 shadow-2xl mt-6"
                        >
                            Register System <ArrowRight size={14} />
                        </button>
                    </form>
                    
                    <p className="text-[12px] text-slate-600 text-center font-bold mt-6 uppercase tracking-widest">
                        Already have an account? <Link to="/login" className="text-md font-extrabold text-blue-400 hover:underline animate-pulse">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default Register;