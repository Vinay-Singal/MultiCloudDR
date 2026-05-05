import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    CloudOff, ShieldCheck, Database, HardDrive, Plus, X, 
    UploadCloud, Trash2, Activity, PieChart as PieIcon, 
    RefreshCw, AlertTriangle, CheckCircle, Cloud, Upload 
} from 'lucide-react';
import AdminTerminal from '../components/AdminTerminal';
import UserManagementModal from '../components/UserManagementModal';
import UserTerminal from '../components/UserTerminal';

const UserDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [awsDown, setAwsDown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState(null); 
    const [activeTab, setActiveTab] = useState('overview');
    const [realUsers, setRealUsers] = useState([]);
    const [selectedUserForManagement, setSelectedUserForManagement] = useState(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user && user.role === 'admin';

    const fetchTasks = async () => {
        if (!user) return;
        try {
            const userId = user?.id || user?._id;
            const res = await axios.get(`http://localhost:5000/api/tasks/my-tasks/${userId}`);
            setTasks(res.data);
        } catch (err) {
            console.error("Failed to fetch tasks:", err);
        }
    };

    const fetchAllUsers = async () => {
        if (isAdmin && activeTab === 'users') {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/users');
                setRealUsers(res.data);
            } catch (err) {
                console.error("Failed to fetch users", err);
            }
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        fetchTasks();
        if (isAdmin) {
            fetchAllUsers();
        }

        const taskInterval = setInterval(fetchTasks, 15000);
        return () => {
            clearInterval(taskInterval);
        };
    }, [navigate, activeTab, isAdmin]);

    const handleUpload = async (e) => {
        e.preventDefault();
        
        if (!user) {
            alert("Session expired. Please log in.");
            navigate('/login');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('file', file);
        formData.append('userId', user.id || user._id);

        try {
            await axios.post('http://localhost:5000/api/tasks/add', formData);
            setShowModal(false);
            setTitle(''); 
            setDescription(''); 
            setFile(null);
            fetchTasks(); 
        } catch (err) {
            alert("Upload Error");
        } finally {
            setLoading(false);
        }
    };

    const executeDelete = async (platform) => {
        if (!user) {
            alert("Session expired.");
            navigate('/login');
            return;
        }
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${deleteId}?platform=${platform}`);
            setDeleteId(null); 
            fetchTasks(); 
        } catch (err) {
            alert("Delete failed on " + platform);
        }
    };

    if (!user) {
        return null;
    }

    const syncedCount = tasks.filter(t => t.sync_status === 'Synced').length;
    const pendingCount = tasks.filter(t => t.sync_status === 'Pending').length;

    const renderOverview = () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-8 space-y-6">
                <div className={`p-5 rounded-2xl flex justify-between items-center border-l-[12px] shadow-sm ${awsDown ? 'bg-red-50 border-red-500' : 'bg-emerald-50 border-emerald-500'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${awsDown ? 'bg-red-200 text-red-700' : 'bg-emerald-200 text-emerald-700'}`}>
                            {awsDown ? <CloudOff size={28}/> : <ShieldCheck size={28}/>}
                        </div>
                        <div>
                            <h2 className="font-extrabold text-slate-800 uppercase text-sm">{awsDown ? "AWS Region: Down" : "AWS Region: Active"}</h2>
                            <p className="text-xs font-medium text-slate-600">Traffic Route: <span className="font-bold underline">{awsDown ? "AZURE CLOUD" : "AWS CLOUD"}</span></p>
                        </div>
                    </div>
                    <button onClick={() => setAwsDown(!awsDown)} className={`px-4 py-2 rounded-lg font-black text-[10px] text-white ${awsDown ? 'bg-emerald-600' : 'bg-red-600'}`}>
                        {awsDown ? "Restore AWS" : "Simulate Outage"}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tasks.map(task => (
                        <div key={task._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all group overflow-hidden">
                            <div className={`h-1.5 w-full ${task.sync_status === 'Synced' ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-slate-800 text-lg leading-tight truncate">{task.title}</h3>
                                    <button onClick={() => setDeleteId(task._id)} className="text-slate-300 hover:text-red-500 transition-colors p-1 flex-shrink-0">
                                        <Trash2 size={18}/>
                                    </button>
                                </div>
                                <p className="text-slate-500 text-xs mb-5 line-clamp-2 h-8">{task.description}</p>
                                <div className="space-y-2">
                                    <div className={`flex items-center gap-3 p-2 rounded-lg border ${awsDown ? 'opacity-30' : 'bg-orange-50 border-orange-100 text-orange-700'}`}>
                                        <HardDrive size={14} className="flex-shrink-0" />
                                        <span className="text-[10px] font-bold truncate">AWS S3 BUCKET</span>
                                        {task.aws_url && <CheckCircle size={12} className="ml-auto text-emerald-600 flex-shrink-0" />}
                                    </div>
                                    <div className={`flex items-center gap-3 p-2 rounded-lg border ${awsDown ? 'bg-blue-600 text-white' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                                        <Database size={14} className="flex-shrink-0" />
                                        <span className="text-[10px] font-bold truncate uppercase">{task.sync_status === 'Synced' ? 'Azure Replicated' : 'Syncing...'}</span>
                                        {task.sync_status === 'Synced' && <CheckCircle size={12} className="ml-auto flex-shrink-0" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div className="md:col-span-2 border-2 border-dashed border-slate-200 rounded-2xl h-48 flex flex-col items-center justify-center text-slate-400 bg-white">
                           <UploadCloud size={32} className="mb-2"/>
                           <p className='text-sm font-bold'>No Deployments Yet</p>
                           <p className='text-xs'>Click 'New Deployment' to start syncing.</p>
                        </div>
                    )}
                </div>

                <div className="w-full mt-4">
                    <UserTerminal 
                        tasks={tasks} 
                        userId={user?.id || user?._id} 
                        onDelete={(id) => setDeleteId(id)} 
                        onUserDeleted={() => {
                            localStorage.removeItem('user');
                            navigate('/login');
                        }}
                    />
                </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                        <Activity size={18} className="text-blue-600"/> LIVE CLOUD METRICS
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                            <span className="text-xs font-bold text-slate-600">Total Assets</span>
                            <span className="text-lg font-black text-blue-600">{tasks.length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                            <span className="text-xs font-bold text-emerald-700">Healthy (Synced)</span>
                            <span className="text-lg font-black text-emerald-600">{syncedCount}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl border border-amber-100">
                            <span className="text-xs font-bold text-amber-700">Pending Sync</span>
                            <span className="text-lg font-black text-amber-600">{pendingCount}</span>
                        </div>
                    </div>
                    
                    <div className="mt-8">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Sync Consistency</p>
                        <div className="flex h-4 w-full rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                            <div style={{width: `${tasks.length > 0 ? (syncedCount/tasks.length)*100 : 0}%`}} className="bg-emerald-500 h-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"></div>
                            <div style={{width: `${tasks.length > 0 ? (pendingCount/tasks.length)*100 : 0}%`}} className="bg-amber-400 h-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"></div>
                        </div>
                        <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-500">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> REPLICATED</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-400 rounded-full"></div> PENDING</span>
                        </div>
                    </div>
                </div>

                {/* Strategy and Policy Info Cards */}
                <div className="flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-7 rounded-[30px] text-white shadow-xl">
                        <PieIcon size={32} className="mb-4 opacity-40"/>
                        <h3 className="font-bold text-lg mb-2.5 tracking-tight">Disaster Recovery Strategy</h3>
                        <p className="text-xs text-blue-100 leading-relaxed font-medium">
                            Your active DR strategy is set to automated failover. Data is replicated asynchronously across US-East (AWS Primary) and North Europe (Azure Secondary). Aggregated RTO is currently estimated at <b>~0.4ms</b>.
                        </p>
                    </div>
                    
                    <div className="bg-slate-950 text-white p-6 rounded-[30px] shadow-2xl border border-white/5 relative overflow-hidden">
                         <Database size={100} className='absolute -right-5 -bottom-5 text-blue-900/30' />
                         <div className='relative z-10'>
                            <h3 className="font-bold text-sm mb-3 tracking-wider uppercase text-blue-400">Security Policy</h3>
                            <p className="text-xs text-slate-300 mb-5 leading-relaxed font-medium">
                                Cross-cloud object locking and versioning are active. All data deleted from primary nodes is soft-retained on secondary instances for a period of 30 days unless an explicit 'Delete All' operation is executed.
                            </p>
                            <div className="text-[10px] font-black bg-blue-600/30 text-blue-300 px-3 py-1.5 rounded-xl inline-block border border-blue-500/50 uppercase tracking-widest">
                                ENCRYPTION: AES-256-GCM
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderUsers = () => (
        <div className="bg-white rounded-[40px] border overflow-hidden animate-in fade-in duration-500 shadow-sm">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b font-black text-slate-400 uppercase text-[10px]">
                    <tr>
                        <th className="p-8 text-center">Identity</th>
                        <th className="p-8">Operator Name</th>
                        <th className="p-8">File Volume</th>
                        <th className="p-8 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {realUsers.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-50/50 transition-all group">
                            <td className="p-8 text-center">
                                <div className="w-14 h-14 rounded-3xl bg-slate-900 text-white flex items-center justify-center font-black text-xl mx-auto shadow-xl group-hover:bg-blue-600 transition-colors">
                                    {(item.name || item.email).charAt(0).toUpperCase()}
                                </div>
                            </td>
                            <td className="p-8">
                                <p className="font-black text-slate-800 text-base">{item.name || "Unknown Operator"}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.email}</p>
                            </td>
                            <td className="p-8 font-black text-slate-600 text-sm">
                                <span className="bg-blue-50 px-4 py-2 rounded-xl text-blue-700 border border-blue-100 flex items-center gap-2 max-w-fit">
                                    <Database size={14}/> {item.taskCount || 0} Objects
                                </span>
                            </td>
                            <td className="p-8 text-right">
                                <button 
                                    onClick={() => setSelectedUserForManagement(item)}
                                    className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:scale-105 transition-all shadow-sm"
                                >
                                    <RefreshCw size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="p-6 bg-slate-50 min-h-screen relative">
            <div className="max-w-[1400px] mx-auto">
                
                {deleteId && (
                    <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[100] bg-white border-2 border-red-500 p-8 rounded-[30px] shadow-2xl w-full max-w-xl">
                        <div className="flex items-center gap-3 mb-4 text-red-600 font-bold text-lg">
                            <AlertTriangle /> <span>Confirm Deletion Strategy</span>
                        </div>
                        <p className="text-gray-600 mb-6 text-sm">Where do you want to remove this resource from? Selecting 'All' will also delete the record from Database.</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <button onClick={() => executeDelete('all')} className="bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-red-700">All Platforms</button>
                            <button onClick={() => executeDelete('aws')} className="bg-orange-500 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-orange-600">Only AWS</button>
                            <button onClick={() => executeDelete('azure')} className="bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-600">Only Azure</button>
                            <button onClick={() => setDeleteId(null)} className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-bold">Cancel</button>
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-6 rounded-[30px] shadow-lg border border-slate-100 gap-4">
                    <div className='flex items-center gap-3.5'>
                        <ShieldCheck className='text-blue-600' size={36}/>
                        <div>
                            <h1 className="text-3xl font-black text-slate-950 tracking-tighter italic">CLOUD SENTINEL DR <span className="text-blue-600 text-sm font-black ml-1.5 px-3 py-1 bg-blue-50 rounded-full animate-pulse">{isAdmin ? "v2.1 [ADMIN]" : "v2.1 [Ordinary User]"}</span></h1>
                            <p className="text-slate-500 text-[13px] font-medium -mt-1 tracking-tight">Cross-Cloud Storage & Recovery Dashboard | central-india-01</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        {/* Tab Toggle Buttons for Admin */}
                        {isAdmin && (
                            <div className='flex items-center gap-4 bg-slate-100 p-1 rounded-3xl border border-slate-200 font-black uppercase tracking-wider text-[11px] text-slate-600'>
                        <button onClick={() => setActiveTab('overview')} className={`px-7 py-3 rounded-2xl transition-all ${activeTab === 'overview' ? 'bg-slate-950 text-white shadow-xl transform scale-105' : 'hover:bg-white hover:text-slate-900'}`}>Cloud Overview</button>
                        <button onClick={() => setActiveTab('users')} className={`px-7 py-3 rounded-2xl transition-all ${activeTab === 'users' ? 'bg-slate-950 text-white shadow-xl transform scale-105' : 'hover:bg-white hover:text-slate-900'}`}>DR Operators</button>
                    </div>
                        )}
                                                
                        <button onClick={fetchTasks} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition"><RefreshCw size={20}/></button>
                        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-md font-bold text-sm">
                            <Plus size={18}/> New Deployment
                        </button>
                    </div>
                </div>

                {/* Role-Based Content Rendering */}
                {isAdmin ? (
                    activeTab === 'overview' ? renderOverview() : renderUsers()
                ) : (
                    renderOverview()
                )}
            </div>

            {/* UPLOAD MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[35px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">NEW DEPLOYMENT</h2>
                            <button onClick={() => setShowModal(false)} className="bg-slate-200 p-1 rounded-full text-slate-500 hover:text-red-500 transition-colors"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleUpload} className="p-8 space-y-5">
                            <input required type="text" placeholder="Deployment Title" className="text-slate-800 text-extrabold w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-blue-500 transition-all text-md" value={title} onChange={e => setTitle(e.target.value)} />
                            <textarea placeholder="Write description..." className="text-slate-800 w-full border-2 border-slate-100 rounded-xl p-3 outline-none focus:border-blue-500 transition-all text-md h-18" value={description} onChange={e => setDescription(e.target.value)} />
                            <div className="border-2 border-dashed border-blue-100 rounded-2xl p-8 text-center hover:bg-blue-50 transition cursor-pointer relative group">
                                <UploadCloud className="mx-auto text-blue-400 mb-2 group-hover:scale-110 transition-transform" size={40}/>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Select File for Cloud Sync</p>
                                <input required type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFile(e.target.files[0])} />
                                {file && <p className="mt-2 text-xs font-bold text-emerald-600">ATTACHED: {file.name}</p>}
                            </div>
                            <button disabled={loading} className={`w-full py-4 rounded-xl font-black text-sm text-white tracking-widest transition-all ${loading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700 shadow-xl'}`}>
                                {loading ? "CONNECTING TO NODES..." : "DEPLOY TO CLOUD"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Operator Management Modal */}
            {selectedUserForManagement && (
                <UserManagementModal 
                    user={selectedUserForManagement} 
                    onClose={() => setSelectedUserForManagement(null)} 
                />
            )}
        </div>
    );
};

export default UserDashboard;