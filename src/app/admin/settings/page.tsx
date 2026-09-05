"use client";

import React, { useEffect, useState } from 'react';
import { Settings, Save, CheckCircle, Loader2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    siteName: 'Travilever',
    siteTitle: 'Travilever | Explore The World',
    metaDescription: 'A premium travel blog and guide.',
    contactEmail: 'hello@travilever.com',
    contactPhone: '+91 xxxxxxxxxx',
    address: 'Sector X, Rohini, Delhi, India - 282002',
    facebook: 'https://facebook.com/travilever',
    instagram: 'https://instagram.com/travilever',
    youtube: 'https://youtube.com/travilever',
    twitter: 'https://twitter.com/travilever',
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');

    setTimeout(() => {
      setSaving(false);
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }, 800);
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-serif flex items-center gap-2">
          <Settings className="w-8 h-8 text-blue-600" /> General Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">Configure your blog's details, metadata, social profiles, and contact info.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        
        {success && (
          <div className="bg-green-50 text-green-600 border border-green-150 px-6 py-4 rounded-2xl text-sm flex items-center gap-2 shadow-sm font-semibold">
            <CheckCircle className="w-5 h-5" /> {success}
          </div>
        )}

        {/* Card 1: Site Info */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900 font-serif border-b border-gray-100 pb-3">Website Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Site Name</label>
              <input
                type="text"
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">SEO Meta Title</label>
              <input
                type="text"
                name="siteTitle"
                value={formData.siteTitle}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">SEO Meta Description</label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
              required
            ></textarea>
          </div>
        </div>

        {/* Card 2: Contact Info */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900 font-serif border-b border-gray-100 pb-3">Contact Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Public Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Public Contact Phone</label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Office Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* Card 3: Social Links */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900 font-serif border-b border-gray-100 pb-3">Social Profiles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Instagram URL</label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Facebook URL</label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">YouTube URL</label>
              <input
                type="url"
                name="youtube"
                value={formData.youtube}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Twitter / X URL</label>
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
