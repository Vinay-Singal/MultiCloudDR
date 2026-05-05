import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, Calculator, ArrowRight, LogIn, ShieldCheck, Database, HardDrive } from 'lucide-react';
import LetterGlitch from '../components/LetterGlitch';

const Homepage = () => {
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
            <div className="relative z-10 flex flex-col justify-between md:h-[95%] h-screen max-w-7xl mx-auto px-8 py-10 pointer-events-none">
                
                {/* Header Section */}
                <div className="flex justify-between items-center pointer-events-auto">
                    <div className="flex items-center gap-3 font-black text-2xl tracking-tighter">
                        <span className="text-white text-[2rem]">Vinay <span className="text-emerald-400">Singal</span></span>
                    </div>
                    
                    <div className="hidden md:flex gap-8 items-center text-xs font-bold tracking-widest uppercase text-slate-300">
                        <span className="text-[12px] font-black text-emerald-400 tracking-[0.4em] uppercase bg-emerald-600/20 border border-emerald-500/30 px-4 py-2 text-shadow-lg/30 rounded-full w-fit flex items-center gap-2 animate-pulse">
                        <span className="hover:text-emerald-400 text-white transition cursor-progress bg-emerald-500 text-slate-900 px-1.5 py-0.5 rounded text-[12px] font-black}">NEW</span>
                        Just shipped v1.0
                    </span>
                    </div>
                    
                </div>

                {/* Hero Center Section */}
                <div className="mt-[-10px] max-w-4xl flex flex-col gap-6">
                    
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                        Free to sign up. Free to test. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                            Free monthly usage.
                        </span>
                    </h1>
                    {/* <p className="text-slate-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
                        Transition seamlessly from local development to an interactive UI platform. 
                        Bring professional-grade, high-fidelity user components into your applications.
                    </p> */}
                    
                    {/* Hero Buttons */}
                    <div className="flex flex-wrap gap-4 pt-4 pointer-events-auto">
                        <button 
                            onClick={() => navigate('/dashboard')} 
                            className="bg-white text-slate-950 font-black text-xs tracking-widest uppercase px-8 py-4 rounded-2xl shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3"
                        >
                            Get started <ArrowRight size={16} />
                        </button>

                        <button 
                            onClick={() => navigate('/calculator')} 
                            className="bg-slate-900/60 border border-slate-800 text-slate-200 hover:bg-slate-900 font-black text-xs tracking-widest uppercase px-8 py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3 backdrop-blur-sm"
                        >
                            Learn more <Calculator size={16} />
                        </button>
                    </div>
                </div>

                {/* Footer Features Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pointer-events-auto">
                    <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl backdrop-blur-md flex items-center gap-4">
                        <div className="bg-emerald-500/20 p-3 rounded-2xl text-emerald-400"><ShieldCheck size={24} /></div>
                        <div>
                            <h4 className="text-xs font-black tracking-wider uppercase">Safe UI Engine</h4>
                            <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Application Encryption</p>
                        </div>
                    </div>
                    
                    <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl backdrop-blur-md flex items-center gap-4">
                        <div className="bg-blue-500/20 p-3 rounded-2xl text-blue-400"><Database size={24} /></div>
                        <div>
                            <h4 className="text-xs font-black tracking-wider uppercase">Dynamic Data</h4>
                            <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Automated Redundancy</p>
                        </div>
                    </div>

                    <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl backdrop-blur-md flex items-center gap-4">
                        <div className="bg-orange-500/20 p-3 rounded-2xl text-orange-400"><HardDrive size={24} /></div>
                        <div>
                            <h4 className="text-xs font-black tracking-wider uppercase">Node Optimizer</h4>
                            <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">High Performance Core</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;