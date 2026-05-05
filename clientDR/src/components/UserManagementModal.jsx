import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, HardDrive, Database, Trash2, CheckCircle, UserMinus, AlertCircle, AlertTriangle, HelpCircle } from 'lucide-react';

const UserManagementModal = ({ user, onClose, onUserDeleted }) => {
    const [userTasks, setUserTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false); // Custom Delete Confirmation State

    useEffect(() => {
        if (user) {
            fetchUserTasks();
        }
    }, [user]);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const fetchUserTasks = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`https://multiclouddr.onrender.com/api/tasks/my-tasks/${user._id}`);
            setUserTasks(res.data);
        } catch (err) {
            console.error("Error fetching user tasks:", err);
            showToast("Failed to read node data", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (taskId, platform) => {
        if (!window.confirm(`Are you sure you want to delete this resource from ${platform}?`)) return;
        
        try {
            await axios.delete(`https://multiclouddr.onrender.com/api/tasks/${taskId}?platform=${platform}`);
            showToast(`Asset deleted successfully from ${platform.toUpperCase()}`, 'success');
            fetchUserTasks();
        } catch (err) {
            showToast("Failed to delete cloud resource", "error");
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`https://multiclouddr.onrender.com/api/admin/users/${userId}`);
            
            showToast('Account and data deleted successfully', 'success');
            
            setTimeout(() => {
                if (onUserDeleted) onUserDeleted();
                onClose();
            }, 1500);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Failed to delete user";
            showToast(errorMsg, "error");
        } finally {
            setShowConfirm(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-6">
            <div className="bg-white rounded-[40px] w-full max-w-5xl h-[600px] flex flex-col shadow-2xl border border-white/20 overflow-hidden relative">
                
                {/* --- Toast Container --- */}
                {toast && (
                    <div className={`absolute bottom-8 right-8 z-[200] px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl border ${
                        toast.type === 'error' 
                        ? 'bg-red-50 border-red-200 text-red-700 animate-pulse' 
                        : 'bg-emerald-50 border-emerald-200 text-emerald-700 animate-bounce'
                    }`}>
                        {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                        <span className="text-xs font-black tracking-widest uppercase">{toast.message}</span>
                    </div>
                )}

                {/* Modal Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                            OPERATOR ASSETS: <span className="text-blue-600">{user.name}</span>
                        </h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                            {user.email}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setShowConfirm(true)}
                            className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 border border-red-100 px-5"
                        >
                            <UserMinus size={16} /> Delete Account
                        </button>
                        <button 
                            onClick={onClose} 
                            className="bg-slate-200 p-3 rounded-2xl text-slate-500 hover:text-red-500 hover:bg-slate-100 transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* --- Confirmation Custom Dialog --- */}
                {showConfirm && (
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-[250] flex items-center justify-center">
                        <div className="bg-white p-10 rounded-[35px] max-w-md w-full mx-6 text-center shadow-2xl animate-in fade-in duration-300">
                            <AlertTriangle size={40} className="text-red-500 mx-auto mb-6 animate-pulse" />
                            <h3 className="text-lg font-black text-slate-800 tracking-tight">Remove User?</h3>
                            <p className="text-xs text-slate-500 font-medium mt-2">
                                Deleting <span className="font-extrabold text-xs text-red-500 animate-pulse">{user.name.toUpperCase()}...</span> 😳 Are we 100% sure, or just angry right now? they’re gone. all their data? Poof. Magic. No take-backs ✨
                            </p>
                            
                            <div className="flex gap-4 mt-10">
                                <button 
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl text-[10px] tracking-widest uppercase transition-all shadow-xl"
                                >
                                    Confirm Delete
                                </button>
                                <button 
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black py-4 rounded-2xl text-[10px] tracking-widest uppercase transition-all shadow-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-10 bg-[#F8FAFC]">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 font-bold tracking-widest text-xs uppercase">
                            <span className="animate-pulse mb-3">Reading Node Telemetry...</span>
                        </div>
                    ) : userTasks.length === 0 ? (
                        <div className="h-full border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                            <HardDrive size={40} className="mb-4 text-blue-300 animate-bounce" />
                            <span className="text-xs font-bold uppercase tracking-widest">No Cloud Assets Found</span>
                            <p className="text-[9px] mt-1 max-w-[250px]">This operator does not have any deployed records in the cloud environment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {userTasks.map((task) => (
                                <div key={task._id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all group">
                                    <div className={`h-1.5 w-full ${task.sync_status === 'Synced' ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-black text-slate-800 text-lg tracking-tight">{task.title}</h3>
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                                                task.sync_status === 'Synced' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                                            }`}>
                                                {task.sync_status}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-xs mb-6 line-clamp-2">{task.description}</p>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <HardDrive size={16} className="text-orange-500"/>
                                                    <span className="text-[10px] font-black text-slate-600 tracking-wider uppercase">AWS S3 BUCKET</span>
                                                </div>
                                                {task.aws_url ? (
                                                    <CheckCircle size={14} className="text-emerald-500" />
                                                ) : (
                                                    <span className="text-[9px] text-red-500 font-bold uppercase">Inactive</span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <Database size={16} className="text-blue-600"/>
                                                    <span className="text-[10px] font-black text-slate-600 tracking-wider uppercase">AZURE BLOB</span>
                                                </div>
                                                {task.azure_url ? (
                                                    <CheckCircle size={14} className="text-emerald-500" />
                                                ) : (
                                                    <span className="text-[9px] text-red-500 font-bold uppercase">Inactive</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
                                            <button 
                                                onClick={() => handleDelete(task._id, 'aws')} 
                                                className="bg-orange-50 text-orange-600 py-3 rounded-xl text-[9px] font-black tracking-wider border border-orange-100 hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <Trash2 size={12} /> AWS
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(task._id, 'azure')} 
                                                className="bg-blue-50 text-blue-600 py-3 rounded-xl text-[9px] font-black tracking-wider border border-blue-100 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <Trash2 size={12} /> AZURE
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(task._id, 'all')} 
                                                className="bg-red-50 text-red-600 py-3 rounded-xl text-[9px] font-black tracking-wider border border-red-100 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <Trash2 size={12} /> ALL
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserManagementModal;