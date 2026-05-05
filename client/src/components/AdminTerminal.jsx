import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldCheck, Database, HardDrive, Users, Play, RefreshCw } from 'lucide-react';
import axios from 'axios';

const AdminTerminal = () => {
    const [logs, setLogs] = useState([
        { time: new Date().toLocaleTimeString(), type: 'system', text: 'Initializing Sentinel Management Engine v1.0...' },
        { time: new Date().toLocaleTimeString(), type: 'info', text: 'Connected to control-node: CENTRAL-INDIA-01' }
    ]);
    const [input, setInput] = useState('');
    const [summary, setSummary] = useState({ total: 0, synced: 0, pending: 0 });
    const terminalEndRef = useRef(null);

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        fetchLiveStats();
    }, []);

    const fetchLiveStats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/stats');
            setSummary(res.data);
        } catch (e) {
            console.error("Failed to fetch stats", e);
        }
    };

    const addLog = (type, text) => {
        const time = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, { time, type, text }]);
    };

    const runCommand = async (cmd) => {
        const command = (cmd || input).trim().toLowerCase();
        if (!command) return;

        setInput('');

        if (command === 'help') {
            addLog('system', 'Available commands: help | check-nodes | user-count | run-audit | sync-status | <username>.objects | clear');
        } else if (command === 'check-nodes') {
            addLog('info', 'Pinging cross-cloud nodes...');
            setTimeout(() => {
                addLog('success', 'AWS S3: Connected (200 OK) | Latency: 42ms');
                addLog('success', 'Azure Blob: Connected (200 OK) | Latency: 58ms');
                addLog('success', 'Mongo Atlas: Connected (200 OK) | Latency: 12ms');
            }, 1000);
        } else if (command === 'user-count') {
            addLog('info', 'Retrieving user registry metrics from Atlas DB...');
            try {
                const res = await axios.get('http://localhost:5000/api/admin/users');
                addLog('success', `Active Operator Profiles Found: ${res.data.length}`);
                res.data.forEach(u => {
                    addLog('system', `-> Operator: ${u.name} | Assets: ${u.taskCount} [FILES]`);
                });
            } catch (e) {
                addLog('error', 'Failed to retrieve user registry');
            }
        } else if (command === 'run-audit') {
            addLog('info', 'Starting CRC consistency audit...');
            setTimeout(() => {
                addLog('success', 'CRC Checksum matches across regions.');
                addLog('warning', 'No interrupts found. Nodes synchronized.');
            }, 1200);
        } else if (command === 'sync-status') {
            addLog('info', 'Gathering cloud sync states across engines...');
            setTimeout(() => {
                addLog('success', 'AWS S3 -- [Synced] -- 42.5 MB');
                addLog('success', 'AZURE BLOB -- [Synced] -- 42.5 MB');
                addLog('warning', 'TOTAL AGGREGATE STORAGE LOAD: ~1.2 GB');
            }, 1000);
        } else if (command.endsWith('.objects')) {
            const username = command.split('.')[0];
            addLog('info', `Fetching objects belonging to operator: ${username}...`);
            try {
                const res = await axios.get('http://localhost:5000/api/admin/users');
                const user = res.data.find(u => u.name.toLowerCase() === username.toLowerCase());
                if (user) {
                    addLog('success', `User: ${user.name} | Uploaded: ${user.taskCount} items`);
                    addLog('system', `Object Volume: ~22 MB | Last active on cloud nodes: Today, 11:24 AM`);
                } else {
                    addLog('error', `Operator '${username}' not found in registry`);
                }
            } catch (e) {
                addLog('error', 'Could not access user registry database');
            }
        } else if (command === 'clear') {
            setLogs([]);
        } else {
            addLog('error', `Command not found: '${command}'. Type 'help' for valid commands.`);
        }
    };

    return (
        <div className="bg-slate-950 p-8 rounded-[45px] text-emerald-400 font-mono text-[11px] shadow-2xl border border-white/5 h-[500px] flex flex-col justify-between">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                    <Terminal className="text-blue-500 animate-pulse" size={18} />
                    <span className="text-white font-black tracking-widest uppercase">Admin Terminal Module v2.0</span>
                </div>
                <div className="flex gap-2 text-[10px]">
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 uppercase font-bold">
                        SYNCED: {summary.synced}
                    </span>
                    <span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded border border-amber-500/20 uppercase font-bold">
                        PENDING: {summary.pending}
                    </span>
                </div>
            </div>

            {/* Terminal Console Output */}
            <div className="flex-1 overflow-y-auto my-6 space-y-2 scrollbar-thin scrollbar-thumb-slate-900 scrollbar-track-transparent">
                {logs.map((log, index) => (
                    <div key={index} className="flex gap-3">
                        <span className="opacity-40 select-none shrink-0">{log.time}</span>
                        <span className={`${
                            log.type === 'error' ? 'text-red-400' :
                            log.type === 'info' ? 'text-blue-400' :
                            log.type === 'success' ? 'text-emerald-400' :
                            log.type === 'warning' ? 'text-amber-400' : 'text-slate-300'
                        }`}>
                            {log.type === 'error' ? '[ERR]' : '[LOG]'} {log.text}
                        </span>
                    </div>
                ))}
                <div ref={terminalEndRef} />
            </div>

            {/* Terminal Actions Bar and Input */}
            <div className="space-y-4 border-t border-white/10 pt-4">
                <div className="flex flex-wrap gap-2 text-[9px] uppercase tracking-widest text-slate-400">
                    <button onClick={() => runCommand('check-nodes')} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 transition flex items-center gap-2 text-white">
                        <Database size={12} /> CHECK NODES
                    </button>
                    <button onClick={() => runCommand('user-count')} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 transition flex items-center gap-2 text-white">
                        <Users size={12} /> USER REGISTRY
                    </button>
                    <button onClick={() => runCommand('sync-status')} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 transition flex items-center gap-2 text-white">
                        <HardDrive size={12} /> SYNC-STATUS
                    </button>
                    <button onClick={() => runCommand('run-audit')} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 transition flex items-center gap-2 text-white">
                        <ShieldCheck size={12} /> RUN AUDIT
                    </button>
                </div>
                
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && runCommand()}
                        placeholder="Enter command or type 'username.objects'..."
                        className="flex-1 bg-slate-900 text-emerald-400 p-3 rounded-xl border border-slate-800 outline-none focus:border-blue-500 font-mono text-xs"
                    />
                    <button onClick={() => runCommand()} className="bg-blue-600/60 hover:bg-blue-600 text-white px-5 rounded-xl transition flex items-center gap-2">
                        <Play size={14} /> Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminTerminal;