
import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { Plus, Search, Edit2, Trash2, Shield, User as UserIcon, Lock, CheckCircle, XCircle, Ban, RefreshCw } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  setUsers: (users: User[]) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ users, setUsers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: UserRole.INSPECTOR
  });

  const resetForm = () => {
    setFormData({ name: '', username: '', password: '', role: UserRole.INSPECTOR });
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditClick = (user: User) => {
    setFormData({
        name: user.name,
        username: user.username,
        password: '', // Leave empty to indicate no change unless typed
        role: user.role
    });
    setEditingId(user.id);
    setIsModalOpen(true);
  };

  const handleStatusToggle = (userId: string, currentStatus: string) => {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const action = newStatus === 'active' ? 'activate' : 'deactivate';
      
      if (window.confirm(`Are you sure you want to ${action} this user?`)) {
          // @ts-ignore
          setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus as 'active' | 'inactive' } : u));
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
        // Update Existing User
        setUsers(users.map(u => u.id === editingId ? {
            ...u,
            name: formData.name,
            username: formData.username,
            role: formData.role,
            password: formData.password || u.password // Update password only if provided
        } : u));
    } else {
        // Create New User
        const id = `u${Date.now()}`;
        const newUser: User = {
            id,
            name: formData.name,
            username: formData.username,
            role: formData.role,
            status: 'active',
            lastLogin: '-',
            password: formData.password || 'password' // Save password from form
        };
        setUsers([...users, newUser]);
    }
    
    setIsModalOpen(false);
    resetForm();
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
            <p className="text-slate-500 text-sm">Manage system access, roles, and permissions.</p>
        </div>
        <button 
            onClick={openAddModal}
            className="px-4 py-2 bg-te-blue text-white rounded-lg hover:bg-te-dark transition-colors flex items-center shadow-sm"
        >
            <Plus size={18} className="mr-2" />
            Add New User
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center">
         <Search size={20} className="text-slate-400 mr-3" />
         <input 
            type="text" 
            placeholder="Search users by name or username..." 
            className="flex-1 outline-none text-slate-900 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
         />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                    <tr>
                        <th className="px-6 py-4 font-semibold">User Info</th>
                        <th className="px-6 py-4 font-semibold">Role</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold">Last Login</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((user) => (
                        <tr key={user.id} className={`hover:bg-slate-50 transition-colors ${user.status === 'inactive' ? 'opacity-60 bg-slate-50' : ''}`}>
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${user.status === 'inactive' ? 'bg-slate-200 text-slate-500' : 'bg-slate-100 text-te-blue'}`}>
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800">{user.name}</div>
                                        <div className="text-xs text-slate-500">@{user.username}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                {user.role === UserRole.ADMIN ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                                        <Shield size={10} className="mr-1" />
                                        ADMIN
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                        <UserIcon size={10} className="mr-1" />
                                        INSPECTOR
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                {user.status === 'active' ? (
                                    <span className="inline-flex items-center text-xs font-medium text-green-600">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                        Active
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center text-xs font-medium text-red-500">
                                        <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                                        Inactive
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-xs font-mono">
                                {user.lastLogin || '-'}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                    <button 
                                        onClick={() => handleEditClick(user)}
                                        className="p-1 text-slate-400 hover:text-te-blue transition-colors" 
                                        title="Edit User"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleStatusToggle(user.id, user.status)}
                                        className={`p-1 transition-colors ${user.status === 'active' ? 'text-slate-400 hover:text-red-500' : 'text-green-500 hover:text-green-700'}`} 
                                        title={user.status === 'active' ? "Deactivate User" : "Activate User"}
                                    >
                                        {user.status === 'active' ? <Ban size={18} /> : <RefreshCw size={18} />}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
                <div className="bg-[#5C2D91] px-6 py-4 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg">{editingId ? 'Edit User' : 'Add New User'}</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                        <XCircle size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            required
                            className="bg-white text-slate-900 w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-te-blue focus:border-transparent outline-none"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="e.g. Bassam Karim"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <input 
                            type="text" 
                            required
                            className="bg-white text-slate-900 w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-te-blue focus:border-transparent outline-none"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            placeholder="e.g. b.karim"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password {editingId && '(Leave blank to keep current)'}</label>
                        <div className="relative">
                            <input 
                                type="password" 
                                required={!editingId}
                                className="bg-white text-slate-900 w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-te-blue focus:border-transparent outline-none pr-10"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                placeholder="••••••••"
                            />
                            <Lock size={16} className="absolute right-3 top-3 text-slate-400" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({...formData, role: UserRole.INSPECTOR})}
                                className={`py-2 px-3 rounded border text-sm font-medium transition-all ${
                                    formData.role === UserRole.INSPECTOR 
                                    ? 'bg-blue-50 border-blue-500 text-blue-700' 
                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                Inspector
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({...formData, role: UserRole.ADMIN})}
                                className={`py-2 px-3 rounded border text-sm font-medium transition-all ${
                                    formData.role === UserRole.ADMIN 
                                    ? 'bg-purple-50 border-purple-500 text-purple-700' 
                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                Admin
                            </button>
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-4 py-2 border border-slate-300 text-slate-600 rounded hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 px-4 py-2 bg-[#5C2D91] text-white rounded hover:bg-[#37004B] transition-colors"
                        >
                            {editingId ? 'Update User' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
