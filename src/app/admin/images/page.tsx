"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Link as LinkIcon, Search, Image as ImageIcon, Upload, Loader2, Check } from 'lucide-react';

interface MediaFile {
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export default function ImageDirectoryPage() {
  const [images, setImages] = useState<MediaFile[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch images from the upload API directory
  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/upload');
      const data = await res.json();
      if (data.success) {
        setImages(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch images:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts?status=all&limit=1000');
      const data = await res.json();
      if (data.success && data.data) {
        setPosts(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    }
  };

  useEffect(() => {
    fetchImages();
    fetchPosts();
  }, []);

  const getBlogsUsingImage = (imgUrl: string, imgName: string) => {
    const usedBlogs: string[] = [];
    const lowercaseName = imgName.toLowerCase();
    
    posts.forEach(post => {
      let isUsed = false;
      
      if (post.image && (post.image.includes(imgUrl) || post.image.toLowerCase().includes(lowercaseName))) {
        isUsed = true;
      }
      
      if (post.instructorImage && (post.instructorImage.includes(imgUrl) || post.instructorImage.toLowerCase().includes(lowercaseName))) {
        isUsed = true;
      }
      
      if (post.content && (post.content.includes(imgUrl) || post.content.toLowerCase().includes(lowercaseName))) {
        isUsed = true;
      }
      
      if (isUsed) {
        usedBlogs.push(post.title);
      }
    });
    
    return usedBlogs;
  };

  // Handle uploading of files directly inside the Image Directory
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        fetchImages();
      } else {
        alert(data.error || 'Failed to upload image.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during file upload.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle deletion of image from directory (and computer folder)
  const handleDelete = async (filename: string) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}"?\nThis will remove the file from the computer folder.`)) return;

    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setImages(prev => prev.filter(img => img.name !== filename));
      } else {
        alert(data.error || 'Failed to delete image.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during image deletion.');
    }
  };

  // Format file size helper
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Copy direct url link helper
  const handleCopyLink = (url: string, index: number) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Filter images by search query
  const filteredImages = images.filter(img => 
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Image Directory</h1>
          <p className="text-gray-500 text-sm mt-1">Manage files uploaded to your local machine (`public/uploads`).</p>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            accept="image/*"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:bg-blue-400"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" /> Upload New Image
              </>
            )}
          </button>
        </div>
      </div>

      {/* Statistics Header (Sync Status) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100/50 rounded-lg text-blue-600">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-blue-800 text-sm font-medium">Total Directory Images</h3>
            <p className="text-2xl font-bold text-blue-950 mt-0.5">{images.length}</p>
          </div>
        </div>
        <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-100/50 rounded-lg text-emerald-600">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-emerald-800 text-sm font-medium">Folder Sync State</h3>
            <p className="text-lg font-bold text-emerald-950 mt-0.5">Live Bidirectional Sync</p>
          </div>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search directory by filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-500">Scanning local uploads directory...</p>
        </div>
      ) : filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((img, idx) => (
            <div
              key={img.name}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Media File Metadata */}
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 truncate mb-1" title={img.name}>
                    {img.name}
                  </h4>
                  <div className="mt-1.5 mb-2 select-none">
                    {(() => {
                      const usedBlogs = getBlogsUsingImage(img.url, img.name);
                      if (usedBlogs.length > 0) {
                        return (
                          <div className="text-[11px] text-blue-600 font-medium">
                            <span className="text-gray-500 font-normal">Used in: </span>
                            <span className="truncate block mt-0.5" title={usedBlogs.join(', ')}>
                              {usedBlogs.join(', ')}
                            </span>
                          </div>
                        );
                      }
                      return (
                        <span className="text-[11px] text-gray-400 italic">Unused / Not linked</span>
                      );
                    })()}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                    <span>{formatSize(img.size)}</span>
                    <span>{new Date(img.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleCopyLink(img.url, idx)}
                    className="flex-1 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-gray-200 hover:border-blue-200 cursor-pointer"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-3.5 h-3.5" /> Copy Link
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(img.name)}
                    className="bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 p-1.5 rounded-lg border border-gray-200 hover:border-red-200 transition-colors cursor-pointer"
                    title="Delete Image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-900 font-medium mb-1">No images found</p>
          <p className="text-gray-500 text-sm">
            {searchQuery ? 'Try adjusting your search keywords.' : 'Upload your first image to get started.'}
          </p>
        </div>
      )}
    </div>
  );
}