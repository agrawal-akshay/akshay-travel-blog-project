"use client";

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback if clipboard API is not available or blocked:
      // Try using a temporary textarea
      try {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy method failed:', fallbackError);
      }
    }
  };

  return (
    <button 
      onClick={handleShare}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform active:scale-95 ${
        copied 
          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50' 
          : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-transparent hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:shadow-sm'
      }`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 animate-bounce" />
          Link Copied!
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          Share Article
        </>
      )}
    </button>
  );
}
