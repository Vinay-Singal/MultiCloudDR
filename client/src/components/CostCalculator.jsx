import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calculator, HardDrive, Percent, Database, Cpu, X, Server } from 'lucide-react';

const CostCalculator = ({ onClose }) => {
    const [servers, setServers] = useState(5);
    const [files, setFiles] = useState(10);
    const [storageTB, setStorageTB] = useState(2);
    const [bandwidth, setBandwidth] = useState(100); // in GB
    
    // Cloud selections (Default: All three selected)
    const [selectedClouds, setSelectedClouds] = useState({
        mongo: true,
        aws: true,
        azure: true
    });

    const [calculatedData, setCalculatedData] = useState(null);

    const toggleCloud = (key) => {
        setSelectedClouds(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleCalculation = (e) => {
        e.preventDefault();

        const storageGB = storageTB * 1024;
        let baseCost = 0;

        // Custom Pricing Engine
        if (selectedClouds.aws) baseCost += storageGB * 0.023 * 12;
        if (selectedClouds.azure) baseCost += storageGB * 0.018 * 12;
        if (selectedClouds.mongo) baseCost += (files * 0.05 + bandwidth * 0.1) * 12;

        const awsYearly = selectedClouds.aws ? storageGB * 0.023 * 12 * 83 : 0;
        const azureYearly = selectedClouds.azure ? storageGB * 0.018 * 12 * 83 : 0;
        const mongoYearly = selectedClouds.mongo ? (files * 0.05 + bandwidth * 0.1) * 12 * 83 : 0;

        const onPremYearly = (servers * 5000 * 12) + (3000 * 12);
        const cloudTotal = awsYearly + azureYearly + mongoYearly;

        const totalSavings = onPremYearly //= onPremYearly; // TCO
        // const totalSavings = onPremYearly - awsYearly;
        const savings = onPremYearly - cloudTotal;
        const percentSavings = ((savings / onPremYearly) * 100).toFixed(1);

        setCalculatedData({
            onPrem: onPremYearly.toFixed(2),
            cloud: cloudTotal.toFixed(2),
            savings: savings.toFixed(2),
            percent: percentSavings
        });
    };

    const chartData = calculatedData ? [
        { name: 'On-Premise', Cost: parseFloat(calculatedData.onPrem) },
        { name: 'Multi-Cloud', Cost: parseFloat(calculatedData.cloud) }
    ] : [];

    return (
        <div className="bg-slate-950/95 backdrop-blur-2xl p-10 rounded-[45px] border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-6xl mx-auto mt-8 text-white relative animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Close Button if used as Modal/Toggle */}
            {onClose && (
                <button onClick={onClose} className="absolute top-10 right-10 bg-slate-900 p-3 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-slate-800 transition">
                    <X size={20} />
                </button>
            )}

            {/* Header */}
            <div className="flex items-center gap-4 mb-10 border-b border-slate-900 pb-6">
                <div className="bg-blue-600/20 p-5 rounded-3xl text-blue-400 border border-blue-500/30 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                    <Calculator size={32} />
                </div>
                <div>
                    <h3 className="font-black text-2xl tracking-tighter uppercase">Cloud Cost & Resource Calculator</h3>
                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mt-1">SRE Multi-Cloud Estimator v2.0</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Inputs Form */}
                <form onSubmit={handleCalculation} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Servers Count</label>
                            <input 
                                type="number" 
                                className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-sm text-white focus:ring-4 focus:ring-blue-950"
                                value={servers} 
                                onChange={(e) => setServers(Number(e.target.value))} 
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Files Count</label>
                            <input 
                                type="number" 
                                className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-sm text-white focus:ring-4 focus:ring-blue-950"
                                value={files} 
                                onChange={(e) => setFiles(Number(e.target.value))} 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Storage Size (TB)</label>
                            <input 
                                type="number" 
                                className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-sm text-white focus:ring-4 focus:ring-blue-950"
                                value={storageTB} 
                                onChange={(e) => setStorageTB(Number(e.target.value))} 
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Bandwidth (GB/mo)</label>
                            <input 
                                type="number" 
                                className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-sm text-white focus:ring-4 focus:ring-blue-950"
                                value={bandwidth} 
                                onChange={(e) => setBandwidth(Number(e.target.value))} 
                            />
                        </div>
                    </div>

                    {/* Cloud Platform Selections */}
                    <div>
                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Include Platforms</label>
                        <div className="grid grid-cols-3 gap-3">
                            <button 
                                type="button"
                                onClick={() => toggleCloud('mongo')}
                                className={`p-3 rounded-xl font-bold text-xs border transition-all ${selectedClouds.mongo ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                            >
                                MongoDB
                            </button>
                            <button 
                                type="button"
                                onClick={() => toggleCloud('aws')}
                                className={`p-3 rounded-xl font-bold text-xs border transition-all ${selectedClouds.aws ? 'bg-orange-600/20 border-orange-500 text-orange-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                            >
                                AWS S3
                            </button>
                            <button 
                                type="button"
                                onClick={() => toggleCloud('azure')}
                                className={`p-3 rounded-xl font-bold text-xs border transition-all ${selectedClouds.azure ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                            >
                                Azure
                            </button>
                        </div>
                    </div>

                    {/* Button with Glowing Effect */}
                    <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-4 rounded-2xl text-white font-black text-xs tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:scale-[1.01] active:scale-95 transition-all relative overflow-hidden"
                    >
                        <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                        Compute TCO Analysis
                    </button>
                </form>

                {/* Output & Chart */}
                <div className="flex flex-col justify-between">
                    {calculatedData ? (
                        <div className="space-y-6 animate-in slide-in-from-right duration-700 h-full flex flex-col justify-between">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">On-Premise TCO</span>
                                    <p className="text-xl font-black text-slate-200 mt-1">₹{calculatedData.onPrem}</p>
                                </div>
                                <div className="bg-blue-950/50 p-5 rounded-2xl border border-blue-900">
                                    <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Cloud Model</span>
                                    <p className="text-xl font-black text-blue-400 mt-1">₹{calculatedData.cloud}</p>
                                </div>
                            </div>

                            <div className="bg-emerald-600/20 border border-emerald-500/20 p-6 rounded-3xl flex justify-between items-center shadow-2xl">
                                <div>
                                    <span className="text-[9px] font-black tracking-widest text-emerald-400 uppercase">Estimated Total Savings</span>
                                    <p className="text-3xl font-black mt-1 text-emerald-200">₹{calculatedData.savings}</p>
                                </div>
                                <div className="flex items-center gap-2 bg-emerald-500 text-white p-3 rounded-2xl text-xs font-black">
                                    <Percent size={14}/> {calculatedData.percent}%
                                </div>
                            </div>

                            <div className="h-[150px] mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                        <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} />
                                        <YAxis tick={{fill: '#64748b', fontSize: 9}} />
                                        <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '16px'}} />
                                        <Bar dataKey="Cost" fill="#2563eb" radius={[10, 10, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full border-2 border-dashed border-slate-900 rounded-3xl flex flex-col items-center justify-center text-slate-600 p-8 text-center bg-slate-900/20 backdrop-blur">
                            <Server size={40} className="mb-4 text-blue-500 animate-bounce" />
                            <span className="text-[9px] font-black tracking-widest uppercase">Awaiting Metric Input</span>
                            <p className="text-[9px] text-slate-500 mt-2 max-w-[250px]">Enter current IT parameters and choose your cloud stack on the left.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CostCalculator;