"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';

export default function AdminPostsList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetch('/api/posts?status=all&limit=1000').then(res => res.json()).then(data => {
      if(data.success) setPosts(data.data);
    });
  }, []);

  const activeCategories = new Set(posts.map(post => post.category).filter(Boolean)).size;

  // Dynamically compile available options from posts
  const statuses = ['All', ...Array.from(new Set(posts.map(p => p.status).filter(Boolean)))];
  const types = ['All', ...Array.from(new Set(posts.map(p => p.type || 'Blog').filter(Boolean)))];
  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery.trim() === '' || 
      (post.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.destination || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.instructorName || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || post.status === statusFilter;
    const matchesType = typeFilter === 'All' || (post.type || 'Blog') === typeFilter;
    const matchesCategory = categoryFilter === 'All' || post.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesType && matchesCategory;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setTypeFilter('All');
    setCategoryFilter('All');
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredPosts.map(post => post._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete the ${selectedIds.length} selected posts?`)) return;

    // Find all images from selected posts
    const imagesToDelete: string[] = [];
    selectedIds.forEach(id => {
      const p = posts.find(post => post._id === id);
      if (p) {
        if (p.image && p.image.startsWith('/uploads/')) {
          imagesToDelete.push(p.image);
        }
        if (p.instructorImage && p.instructorImage.startsWith('/uploads/')) {
          imagesToDelete.push(p.instructorImage);
        }
      }
    });

    let deleteImages = false;
    if (imagesToDelete.length > 0) {
      deleteImages = window.confirm(
        `Do you want to delete the image(s) used in these blogs from the image directory?\n\nImages found: ${imagesToDelete.length}`
      );
    }

    try {
      if (deleteImages) {
        for (const imgUrl of imagesToDelete) {
          const filename = imgUrl.substring(imgUrl.lastIndexOf('/') + 1);
          await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
            method: 'DELETE',
          });
        }
      }

      const deletePromises = selectedIds.map(id =>
        fetch(`/api/posts/${id}`, { method: 'DELETE' }).then(res => res.json())
      );
      
      const results = await Promise.all(deletePromises);
      const successfulIds: string[] = [];
      
      results.forEach((data, index) => {
        if (data.success) {
          successfulIds.push(selectedIds[index]);
        }
      });

      setPosts(prev => prev.filter(post => !successfulIds.includes(post._id)));
      setSelectedIds(prev => prev.filter(id => !successfulIds.includes(id)));

      if (successfulIds.length < selectedIds.length) {
        alert('Some posts could not be deleted.');
      } else {
        alert('Selected posts deleted successfully!');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during deletion.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    const postToDelete = posts.find(p => p._id === id);
    const imagesToDelete: string[] = [];
    if (postToDelete) {
      if (postToDelete.image && postToDelete.image.startsWith('/uploads/')) {
        imagesToDelete.push(postToDelete.image);
      }
      if (postToDelete.instructorImage && postToDelete.instructorImage.startsWith('/uploads/')) {
        imagesToDelete.push(postToDelete.instructorImage);
      }
    }

    let deleteImages = false;
    if (imagesToDelete.length > 0) {
      deleteImages = window.confirm(
        `Do you want to delete the image(s) used in this blog from the image directory?`
      );
    }

    try {
      if (deleteImages) {
        for (const imgUrl of imagesToDelete) {
          const filename = imgUrl.substring(imgUrl.lastIndexOf('/') + 1);
          await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
            method: 'DELETE',
          });
        }
      }

      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) => prev.filter((post) => post._id !== id));
      } else {
        alert(data.error || 'Failed to delete post.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      
      {/* Statistics Cards (Blue Theme) */}
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-blue-50 py-8 rounded-2xl text-center border border-blue-100 shadow-sm">
          <h3 className="text-blue-800 font-medium mb-2">Total Posts</h3>
          <p className="text-4xl font-bold text-blue-950">{posts.length}</p>
        </div>
        <div className="bg-blue-50 py-8 rounded-2xl text-center border border-blue-100 shadow-sm">
          <h3 className="text-blue-800 font-medium mb-2">Active Categories</h3>
          <p className="text-4xl font-bold text-blue-950">{activeCategories}</p>
        </div>
      </div>

      {/* Header & Action Buttons */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Insights (Posts)</h2>
        <div className="flex gap-3">
          <button 
            onClick={handleBulkDelete}
            disabled={selectedIds.length === 0}
            className="bg-red-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
          >
            Delete Selected ({selectedIds.length})
          </button>
          <Link href="/admin/posts/create" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            + Create Insight
          </Link>
        </div>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input 
          type="text" 
          placeholder="Search insights..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
        />
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm w-full text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="All">All Statuses</option>
          {statuses.filter(s => s !== 'All').map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select 
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm w-full text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="All">All Types</option>
          {types.filter(t => t !== 'All').map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm w-full text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="All">All Categories</option>
          {categories.filter(c => c !== 'All').map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
        <span>Showing {filteredPosts.length} insights</span>
        <button 
          onClick={handleResetFilters}
          className="text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer"
        >
          Reset Filters
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer" 
                    onChange={handleSelectAll}
                    checked={filteredPosts.length > 0 && selectedIds.length === filteredPosts.length}
                  />
                </th>
                <th className="px-6 py-4 font-semibold">Name ↕</th>
                <th className="px-6 py-4 font-semibold">Type ↕</th>
                <th className="px-6 py-4 font-semibold">Category ↕</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPosts.map((post: any) => (
                <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer" 
                      checked={selectedIds.includes(post._id)}
                      onChange={(e) => handleSelectOne(post._id, e.target.checked)}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
                  <td className="px-6 py-4 text-gray-500">{post.type || 'Blog'}</td>
                  <td className="px-6 py-4 text-gray-500">{post.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                      post.status === 'Active' || post.status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {post.status === 'PUBLISHED' ? 'Active' : (post.status || 'Active')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-4">
                      <Link href={`/admin/posts/${post._id}`} className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(post._id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}