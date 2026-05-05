import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Terminal } from 'lucide-react';

const UserTerminal = ({ tasks, userId, onDelete, onUserDeleted }) => {
    const [command, setCommand] = useState('');
    const [output, setOutput] = useState([]);
    const navigate = useNavigate();

    const handleCommand = async (e) => {
        e.preventDefault();
        const cmd = command.trim().toLowerCase();

        if (cmd === 'ls') {
            if (tasks.length === 0) {
                setOutput(prev => [...prev, '> No files/deployments found in cloud storage.']);
            } else {
                setOutput(prev => [...prev, '> Listing Files:']);
                tasks.forEach((t, index) => {
                    setOutput(prev => [...prev, `  ${index + 1}. ${t.title} | Sync Status: ${t.sync_status}`]);
                });
            }
        } else if (cmd.startsWith('delete.')) {
            const fileName = cmd.split('.')[1];
            const task = tasks.find(t => 
                t.title.toLowerCase().includes(fileName) || 
                (t.aws_url && t.aws_url.split('/').pop().toLowerCase().includes(fileName))
            );

            if (task) {
                try {
                    await onDelete(task._id, 'all');
                    setOutput(prev => [...prev, `> Deleting ${task.title}... Success.`]);
                } catch (err) {
                    setOutput(prev => [...prev, '> Error deleting file from the nodes.']);
                }
            } else {
                setOutput(prev => [...prev, `> Error: File matching '${fileName}' not found.`]);
            }
        } else if (cmd === 'self.delete') {
            try {
                await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
                setOutput(prev => [...prev, '> Account and associated node data removed successfully.']);
                localStorage.removeItem('user');
                setTimeout(() => {
                    if (onUserDeleted) onUserDeleted();
                    navigate('/');
                }, 1500);
            } catch (err) {
                setOutput(prev => [...prev, `> Error deleting account: ${err.response?.data?.message || err.message}`]);
            }
        } else if (cmd === 'help') {
            setOutput(prev => [...prev, 
                '> Console Commands:', 
                '>   ls                - List user files and deployment status', 
                '>   delete.<filename> - Delete file from AWS & Azure', 
                '>   self.delete       - Remove account & deployments', 
                '>   clear             - Clear console history'
            ]);
        } else if (cmd === 'clear') {
            setOutput([]);
        } else {
            setOutput(prev => [...prev, `> Unknown command: '${command}'. Type 'help' for available options.`]);
        }
        setCommand('');
    };

    return (
        <div className="bg-slate-950 text-emerald-400 p-6 rounded-[30px] border border-slate-900 font-mono text-xs h-[400px] flex flex-col shadow-2xl">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-900 mb-4">
                <Terminal size={16} className="text-blue-500" />
                <span className="text-slate-200 font-bold uppercase tracking-widest leading-none">Operator Workspace v2.5</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 mb-4 leading-relaxed">
                <div className="text-slate-600">&gt; Authenticated to cross-cloud storage (AWS/Azure). Type 'help' for commands.</div>
                {output.map((line, index) => <div key={index}>{line}</div>)}
            </div>

            <form onSubmit={handleCommand} className="flex items-center gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <span className="text-blue-600 font-black">user@node:~$</span>
                <input 
                    type="text" 
                    value={command} 
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="Enter command (e.g. ls, delete.context)" 
                    className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0 text-xs" 
                />
            </form>
        </div>
    );
};

export default UserTerminal;