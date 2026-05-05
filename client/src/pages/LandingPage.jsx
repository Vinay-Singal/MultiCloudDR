import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, Shield, Calculator, ArrowRight, Server, Database, LogIn } from 'lucide-react';
import LetterGlitch from '../components/LetterGlitch';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative w-full h-screen text-white overflow-hidden font-sans">
            
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
            <div className="relative z-10 flex flex-col justify-between h-full max-w-7xl mx-auto px-8 py-10 pointer-events-none">
                
                {/* Header Section */}
                <div className="flex justify-between items-center pointer-events-auto">
                    <div className="flex items-center gap-3 font-black text-2xl tracking-tighter">
                        <Cloud className="text-blue-500 animate-pulse" size={32} />
                        <span>Multi-Cloud <span className="text-blue-500">DR</span></span>
                    </div>
                    
                    <div className="hidden md:flex gap-6 items-center text-xs font-bold tracking-widest uppercase text-slate-300">
                        <span className="hover:text-blue-400 transition cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                        <span className="hover:text-blue-400 transition cursor-pointer" onClick={() => navigate('/calculator')}>Calculator</span>
                        <button 
                            onClick={() => navigate('/')} 
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-[10px] tracking-widest uppercase text-white flex items-center gap-2 shadow-xl"
                        >
                            <LogIn size={14} /> Log In
                        </button>
                    </div>
                </div>

                {/* Hero Center Section */}
                <div className="max-w-3xl flex flex-col gap-6">
                    <span className="text-[10px] font-black text-blue-400 tracking-[0.4em] uppercase bg-blue-600/20 border border-blue-500/30 px-4 py-2 rounded-full w-fit">
                        Enterprise Data Redundancy
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                        Unify Your Cloud <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                            Availability Platform
                        </span>
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
                        Transition seamlessly from on-premise infrastructure to an automated cross-cloud model. 
                        Ensure business continuity with zero-second recovery time.
                    </p>
                    
                    {/* Hero Buttons */}
                    <div className="flex flex-wrap gap-4 pt-4 pointer-events-auto">
                        <button 
                            onClick={() => navigate('/dashboard')} 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs tracking-widest uppercase px-8 py-4 rounded-2xl shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3"
                        >
                            Open Dashboard <ArrowRight size={16} />
                        </button>

                        <button 
                            onClick={() => navigate('/calculator')} 
                            className="bg-slate-900/60 border border-slate-800 text-slate-200 hover:bg-slate-900 font-black text-xs tracking-widest uppercase px-8 py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3"
                        >
                            Cost Estimate <Calculator size={16} />
                        </button>
                    </div>
                </div>

                {/* Footer Features Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pointer-events-auto">
                    <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl backdrop-blur-md flex items-center gap-4">
                        <div className="bg-orange-500/20 p-3 rounded-2xl text-orange-400"><HardDrive size={24} /></div>
                        <div>
                            <h4 className="text-xs font-black tracking-wider uppercase">AWS S3 Primary</h4>
                            <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">High Performance Storage</p>
                        </div>
                    </div>
                    
                    <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl backdrop-blur-md flex items-center gap-4">
                        <div className="bg-blue-500/20 p-3 rounded-2xl text-blue-400"><Database size={24} /></div>
                        <div>
                            <h4 className="text-xs font-black tracking-wider uppercase">Azure Blob Sync</h4>
                            <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Automated Redundancy</p>
                        </div>
                    </div>

                    <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl backdrop-blur-md flex items-center gap-4">
                        <div className="bg-emerald-500/20 p-3 rounded-2xl text-emerald-400"><Shield size={24} /></div>
                        <div>
                            <h4 className="text-xs font-black tracking-wider uppercase">Security Engine</h4>
                            <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Application Encryption</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;