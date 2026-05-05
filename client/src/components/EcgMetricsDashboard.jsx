import React, { useState } from 'react';
import { ShieldCheck, Database, HardDrive } from 'lucide-react';
import EcgChannel from './EcgChannel';

/**
 * EcgMetricsDashboard
 *
 * A dark telemetry dashboard showing real-time P-QRS-T ECG heartbeat
 * animations for AWS S3, Azure Blob, and Atlas DB nodes.
 * Each node can be toggled into an "Outage" (flat red line) state.
 *
 * No required props — drop in anywhere:
 *   <EcgMetricsDashboard />
 */
const EcgMetricsDashboard = () => {
    const [awsDown,   setAwsDown]   = useState(false);
    const [azureDown, setAzureDown] = useState(false);
    const [atlasDown, setAtlasDown] = useState(false);

    const rows = [
        {
            key:      'aws',
            label:    'AWS S3 Bucket',
            desc:     'Primary Engine',
            icon:     <ShieldCheck size={18} />,
            iconCls:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            color:    '#10b981',
            isDown:   awsDown,
            toggle:   () => setAwsDown(v => !v),
            okCls:    'text-emerald-400 border-slate-800',
            phaseOffset: 0,
        },
        {
            key:      'azure',
            label:    'Azure Blob',
            desc:     'Replica Layer',
            icon:     <Database size={18} />,
            iconCls:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
            color:    '#3b82f6',
            isDown:   azureDown,
            toggle:   () => setAzureDown(v => !v),
            okCls:    'text-blue-400 border-slate-800',
            phaseOffset: 80,
        },
        {
            key:      'atlas',
            label:    'Atlas DB',
            desc:     'Metadata Registry',
            icon:     <HardDrive size={18} />,
            iconCls:  'bg-orange-500/10 text-orange-400 border-orange-500/20',
            color:    '#f59e0b',
            isDown:   atlasDown,
            toggle:   () => setAtlasDown(v => !v),
            okCls:    'text-amber-400 border-slate-800',
            phaseOffset: 160,
        },
    ];

    return (
        <div className="bg-slate-950 text-slate-100 p-6 rounded-[28px] border border-slate-900 shadow-2xl max-w-4xl mx-auto mt-4">

            {/* Header */}
            <div className="flex justify-between items-center pb-5 border-b border-slate-900 mb-6">
                <div>
                    <h3 className="text-sm font-black tracking-wider text-white uppercase flex items-center gap-2.5">
                        <span className="p-1.5 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/20">
                            <HardDrive size={16} />
                        </span>
                        Node Heartbeat Telemetry
                    </h3>
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">
                        AWS-North Europe Node Operations
                    </p>
                </div>
                <span className="text-[8px] font-black text-emerald-400 bg-emerald-600/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                    Live Status
                </span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-900/80">
                {rows.map(row => (
                    <div
                        key={row.key}
                        className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                    >
                        {/* Left — icon + label */}
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-2xl border ${row.iconCls}`}>
                                {row.icon}
                            </div>
                            <div>
                                <p className="text-[11px] font-black tracking-tight text-white uppercase">
                                    {row.label}
                                </p>
                                <p className="text-[8px] text-slate-500 uppercase tracking-widest">
                                    {row.desc}
                                </p>
                            </div>
                        </div>

                        {/* Right — status + canvas + button */}
                        <div className="flex items-center gap-4">
                            {/* Status text */}
                            <span
                                className={`text-[9px] font-mono tracking-wider min-w-[88px] text-right ${
                                    row.isDown
                                        ? 'text-red-400 animate-pulse'
                                        : 'text-emerald-400'
                                }`}
                            >
                                {row.isDown ? '⬛ OUTAGE' : '● STABLE'}
                            </span>

                            {/* ECG Canvas */}
                            <EcgChannel
                                isDown={row.isDown}
                                color={row.color}
                                phaseOffset={row.phaseOffset}
                            />

                            {/* Toggle Button */}
                            <button
                                onClick={row.toggle}
                                className={`text-[9px] font-black uppercase px-3.5 py-2.5 rounded-xl border transition-all tracking-wider w-20 ${
                                    row.isDown
                                        ? 'bg-red-950/60 border-red-900/40 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.1)] animate-pulse'
                                        : `bg-slate-950 ${row.okCls} hover:bg-slate-900`
                                }`}
                            >
                                {row.isDown ? 'Restore' : 'Outage'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EcgMetricsDashboard;