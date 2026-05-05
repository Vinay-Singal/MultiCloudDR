import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminTerminal from "../components/AdminTerminal";
import EcgMetricsDashboard from '../components/EcgMetricsDashboard';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Server, Zap, ShieldCheck, ExternalLink, Bell, Search,
  Globe, Cpu, Activity, HardDrive, Database, Users,
} from "lucide-react";
import UserManagementModal from "../components/UserManagementModal";

/* ─── Custom Tooltip ─────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 shadow-2xl">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.stroke }} className="text-xs font-black">
          {p.dataKey.toUpperCase()}: {p.value} req/s
        </p>
      ))}
    </div>
  );
};

/* ─── Stat Card ──────────────────────────────────────────────── */
const StatCard = ({ label, value, icon, colorCls, shadowCls }) => (
  <div className="bg-white p-8 rounded-[35px] border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
    <div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
      <h3 className="text-5xl font-black text-slate-800">{value}</h3>
    </div>
    <div className={`p-5 rounded-3xl text-white shadow-lg ${colorCls} ${shadowCls}`}>
      {icon}
    </div>
  </div>
);

/* ─── Main Dashboard ─────────────────────────────────────────── */
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({ total: 0, synced: 0, pending: 0, chartData: [] });
  const [realUsers, setRealUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedUserForManagement, setSelectedUserForManagement] = useState(null);
  const [isChartVisible, setIsChartVisible] = useState(false);
  const [chartKey, setChartKey] = useState(0); // force re-mount to replay animation
  const chartRef = useRef(null);

  const throughputData = [
    { name: "00:00", aws: 45, azure: 38 },
    { name: "04:00", aws: 52, azure: 48 },
    { name: "08:00", aws: 85, azure: 77 },
    { name: "12:00", aws: 64, azure: 60 },
    { name: "16:00", aws: 78, azure: 70 },
    { name: "20:00", aws: 55, azure: 52 },
    { name: "23:59", aws: 48, azure: 41 },
  ];

  const healthData = [
    { name: "AWS S3 Cluster",  status: "99.9%", load: 42, region: "ap-southeast-1" },
    { name: "Azure Blob Node", status: "99.7%", load: 28, region: "central-india"  },
    { name: "Mongo Atlas DB",  status: "100%",  load: 15, region: "global"         },
  ];

  /* ── Data fetch ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sRes = await axios.get("https://multiclouddr.onrender.com/api/admin/stats");
        setStats(sRes.data);
        const uRes = await axios.get("https://multiclouddr.onrender.com/api/admin/users");
        setRealUsers(uRes.data);
        if (sRes.data.total > 0) showToast("Security Audit: Multi-Cloud Nodes Healthy");
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };
    fetchData();
  }, [activeTab]);

  /* ── IntersectionObserver: animate chart only when visible ── */
  useEffect(() => {
    if (activeTab !== "overview") return;

    // Reset each time overview is entered so animation can replay
    setIsChartVisible(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Small delay for a polished feel
          setTimeout(() => {
            setIsChartVisible(true);
            setChartKey(k => k + 1); // remount AreaChart so animation runs fresh
          }, 150);
          observer.disconnect();
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.25 }
    );

    const el = chartRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [activeTab]);

  const showToast = (msg) => {
    const id = Date.now();
    setNotifications([{ id, msg }]);
    setTimeout(() => setNotifications([]), 5000);
  };

  /* ════════════════════════════════════════════════════════════ */
  return (
    <div className="flex h-screen bg-[#F0F4F8] w-full overflow-hidden">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto p-8 bg-white m-4 rounded-[40px] shadow-inner">

        {/* ── Toast ── */}
        {notifications.map(n => (
          <div
            key={n.id}
            className="fixed top-6 right-6 bg-slate-950 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-l-4 border-blue-500 z-50 animate-in slide-in-from-right duration-300"
          >
            <Bell size={16} className="text-blue-400 shrink-0" />
            <span className="text-sm font-bold">{n.msg}</span>
          </div>
        ))}

        {/* ── Header ── */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
              <span className="text-blue-600">{activeTab}</span> Center
            </h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
              SRE NODE: CENTRAL-INDIA-01
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <label className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl flex items-center gap-2 focus-within:border-blue-400 transition-colors">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search logs..."
                className="text-slate-500 bg-transparent outline-none text-sm font-medium w-40"
              />
            </label>
          </div>
        </header>

        {/* ════════ 1. OVERVIEW TAB ════════ */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-500">

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-6">
              <StatCard label="Global Objects" value={stats.total}        icon={<Server size={30} />}   colorCls="bg-blue-600"    shadowCls="shadow-blue-200" />
              <StatCard label="System Load"    value="24%"                icon={<Activity size={30} />} colorCls="bg-amber-500"   shadowCls="shadow-amber-200" />
              <StatCard label="Users"          value={realUsers.length}   icon={<Users size={30} />}    colorCls="bg-emerald-500" shadowCls="shadow-emerald-200" />
            </div>

            {/* ECG + Chart row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

              {/* ECG — takes 3 cols */}
              <div className="lg:col-span-3">
                <EcgMetricsDashboard />
              </div>

              {/* Traffic Flow — takes 2 cols, animates on scroll */}
              <div
                ref={chartRef}
                className="lg:col-span-2 bg-white p-8 rounded-[40px] border-2 border-blue-100 shadow-md flex flex-col"
              >
                <h4 className="font-black text-slate-700 mb-1 uppercase text-[10px] tracking-widest flex items-center gap-2">
                  <Zap size={14} className="text-blue-500" /> Traffic Flow
                </h4>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-6">
                  req/s · last 24 h
                </p>

                {/* Invisible until scrolled into view */}
                <div className={`flex-1 transition-opacity duration-700 ${isChartVisible ? 'opacity-100' : 'opacity-0'}`}>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart key={chartKey} data={throughputData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gAws"   x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}    />
                        </linearGradient>
                        <linearGradient id="gAzure" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}    />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone" dataKey="aws"
                        stroke="#3b82f6" strokeWidth={3}
                        fill="url(#gAws)"
                        isAnimationActive={isChartVisible}
                        animationDuration={1800}
                        animationBegin={70}
                        dot={false} activeDot={{ r: 5, fill: '#3b82f6' }}
                      />
                      <Area
                        type="monotone" dataKey="azure"
                        stroke="#10b981" strokeWidth={3}
                        fill="url(#gAzure)"
                        isAnimationActive={isChartVisible}
                        animationDuration={1800}
                        animationBegin={300}
                        dot={false} activeDot={{ r: 5, fill: '#10b981' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex gap-6 mt-4 pt-4 border-t border-slate-100">
                  <span className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                    <span className="w-3 h-0.5 bg-blue-500 rounded-full inline-block" /> AWS
                  </span>
                  <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    <span className="w-3 h-0.5 bg-emerald-500 rounded-full inline-block" /> Azure
                  </span>
                </div>
              </div>
            </div>

            {/* Consistency Audit */}
            <div className="bg-slate-900 p-10 rounded-[40px] shadow-2xl text-white relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
                <Globe size={200} />
              </div>
              <h4 className="font-black mb-8 uppercase text-[10px] text-blue-400 tracking-[0.3em] flex items-center gap-2">
                <ShieldCheck size={14} /> Consistency Audit
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/50">
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-2">Replication Status</p>
                  <p className="text-emerald-400 font-black text-xl">{stats.synced} Synced</p>
                </div>
                <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/50">
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-2">RTO Target</p>
                  <p className="text-white font-black text-xl">&lt; 1 min</p>
                </div>
                <div className="flex items-center">
                  <button className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all shadow-xl shadow-blue-900/40">
                    Download Security Audit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════ 2. USERS TAB ════════ */}
        {activeTab === "users" && (
          <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm animate-in fade-in duration-500">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {["Identity", "Operator Name", "File Volume", "Access"].map((h, i) => (
                    <th key={i} className={`p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest ${i === 3 ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {realUsers.map(user => (
                  <tr key={user._id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors duration-200 group">
                    <td className="p-8">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg mx-auto shadow-md group-hover:bg-blue-600 transition-colors duration-200">
                        {user.name.charAt(0)}
                      </div>
                    </td>
                    <td className="p-8">
                      <p className="font-black text-slate-800">{user.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{user.email}</p>
                    </td>
                    <td className="p-8">
                      <span className="bg-blue-50 px-4 py-2 rounded-xl text-blue-700 border border-blue-100 text-xs font-black">
                        {user.taskCount} Objects
                      </span>
                    </td>
                    <td className="p-8 text-right">
                      <button
                        onClick={() => setSelectedUserForManagement(user)}
                        className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm"
                      >
                        <ExternalLink size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedUserForManagement && (
              <UserManagementModal
                user={selectedUserForManagement}
                onClose={() => setSelectedUserForManagement(null)}
              />
            )}
          </div>
        )}

        {/* ════════ 3. CLOUD HEALTH ════════ */}
        {activeTab === "cloud" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
            {healthData.map((node, i) => (
              <div
                key={i}
                className="bg-white p-10 rounded-[45px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="absolute -top-8 -right-8 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-300">
                  <Cpu size={140} />
                </div>
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-4 rounded-3xl text-white shadow-lg shadow-blue-200">
                      <HardDrive size={26} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 uppercase tracking-widest text-base">{node.name}</h3>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mt-0.5">{node.region}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-[10px] font-black uppercase">
                      Online
                    </span>
                    <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-wider">
                      Uptime {node.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>Capacity Utilization</span>
                    <span className="text-blue-600">{node.load}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                      style={{ width: `${node.load}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ════════ 4. SECURITY LOGS ════════ */}
        {activeTab === "security" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-slate-900 p-10 rounded-[50px] text-white shadow-2xl border border-white/5">
              <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                <ShieldCheck className="text-blue-500" size={26} />
                <h3 className="text-lg font-black uppercase tracking-[0.4em]">Audit_Engine_v1.0</h3>
              </div>
              <div className="space-y-5 font-mono text-[11px]">
                {[
                  { t: "09:00:12", cls: "text-emerald-400", tag: "[PASS]", msg: "CRC Checksum verified for AWS-S3 bucket packet-291." },
                  { t: "09:05:45", cls: "text-blue-400",    tag: "[INFO]", msg: "Replication Job #9828 initiated for Azure-Central." },
                  { t: "09:12:30", cls: "text-red-400",     tag: "[AUTH]", msg: "Unauthorized access attempt blocked from IP: 192.168.1.1" },
                  { t: "09:15:00", cls: "text-slate-500 animate-pulse", tag: "[WAIT]", msg: "Listening for incoming telemetry..." },
                ].map((log, i) => (
                  <p key={i} className={`flex gap-4 ${log.cls}`}>
                    <span className="opacity-40 shrink-0">{log.t}</span>
                    <span className="shrink-0">{log.tag}</span>
                    <span>{log.msg}</span>
                  </p>
                ))}
              </div>
            </div>
            <div className="w-full">
              <AdminTerminal />
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;