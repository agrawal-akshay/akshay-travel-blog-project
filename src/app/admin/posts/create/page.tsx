"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateInsightPage() {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const editorImageInputRef = useRef<HTMLInputElement>(null);
  const savedEditorRangeRef = useRef<Range | null>(null);
  
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState<{ top: number; left: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const resizeRef = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    handle: string;
    editorWidth: number;
  } | null>(null);

  const selectElement = (element: HTMLElement | null) => {
    if (selectedElement) {
      selectedElement.classList.remove('selected-media');
    }
    setSelectedElement(element);
    if (element) {
      element.classList.add('selected-media');
      updateToolbarPosition(element);
    } else {
      setToolbarPosition(null);
    }
  };

  const updateToolbarPosition = (element: HTMLElement) => {
    if (!editorRef.current) return;
    const parentContainer = editorRef.current.parentElement;
    if (!parentContainer) return;

    const parentRect = parentContainer.getBoundingClientRect();
    const elemRect = element.getBoundingClientRect();

    setToolbarPosition({
      top: elemRect.top - parentRect.top - 45,
      left: elemRect.left - parentRect.left + (elemRect.width / 2) - 150
    });
  };

  const normalizeEditorHtml = (html: string) => {
    if (typeof document === 'undefined') return html;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    doc.querySelectorAll('.video-container').forEach(el => {
      el.setAttribute('draggable', 'true');
      const overlay = el.querySelector('.iframe-overlay');
      if (!overlay) {
        const div = document.createElement('div');
        div.className = 'iframe-overlay absolute inset-0 bg-transparent cursor-pointer z-10';
        div.setAttribute('style', 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: transparent; cursor: pointer; z-index: 10;');
        el.prepend(div);
      }
      const iframe = el.querySelector('iframe');
      if (iframe) {
        iframe.style.pointerEvents = 'none';
      }
    });

    doc.querySelectorAll('img').forEach(img => {
      if (!img.style.width) {
        img.style.width = '100%';
      }
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.transition = 'all 0.3s';
    });

    return doc.body.innerHTML;
  };

  const moveUp = () => {
    if (!selectedElement) return;
    const parent = selectedElement.parentNode;
    if (!parent) return;
    const previous = selectedElement.previousSibling;
    if (previous) {
      parent.insertBefore(selectedElement, previous);
      updateToolbarPosition(selectedElement);
      setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
    }
  };

  const moveDown = () => {
    if (!selectedElement) return;
    const parent = selectedElement.parentNode;
    if (!parent) return;
    const next = selectedElement.nextSibling;
    if (next) {
      parent.insertBefore(selectedElement, next.nextSibling);
      updateToolbarPosition(selectedElement);
      setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
    }
  };

  const deleteElement = () => {
    if (!selectedElement) return;
    selectedElement.remove();
    selectElement(null);
  };

  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    let element: HTMLElement | null = null;
    
    if (target.tagName === 'IMG') {
      element = target;
    } else if (target.classList.contains('iframe-overlay')) {
      element = target.parentElement;
    }
    
    if (element) {
      selectElement(element);
    } else {
      selectElement(null);
    }
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (selectedElement && (e.key === 'Delete' || e.key === 'Backspace')) {
      e.preventDefault();
      selectedElement.remove();
      selectElement(null);
      return;
    }
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
      selectElement(null);
    }
  };

  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedElement || !editorRef.current) return;

    const elemRect = selectedElement.getBoundingClientRect();
    const editorRect = editorRef.current.getBoundingClientRect();

    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: elemRect.width,
      startHeight: elemRect.height,
      handle,
      editorWidth: editorRect.width - 40
    };

    setIsDragging(true);

    window.addEventListener('mousemove', handleResizeMove);
    window.addEventListener('mouseup', handleResizeEnd);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!resizeRef.current || !selectedElement) return;
    const { startX, startY, startWidth, startHeight, handle, editorWidth } = resizeRef.current;

    let deltaX = e.clientX - startX;
    let deltaY = e.clientY - startY;

    let newWidth = startWidth;
    if (handle.includes('r')) {
      newWidth = startWidth + deltaX;
    } else if (handle.includes('l')) {
      newWidth = startWidth - deltaX;
    } else if (handle === 'b' || handle === 't') {
      const ratio = startWidth / startHeight;
      const newHeight = handle === 'b' ? startHeight + deltaY : startHeight - deltaY;
      newWidth = newHeight * ratio;
    }

    let widthPercent = (newWidth / editorWidth) * 100;
    widthPercent = Math.min(100, Math.max(10, widthPercent));

    selectedElement.style.width = `${widthPercent}%`;

    setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
    updateToolbarPosition(selectedElement);
  };

  const handleResizeEnd = () => {
    setIsDragging(false);
    resizeRef.current = null;
    window.removeEventListener('mousemove', handleResizeMove);
    window.removeEventListener('mouseup', handleResizeEnd);
  };

  useEffect(() => {
    const handleScrollOrResize = () => {
      if (selectedElement) {
        updateToolbarPosition(selectedElement);
      }
    };
    
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener('scroll', handleScrollOrResize);
    }
    window.addEventListener('resize', handleScrollOrResize);
    
    return () => {
      if (editor) {
        editor.removeEventListener('scroll', handleScrollOrResize);
      }
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [selectedElement]);

  
  const [categories, setCategories] = useState<string[]>([
    'Adventure',
    'Luxury Travel',
    'Budget Backpacking',
    'Food & Culinary',
    'Solo Travel',
    'Photography',
    'Road Trips',
    'Sustainable Travel'
  ]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          setCategories(data.data.map((c: any) => c.name));
        }
      })
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear().toString();
    const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    const currentDay = now.getDate().toString().padStart(2, '0');
    
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // convert 0 to 12
    const currentTime = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;

    setFormData(prev => ({
      ...prev,
      year: currentYear,
      month: currentMonth,
      day: currentDay,
      time: currentTime
    }));
  }, []);

  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingInstructor, setIsUploadingInstructor] = useState(false);
  const [formData, setFormData] = useState({
    title: '', slug: '', excerpt: '', image: '', content: '',
    instructorName: '', instructorImage: '', destination: '',
    year: '', month: '', day: '', time: '',
    metaTitle: '', metaKeywords: '', metaDescription: '',
    status: 'Active', category: '', type: 'Blog'
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const readAsDataUrl = (fileToRead: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(fileToRead);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFormData(prev => ({ ...prev, image: data.url }));
      } else {
        const fallbackUrl = await readAsDataUrl(file);
        if (fallbackUrl) {
          setFormData(prev => ({ ...prev, image: fallbackUrl }));
        } else {
          alert(data.error || 'Failed to upload image');
        }
      }
    } catch (error) {
      console.error('Upload error, using FileReader fallback:', error);
      const fallbackUrl = await readAsDataUrl(file);
      if (fallbackUrl) {
        setFormData(prev => ({ ...prev, image: fallbackUrl }));
      } else {
        alert('Failed to upload image');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleInstructorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingInstructor(true);
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFormData(prev => ({ ...prev, instructorImage: data.url }));
      } else {
        const fallbackUrl = await readAsDataUrl(file);
        if (fallbackUrl) {
          setFormData(prev => ({ ...prev, instructorImage: fallbackUrl }));
        } else {
          alert(data.error || 'Failed to upload image');
        }
      }
    } catch (error) {
      console.error('Upload error, using FileReader fallback:', error);
      const fallbackUrl = await readAsDataUrl(file);
      if (fallbackUrl) {
        setFormData(prev => ({ ...prev, instructorImage: fallbackUrl }));
      } else {
        alert('Failed to upload image');
      }
    } finally {
      setIsUploadingInstructor(false);
    }
  };

  const handleEditorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let imageUrl = '';
      try {
        const data = new FormData();
        data.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: data,
        });

        const result = await res.json();
        if (result.success && result.url) {
          imageUrl = result.url;
        }
      } catch (e) {
        console.warn('API upload failed, using FileReader fallback');
      }

      if (!imageUrl) {
        imageUrl = await readAsDataUrl(file);
      }

      if (imageUrl) {
        if (editorRef.current) {
          editorRef.current.focus();
        }
        const sel = window.getSelection();
        if (savedEditorRangeRef.current && sel) {
          sel.removeAllRanges();
          sel.addRange(savedEditorRangeRef.current);
        }

        document.execCommand(
          'insertHTML', 
          false, 
          `<img src="${imageUrl}" alt="${file.name}" class="rounded-lg my-4 shadow" style="max-width: 100%; width: 100%; height: auto; transition: all 0.3s;" />`
        );
        
        setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
      } else {
        alert('Failed to upload image.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during file upload.');
    } finally {
      if (editorImageInputRef.current) {
        editorImageInputRef.current.value = '';
      }
    }
  };

  const handleFormat = (type: string) => {
    if (!editorRef.current) return;

    // Save selection range before showing prompts (which steals focus)
    const sel = window.getSelection();
    let savedRange: Range | null = null;
    if (sel && sel.rangeCount > 0) {
      savedRange = sel.getRangeAt(0);
    }

    editorRef.current.focus();

    switch (type) {
      case 'h1':
        document.execCommand('formatBlock', false, 'H1');
        break;
      case 'h2':
        document.execCommand('formatBlock', false, 'H2');
        break;
      case 'b':
        document.execCommand('bold', false);
        break;
      case 'i':
        document.execCommand('italic', false);
        break;
      case 'u':
        document.execCommand('underline', false);
        break;
      case 's':
        document.execCommand('strikeThrough', false);
        break;
      case 'textcolor':
        const color = window.prompt('Enter text color (e.g. red, #0055ff, blue):', '#ff0000');
        if (color) {
          document.execCommand('foreColor', false, color);
        }
        break;
      case 'bgcolor':
        const bgColor = window.prompt('Enter highlight color (e.g. yellow, #fffaaa, lightgreen):', 'yellow');
        if (bgColor) {
          document.execCommand('hiliteColor', false, bgColor);
        }
        break;
      case 'sub':
        document.execCommand('subscript', false);
        break;
      case 'sup':
        document.execCommand('superscript', false);
        break;
      case 'align':
        const alignment = window.prompt('Enter text alignment (left, center, right, justify):', 'center');
        if (alignment) {
          if (alignment === 'left') document.execCommand('justifyLeft', false);
          else if (alignment === 'center') document.execCommand('justifyCenter', false);
          else if (alignment === 'right') document.execCommand('justifyRight', false);
          else if (alignment === 'justify') document.execCommand('justifyFull', false);
        }
        break;
      case 'quote':
        document.execCommand('formatBlock', false, 'blockquote');
        break;
      case 'code':
        document.execCommand('formatBlock', false, 'pre');
        break;
      case 'link':
        const linkUrl = window.prompt('Enter link URL:');
        // Restore selection range
        if (savedRange && sel) {
          sel.removeAllRanges();
          sel.addRange(savedRange);
        }
        if (linkUrl) {
          let formattedUrl = linkUrl.trim();
          if (!/^https?:\/\//i.test(formattedUrl) && !formattedUrl.startsWith('/') && !formattedUrl.startsWith('mailto:') && !formattedUrl.startsWith('tel:')) {
            formattedUrl = 'https://' + formattedUrl;
          }
          const selectionText = sel?.toString() || 'Link';
          document.execCommand('insertHTML', false, `<a href="${formattedUrl}" class="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">${selectionText}</a>`);
        }
        break;
      case 'image':
        // Save range inside savedEditorRangeRef
        if (sel && sel.rangeCount > 0) {
          savedEditorRangeRef.current = sel.getRangeAt(0);
        }

        const uploadFromComputer = window.confirm("Do you want to upload an image from your computer?\n\n(Click 'OK' to upload from computer, or 'Cancel' to enter an image URL)");
        if (uploadFromComputer) {
          editorImageInputRef.current?.click();
        } else {
          let imageUrl = window.prompt('Enter image URL (paste direct link or Unsplash page URL):');
          // Restore selection range
          if (savedEditorRangeRef.current && sel) {
            sel.removeAllRanges();
            sel.addRange(savedEditorRangeRef.current);
          }
          if (imageUrl && imageUrl.trim() !== '') {
            imageUrl = imageUrl.trim();
            if (imageUrl.includes('unsplash.com') && !imageUrl.includes('images.unsplash.com')) {
              imageUrl = `/api/unsplash-proxy?url=${encodeURIComponent(imageUrl)}`;
            } else if (!/^https?:\/\//i.test(imageUrl) && !imageUrl.startsWith('/')) {
              imageUrl = 'https://' + imageUrl;
            }
            document.execCommand('insertHTML', false, `<img src="${imageUrl}" alt="Image" class="rounded-lg my-4 shadow" style="max-width: 100%; width: 100%; height: auto; transition: all 0.3s;" />`);
            setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
          }
        }
        break;
      case 'embed':
        const embedUrl = window.prompt('Enter video embed URL (e.g. YouTube embed URL):');
        // Restore selection range
        if (savedRange && sel) {
          sel.removeAllRanges();
          sel.addRange(savedRange);
        }
        if (embedUrl) {
          let formattedUrl = embedUrl.trim();
          if (!/^https?:\/\//i.test(formattedUrl) && !formattedUrl.startsWith('/')) {
            formattedUrl = 'https://' + formattedUrl;
          }
          const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
          const match = formattedUrl.match(regExp);
          if (match && match[2].length === 11) {
            formattedUrl = `https://www.youtube.com/embed/${match[2]}`;
          }
          document.execCommand(
            'insertHTML', 
            false, 
            `<div class="video-container relative my-4 block" style="width: 100%; max-width: 100%; transition: all 0.3s;" data-embed-url="${formattedUrl}" draggable="true">` +
              `<div class="iframe-overlay absolute inset-0 bg-transparent cursor-pointer z-10" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: transparent; cursor: pointer; z-index: 10;"></div>` +
              `<iframe src="${formattedUrl}" class="w-full aspect-video rounded-lg shadow" frameborder="0" allowfullscreen style="pointer-events: none;"></iframe>` +
            `</div>`
          );
        }
        break;
      case 'clear':
        document.execCommand('removeFormat', false);
        break;
      default:
        return;
    }

    setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
  };

  const handleFontFamily = (font: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('fontName', false, font);
    setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
  };

  const handleFormatSize = (size: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    if (size === 'h1' || size === 'h2' || size === 'p') {
      document.execCommand('formatBlock', false, size.toUpperCase());
    } else if (size === 'small') {
      document.execCommand('fontSize', false, '2');
    } else if (size === 'large') {
      document.execCommand('fontSize', false, '5');
    }
    setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
  };

  const handleTitleChange = (e: any) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData({ ...formData, title, slug });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      alert("Insight Created Successfully!");
      router.push('/admin/posts');
    } else {
      alert("Something went wrong!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 font-serif">Create Insight</h2>
      
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        
        {/* Section 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
              <input type="text" name="title" value={formData.title} onChange={handleTitleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Short Description</label>
              <input type="text" name="excerpt" value={formData.excerpt} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Instructor Image</label>
              <input 
                type="text" 
                name="instructorImage" 
                placeholder="Instructor Image URL" 
                value={formData.instructorImage} 
                onChange={handleChange} 
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all mb-2" 
              />
              <div className="flex items-center gap-3">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleInstructorImageUpload} 
                  className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 file:cursor-pointer hover:file:bg-blue-100" 
                />
                {isUploadingInstructor && <span className="text-xs text-blue-500 animate-pulse">Uploading...</span>}
              </div>
              {formData.instructorImage && (
                <div className="mt-3 relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.instructorImage} alt="Instructor Image Preview" className="max-h-full max-w-full object-contain" />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">SEO URL</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Feature Image</label>
              <input 
                type="text" 
                name="image" 
                placeholder="Feature Image URL" 
                value={formData.image} 
                onChange={handleChange} 
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all mb-2" 
              />
              <div className="flex items-center gap-3">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 file:cursor-pointer hover:file:bg-blue-100" 
                />
                {isUploading && <span className="text-xs text-blue-500 animate-pulse">Uploading...</span>}
              </div>
              {formData.image && (
                <div className="mt-3 relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.image} alt="Feature Image Preview" className="max-h-full max-w-full object-contain" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Instructor Name</label>
              <input type="text" name="instructorName" value={formData.instructorName} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="Instructor Name" />
            </div>
          </div>
        </div>

        {/* Section 2: Details (Rich Text Editor Mockup) */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Details</label>
          <div className="relative border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-500 transition-all">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-3.5 text-gray-600 text-xs overflow-x-auto select-none font-sans font-medium">
              <span className="font-bold cursor-pointer hover:text-blue-600 text-sm" onMouseDown={(e) => { e.preventDefault(); handleFormat('h1'); }}>H₁</span>
              <span className="font-bold cursor-pointer hover:text-blue-600 text-sm" onMouseDown={(e) => { e.preventDefault(); handleFormat('h2'); }}>H₂</span>
              
              <div className="flex items-center border border-gray-200 rounded px-1.5 py-0.5 bg-white">
                <select 
                  className="bg-transparent border-0 outline-none cursor-pointer hover:text-blue-600 text-xs py-px pr-4"
                  onChange={(e) => {
                    if (e.target.value) {
                      handleFontFamily(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>Sans Serif</option>
                  <option value="sans-serif">Sans Serif</option>
                  <option value="serif">Serif</option>
                  <option value="monospace">Monospace</option>
                  <option value="cursive">Cursive</option>
                </select>
              </div>

              <div className="flex items-center border border-gray-200 rounded px-1.5 py-0.5 bg-white">
                <select 
                  className="bg-transparent border-0 outline-none cursor-pointer hover:text-blue-600 text-xs py-px pr-4"
                  onChange={(e) => {
                    if (e.target.value) {
                      handleFormatSize(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>Normal</option>
                  <option value="p">Normal</option>
                  <option value="small">Small</option>
                  <option value="large">Large</option>
                  <option value="h1">Heading 1</option>
                  <option value="h2">Heading 2</option>
                </select>
              </div>

              <div className="w-px h-4 bg-gray-300 mx-1"></div>
              
              <span className="font-bold cursor-pointer hover:text-blue-600 text-sm px-0.5" onMouseDown={(e) => { e.preventDefault(); handleFormat('b'); }}>B</span>
              <span className="italic cursor-pointer hover:text-blue-600 text-sm px-0.5" onMouseDown={(e) => { e.preventDefault(); handleFormat('i'); }}>I</span>
              <span className="underline cursor-pointer hover:text-blue-600 text-sm px-0.5" onMouseDown={(e) => { e.preventDefault(); handleFormat('u'); }}>U</span>
              <span className="line-through cursor-pointer hover:text-blue-600 text-sm px-0.5" onMouseDown={(e) => { e.preventDefault(); handleFormat('s'); }}>S</span>
              
              <div className="w-px h-4 bg-gray-300 mx-1"></div>
              
              {/* Text Color (A underlined) */}
              <span className="cursor-pointer hover:text-blue-600 font-bold border-b-2 border-red-500 px-0.5 text-sm" onMouseDown={(e) => { e.preventDefault(); handleFormat('textcolor'); }}>A</span>
              
              {/* Highlight Background Color (A highlighted) */}
              <span className="cursor-pointer hover:text-blue-600 font-bold bg-yellow-200 px-1 rounded text-sm" onMouseDown={(e) => { e.preventDefault(); handleFormat('bgcolor'); }}>A</span>
              
              {/* Subscript */}
              <span className="cursor-pointer hover:text-blue-600 text-xs font-semibold px-0.5" onMouseDown={(e) => { e.preventDefault(); handleFormat('sub'); }}>X₂</span>
              
              {/* Superscript */}
              <span className="cursor-pointer hover:text-blue-600 text-xs font-semibold px-0.5" onMouseDown={(e) => { e.preventDefault(); handleFormat('sup'); }}>X²</span>
              
              {/* Text Alignment */}
              <div className="flex items-center gap-1 bg-white border border-gray-250 rounded px-1 py-0.5 select-none">
                <button type="button" title="Align Left" className="hover:text-blue-600 px-1 font-bold text-[10px] cursor-pointer" onMouseDown={(e) => { e.preventDefault(); document.execCommand('justifyLeft', false); setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML })); }}>L</button>
                <button type="button" title="Align Center" className="hover:text-blue-600 px-1 font-bold text-[10px] cursor-pointer" onMouseDown={(e) => { e.preventDefault(); document.execCommand('justifyCenter', false); setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML })); }}>C</button>
                <button type="button" title="Align Right" className="hover:text-blue-600 px-1 font-bold text-[10px] cursor-pointer" onMouseDown={(e) => { e.preventDefault(); document.execCommand('justifyRight', false); setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML })); }}>R</button>
                <button type="button" title="Justify" className="hover:text-blue-600 px-1 font-bold text-[10px] cursor-pointer" onMouseDown={(e) => { e.preventDefault(); document.execCommand('justifyFull', false); setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML })); }}>J</button>
              </div>
              
              {/* Blockquote */}
              <span className="cursor-pointer hover:text-blue-600 text-base font-serif leading-none px-0.5" onMouseDown={(e) => { e.preventDefault(); handleFormat('quote'); }}>”</span>
              
              {/* Code block */}
              <span className="cursor-pointer hover:text-blue-600 font-mono text-sm px-0.5" onMouseDown={(e) => { e.preventDefault(); handleFormat('code'); }}>&lt;/&gt;</span>
              
              <div className="w-px h-4 bg-gray-300 mx-1"></div>
              
              {/* Link */}
              <span className="cursor-pointer hover:text-blue-600 text-sm px-0.5" onMouseDown={(e) => { e.preventDefault(); handleFormat('link'); }}>🔗</span>
              
              {/* Image */}
              <span className="cursor-pointer hover:text-blue-600 text-sm px-0.5" onMouseDown={(e) => { e.preventDefault(); handleFormat('image'); }}>🖼️</span>
              
              {/* Video/Embed */}
              <span className="cursor-pointer hover:text-blue-600 text-sm px-0.5" onMouseDown={(e) => { e.preventDefault(); handleFormat('embed'); }}>📹</span>
              
              <div className="w-px h-4 bg-gray-300 mx-1"></div>

              <span className="cursor-pointer hover:text-blue-600 text-xs font-semibold px-1 py-0.5 border border-gray-300 rounded hover:bg-gray-100" onMouseDown={(e) => { e.preventDefault(); handleFormat('clear'); }}>Tₓ</span>
            </div>
            <div 
              ref={editorRef}
              contentEditable
              onInput={(e) => {
                const html = e.currentTarget.innerHTML;
                setFormData(prev => ({ ...prev, content: html }));
              }}
              onClick={handleEditorClick}
              onKeyDown={handleEditorKeyDown}
              className="editor-content-area w-full p-5 min-h-[300px] text-sm focus:outline-none overflow-y-auto bg-white prose dark:prose-invert max-w-none text-gray-800"
              {...{placeholder: "Write your full content here..."}}
            />
            <input 
              type="file" 
              ref={editorImageInputRef} 
              onChange={handleEditorImageUpload} 
              accept="image/*" 
              className="hidden" 
            />

            {selectedElement && toolbarPosition && (
              <>
                {/* Visual outline and resize handles */}
                <div 
                  className="absolute pointer-events-none border-2 border-blue-500 z-40 select-none"
                  style={{
                    top: `${selectedElement.getBoundingClientRect().top - editorRef.current!.parentElement!.getBoundingClientRect().top}px`,
                    left: `${selectedElement.getBoundingClientRect().left - editorRef.current!.parentElement!.getBoundingClientRect().left}px`,
                    width: `${selectedElement.getBoundingClientRect().width}px`,
                    height: `${selectedElement.getBoundingClientRect().height}px`,
                    transition: isDragging ? 'none' : 'top 0.1s ease-out, left 0.1s ease-out, width 0.1s ease-out, height 0.1s ease-out'
                  }}
                >
                  {/* Render the 8 handles */}
                  {['tl', 't', 'tr', 'r', 'br', 'b', 'bl', 'l'].map((handle) => {
                    let cursorClass = '';
                    let style: React.CSSProperties = {};
                    
                    const size = 8;
                    const offset = -size / 2;
                    
                    if (handle === 'tl') { style = { top: offset, left: offset }; cursorClass = 'cursor-nwse-resize'; }
                    else if (handle === 't') { style = { top: offset, left: '50%', transform: 'translateX(-50%)' }; cursorClass = 'cursor-ns-resize'; }
                    else if (handle === 'tr') { style = { top: offset, right: offset }; cursorClass = 'cursor-nesw-resize'; }
                    else if (handle === 'r') { style = { top: '50%', right: offset, transform: 'translateY(-50%)' }; cursorClass = 'cursor-ew-resize'; }
                    else if (handle === 'br') { style = { bottom: offset, right: offset }; cursorClass = 'cursor-nwse-resize'; }
                    else if (handle === 'b') { style = { bottom: offset, left: '50%', transform: 'translateX(-50%)' }; cursorClass = 'cursor-ns-resize'; }
                    else if (handle === 'bl') { style = { bottom: offset, left: offset }; cursorClass = 'cursor-nesw-resize'; }
                    else if (handle === 'l') { style = { top: '50%', left: offset, transform: 'translateY(-50%)' }; cursorClass = 'cursor-ew-resize'; }

                    return (
                      <div
                        key={handle}
                        className={`absolute w-[8px] h-[8px] bg-white border border-blue-600 shadow-sm pointer-events-auto z-50 ${cursorClass}`}
                        style={style}
                        onMouseDown={(e) => handleResizeStart(e, handle)}
                      />
                    );
                  })}
                </div>

                {/* Floating controls toolbar */}
                <div 
                  className="absolute z-50 bg-gray-900 text-white rounded-lg shadow-xl px-3 py-2 flex items-center gap-3.5 text-xs font-medium border border-gray-800 select-none"
                  style={{ 
                    top: `${toolbarPosition.top}px`, 
                    left: `${Math.max(10, toolbarPosition.left)}px`,
                    transition: isDragging ? 'none' : 'top 0.1s ease-out, left 0.1s ease-out'
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {/* Float/Alignment Section */}
                  <div className="flex items-center gap-1.5 border-r border-gray-700 pr-3">
                    <button 
                      type="button" 
                      title="Align Left (Float)" 
                      onClick={() => {
                        selectedElement.style.float = 'left';
                        selectedElement.style.margin = '0.5rem 1.5rem 0.5rem 0';
                        selectedElement.style.display = 'inline';
                        if (selectedElement.tagName === 'DIV') {
                          selectedElement.style.display = 'block';
                        }
                        setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
                        updateToolbarPosition(selectedElement);
                      }}
                      className="hover:text-blue-400 p-0.5 font-semibold cursor-pointer"
                    >
                      Left
                    </button>
                    <button 
                      type="button" 
                      title="Align Center (Block)" 
                      onClick={() => {
                        selectedElement.style.float = 'none';
                        selectedElement.style.margin = '1.5rem auto';
                        selectedElement.style.display = 'block';
                        setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
                        updateToolbarPosition(selectedElement);
                      }}
                      className="hover:text-blue-400 p-0.5 font-semibold cursor-pointer"
                    >
                      Center
                    </button>
                    <button 
                      type="button" 
                      title="Align Right (Float)" 
                      onClick={() => {
                        selectedElement.style.float = 'right';
                        selectedElement.style.margin = '0.5rem 0 0.5rem 1.5rem';
                        selectedElement.style.display = 'inline';
                        if (selectedElement.tagName === 'DIV') {
                          selectedElement.style.display = 'block';
                        }
                        setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
                        updateToolbarPosition(selectedElement);
                      }}
                      className="hover:text-blue-400 p-0.5 font-semibold cursor-pointer"
                    >
                      Right
                    </button>
                  </div>

                  {/* Move Section */}
                  <div className="flex items-center gap-2 border-r border-gray-700 pr-3">
                    <button 
                      type="button" 
                      title="Move Up" 
                      onClick={moveUp} 
                      className="hover:text-blue-400 p-0.5 text-[10px] cursor-pointer"
                    >
                      ▲
                    </button>
                    <button 
                      type="button" 
                      title="Move Down" 
                      onClick={moveDown} 
                      className="hover:text-blue-400 p-0.5 text-[10px] cursor-pointer"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Delete Section */}
                  <button 
                    type="button" 
                    title="Delete Media" 
                    onClick={deleteElement} 
                    className="hover:text-red-400 p-0.5 font-bold cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 3: Time & Date */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Year</label>
            <input type="text" name="year" placeholder="YYYY" value={formData.year} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Month</label>
            <input type="text" name="month" placeholder="MM" value={formData.month} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Day</label>
            <input type="text" name="day" placeholder="DD" value={formData.day} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Time</label>
            <input type="text" name="time" placeholder="12:00 AM" value={formData.time} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white" />
          </div>
        </div>

        {/* Section 4: SEO & Meta Tags */}
        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Meta Title</label>
              <input type="text" name="metaTitle" placeholder="SEO Title" value={formData.metaTitle} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Meta Keywords</label>
              <input type="text" name="metaKeywords" placeholder="keyword1, keyword2" value={formData.metaKeywords} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Meta Description</label>
            <textarea name="metaDescription" placeholder="SEO Description" value={formData.metaDescription} onChange={handleChange} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"></textarea>
          </div>
        </div>

        {/* Section 5: Status, Category & Destination */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none animate-fade-in">
              <option value="">Select a Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Destination (Optional)</label>
            <input 
              type="text" 
              name="destination" 
              placeholder="e.g. Japan, Italy" 
              value={formData.destination} 
              onChange={handleChange} 
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" 
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-100">
           <button type="submit" className="bg-blue-600 text-white px-10 py-3.5 rounded-lg font-bold hover:bg-blue-700 hover:shadow-lg transition-all w-full md:w-auto">
             Save Insight
           </button>
        </div>
      </form>
    </div>
  );
}