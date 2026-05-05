import { Users, LayoutDashboard, Database, ShieldAlert, Activity } from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
    const menus = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'users', label: 'User Registry', icon: Users },
        { id: 'cloud', label: 'Cloud Health', icon: Database },
        { id: 'security', label: 'Security Logs', icon: ShieldAlert }
    ];

    return (
        <aside className="w-72 bg-slate-950 text-white min-h-screen p-6 border-r border-slate-800 flex flex-col">
            <div className="mb-10 px-2">
                <h2 className="text-2xl font-black tracking-tighter text-blue-500 italic">SENTINEL PRO</h2>
                <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Admin Control Center</p>
            </div>
            
            <nav className="space-y-2 flex-1">
                {menus.map(menu => (
                    <button 
                        key={menu.id}
                        onClick={() => setActiveTab(menu.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group ${
                            activeTab === menu.id 
                            ? 'bg-blue-600 shadow-lg shadow-blue-900/40 text-white' 
                            : 'hover:bg-slate-900 text-slate-400 hover:text-slate-100'
                        }`}
                    >
                        <menu.icon size={22} className={activeTab === menu.id ? 'text-white' : 'group-hover:text-blue-400'} /> 
                        <span className="font-bold text-sm tracking-wide">{menu.label}</span>
                    </button>
                ))}
            </nav>

            <div className="mt-auto bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">System: Operational</span>
                </div>
            </div>
        </aside>
    );
};
export default AdminSidebar;