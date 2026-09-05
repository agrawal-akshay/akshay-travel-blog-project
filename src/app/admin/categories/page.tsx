"use client";

import React, { useEffect, useState } from 'react';
import { Trash2, Loader2, PlusCircle, CheckCircle } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('bg-blue-500');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const colors = [
    { name: 'Blue', value: 'bg-blue-500' },
    { name: 'Red', value: 'bg-red-500' },
    { name: 'Green', value: 'bg-green-500' },
    { name: 'Orange', value: 'bg-orange-500' },
    { name: 'Purple', value: 'bg-purple-500' },
    { name: 'Teal', value: 'bg-teal-500' },
    { name: 'Yellow', value: 'bg-yellow-500' },
    { name: 'Emerald', value: 'bg-emerald-500' },
  ];

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setSlug(generatedSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description, color }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('Category created successfully!');
        setName('');
        setSlug('');
        setDescription('');
        setColor('bg-blue-500');
        fetchCategories();
      } else {
        setError(data.error || 'Failed to create category.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Category deleted successfully!');
        fetchCategories();
      } else {
        alert(data.error || 'Failed to delete category.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 bg-zinc-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif">Categories Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and create categories to organize your blog posts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Categories List */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 font-serif mb-6">All Categories</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-12 flex-1">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : categories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="text-gray-500 font-semibold border-b border-gray-100 pb-3">
                    <th className="pb-3 pr-4">Category Name</th>
                    <th className="pb-3 px-4">Slug</th>
                    <th className="pb-3 px-4">Posts</th>
                    <th className="pb-3 px-4">Color Tag</th>
                    <th className="pb-3 pl-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="py-4 pr-4 font-semibold text-gray-900">{cat.name}</td>
                      <td className="py-4 px-4 text-gray-500">{cat.slug}</td>
                      <td className="py-4 px-4 text-gray-500">{cat.posts || 0}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block w-3 h-3 rounded-full ${cat.color}`}></span>
                        <span className="text-xs text-gray-400 ml-2 font-mono">{cat.color}</span>
                      </td>
                      <td className="py-4 pl-4 text-center">
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400 flex-1 flex flex-col items-center justify-center">
              <p>No categories found. Use the form to create one!</p>
            </div>
          )}
        </div>

        {/* Right column: Create Category Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 font-serif mb-2">Create Category</h2>
          <p className="text-gray-400 text-xs mb-6">Add a new category with a color label.</p>

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-150 px-4 py-2.5 rounded-xl text-xs mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-600 border border-green-150 px-4 py-2.5 rounded-xl text-xs mb-4 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Category Name</label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Travel Tips"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. travel-tips"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this category about..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Theme Color</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
              >
                {colors.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Category...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  Add Category
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
