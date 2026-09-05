"use client";

import React, { useEffect, useState } from 'react';
import { Users, Search, Plus, Trash2, Shield, Calendar, Mail, UserPlus, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAdmins = () => {
    setLoading(true);
    fetch('/api/users')
      .then(async res => {
        if (res.status === 401) {
          window.location.href = '/admin/login?error=unauthorized';
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data && data.success) {
          // Filter to admins only
          setUsers(data.data.filter((u: any) => u.role === 'admin'));
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this Admin?')) return;
    try {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.filter(u => u._id !== id));
      } else {
        alert(data.error || 'Failed to delete admin.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role: 'admin' }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Admin registered successfully!');
        setUsername('');
        setEmail('');
        setPassword('');
        setModalOpen(false);
        fetchAdmins();
      } else {
        alert(data.error || 'Failed to register admin.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAdmins = users.filter(u => 
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 bg-zinc-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif">Admins Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Manage system administrators with full dashboard privilege access.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Add Admin
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-gray-400 font-semibold text-xs uppercase tracking-wider block">Total Admins</span>
            <span className="text-3xl font-bold text-gray-900 mt-2 block">{users.length}</span>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
            <Shield className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredAdmins.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="text-gray-500 font-semibold border-b border-gray-200 bg-gray-50/70">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Privilege Role</th>
                  <th className="py-4 px-6">Created At</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAdmins.map((user) => (
                  <tr key={user._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-gray-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase">
                        {user.username?.substring(0, 2) || 'AD'}
                      </div>
                      {user.username}
                    </td>
                    <td className="py-4 px-6 text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {user.email}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-semibold border border-blue-100">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-400 text-xs">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {formatDate(user.createdAt)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                        title="Delete Admin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No admins matching search query.</p>
          </div>
        )}
      </div>

      {/* Add Admin Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-gray-200 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-gray-900 font-serif">Add New Admin</h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Admin Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  placeholder="john@travilever.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md mt-4 cursor-pointer"
              >
                {submitting ? 'Creating...' : 'Create Admin Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
