"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Upload, Copy, Check, Loader2, FileImage } from 'lucide-react';

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/upload');
      const data = await res.json();
      if (data.success) {
        setMediaList(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUploadFile = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        fetchMedia();
      } else {
        alert(data.error || 'Failed to upload file.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 bg-zinc-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-serif">Media Library</h1>
        <p className="text-gray-500 text-sm mt-1">Upload and manage images to use inside your articles.</p>
      </div>

      {/* Upload Zone */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 bg-white ${
          dragActive ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 hover:border-blue-500'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />
        {uploading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-gray-600 font-medium">Uploading your image...</p>
          </div>
        ) : (
          <>
            <div className="p-4 rounded-full bg-blue-50 text-blue-600">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="text-gray-800 font-semibold text-lg">Click to upload, or drag and drop</p>
              <p className="text-gray-400 text-sm mt-1">Supports PNG, JPG, JPEG, WEBP or GIF (max 5MB)</p>
            </div>
          </>
        )}
      </div>

      {/* Media Grid */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 font-serif mb-6">Uploaded Assets</h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : mediaList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {mediaList.map((media) => (
              <div key={media.name} className="group border border-gray-150 rounded-2xl overflow-hidden bg-gray-50 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="relative aspect-square w-full bg-zinc-200 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={media.url} 
                    alt={media.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3 space-y-2">
                  <p className="text-xs text-gray-700 truncate font-medium" title={media.name}>
                    {media.name.substring(media.name.indexOf('-') + 1)}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(media.url, media.name + '-url');
                      }}
                      className="flex-1 bg-white border border-gray-200 hover:border-blue-500 text-gray-600 hover:text-blue-600 py-1.5 rounded-lg text-[10px] font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      title="Copy URL"
                    >
                      {copiedId === media.name + '-url' ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      URL
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(`![image](${media.url})`, media.name + '-md');
                      }}
                      className="flex-1 bg-white border border-gray-200 hover:border-blue-500 text-gray-600 hover:text-blue-600 py-1.5 rounded-lg text-[10px] font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      title="Copy Markdown"
                    >
                      {copiedId === media.name + '-md' ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      MD
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-400">
            <FileImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Your media library is empty.</p>
            <p className="text-gray-400 text-sm mt-1">Upload images above to use in your posts.</p>
          </div>
        )}
      </div>
    </div>
  );
}
