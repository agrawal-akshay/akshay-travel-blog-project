"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  FolderOpen, 
  Users, 
  PlusCircle, 
  ArrowRight, 
  TrendingUp,
  Settings
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [draftSaving, setDraftSaving] = useState(false);

  useEffect(() => {
    fetch('/api/analytics/overview')
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          setStats(resData.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleQuickDraftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle || !draftContent) return;

    setDraftSaving(true);
    try {
      const slug = draftTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draftTitle,
          slug,
          content: draftContent,
          status: 'DRAFT',
          category: 'General',
        }),
      });

      if (res.ok) {
        alert('Draft saved successfully!');
        setDraftTitle('');
        setDraftContent('');
        
        // Refresh overview stats
        const updatedRes = await fetch('/api/analytics/overview');
        const updatedData = await updatedRes.json();
        if (updatedData.success) {
          setStats(updatedData.data);
        }
      } else {
        alert('Failed to save draft.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    } finally {
      setDraftSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 bg-zinc-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif">Welcome back, Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Here is what is happening on your travel blog today.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/posts/create" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> New Insight
          </Link>
          <Link href="/admin/settings" className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all flex items-center gap-2">
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Stat 1 */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-gray-400 font-semibold text-xs uppercase tracking-wider block">Total Insights</span>
            <span className="text-3xl font-bold text-gray-900 mt-2 block">{stats?.totalPosts || 0}</span>
            <span className="text-xs text-green-500 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +{stats?.postsThisWeek || 0} this week
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-gray-400 font-semibold text-xs uppercase tracking-wider block">Categories</span>
            <span className="text-3xl font-bold text-gray-900 mt-2 block">{stats?.totalCategories || 0}</span>
            <span className="text-xs text-gray-500 mt-1 block">Organized regions</span>
          </div>
          <div className="p-4 rounded-2xl bg-purple-50 text-purple-600">
            <FolderOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-gray-400 font-semibold text-xs uppercase tracking-wider block">Registered Admins</span>
            <span className="text-3xl font-bold text-gray-900 mt-2 block">{stats?.totalAdmins || 0}</span>
            <span className="text-xs text-gray-500 mt-1 block">Full dashboard access</span>
          </div>
          <div className="p-4 rounded-2xl bg-teal-50 text-teal-600">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Recent Insights */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 font-serif">Recent Insights</h2>
              <Link href="/admin/posts" className="text-blue-600 hover:text-blue-800 text-xs font-semibold flex items-center gap-1 transition-colors">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            
            <div className="divide-y divide-gray-100 overflow-x-auto">
              {stats?.recentPosts && stats.recentPosts.length > 0 ? (
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="text-gray-500 font-semibold border-b border-gray-100">
                      <th className="pb-3 pr-4">Title</th>
                      <th className="pb-3 px-4">Category</th>
                      <th className="pb-3 px-4">Status</th>
                      <th className="pb-3 pl-4 text-right">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats.recentPosts.map((post: any) => (
                      <tr key={post._id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="py-4 pr-4 font-semibold text-gray-900 truncate max-w-[200px]">
                          <Link href={`/admin/posts/${post._id}`} className="hover:text-blue-600">
                            {post.title}
                          </Link>
                        </td>
                        <td className="py-4 px-4 text-gray-500">{post.category}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            post.status === 'PUBLISHED' || post.status === 'Active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {post.status === 'PUBLISHED' ? 'Active' : post.status}
                          </span>
                        </td>
                        <td className="py-4 pl-4 text-right text-gray-400 text-xs whitespace-nowrap">
                          {formatDate(post.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 text-center text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No insights found. Start by writing one!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Quick Draft Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-serif mb-2">Quick Draft</h2>
            <p className="text-gray-400 text-xs mb-6">Jot down an idea to publish later as a draft.</p>
            
            <form onSubmit={handleQuickDraftSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Draft Title</label>
                <input 
                  type="text" 
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder="The next big destination..." 
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Quick Notes</label>
                <textarea 
                  rows={6}
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  placeholder="Outline key sights, tips, culinary highlight..." 
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={draftSaving}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {draftSaving ? 'Saving Draft...' : 'Save Draft'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
