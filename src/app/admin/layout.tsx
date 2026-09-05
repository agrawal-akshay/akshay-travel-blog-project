"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || (path !== '/admin' && pathname.startsWith(path));
    return isActive
      ? "px-4 py-4 text-blue-600 font-bold border-b-2 border-blue-600 whitespace-nowrap transition-all"
      : "px-4 py-4 text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap";
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('user');
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Top Navigation Bar (Clean Premium White & Blue Theme) */}
      <nav className="bg-white border-b border-gray-200 text-sm font-medium shadow-sm sticky top-0 z-50">
        <div className="flex items-center px-6 overflow-x-auto no-scrollbar">
          <Link href="/admin" className={getLinkClass('/admin')}>Home</Link>
          <Link href="/admin/admins" className={getLinkClass('/admin/admins')}>Admins</Link>
          <Link href="/admin/posts" className={getLinkClass('/admin/posts')}>Insights (Posts)</Link>
          <Link href="/admin/categories" className={getLinkClass('/admin/categories')}>Categories</Link>
          <Link href="/admin/images" className={getLinkClass('/admin/images')}>Image Directory</Link>
          <Link href="/admin/users" className={getLinkClass('/admin/users')}>Users</Link>
          <Link href="/admin/messages" className={getLinkClass('/admin/messages')}>Messages</Link>
          
          <div className="ml-auto flex items-center gap-4 py-2">
             <button 
               onClick={handleLogout}
               className="bg-red-50 text-red-600 p-2 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors cursor-pointer" 
               title="Log Out"
             >
                <LogOut className="w-5 h-5" />
             </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {children}
      </main>
      
    </div>
  );
}