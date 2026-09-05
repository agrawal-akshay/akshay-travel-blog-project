"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { name: 'Destinations', href: '/destinations' },
  { name: 'Blog', href: '/blog' },
  { name: 'Categories', href: '/categories' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkUser = () => {
      const saved = localStorage.getItem('user');
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    
    checkUser();
    
    window.addEventListener('storage', checkUser);
    window.addEventListener('auth-change', checkUser);
    
    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('auth-change', checkUser);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/';
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-gray-200 py-3' 
          : 'bg-transparent border-transparent py-5'
      )}
    >    
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Globe className="w-8 h-8 text-primary transition-transform group-hover:rotate-12" />
          <span className="font-serif text-2xl font-bold tracking-tight">
            Travilever
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary relative py-1.5 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:bg-primary after:transition-transform hover:after:origin-bottom-left hover:after:scale-x-100',
                  isActive 
                    ? 'text-primary after:scale-x-100' 
                    : 'text-muted-foreground after:scale-x-0'
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions - Dynamic User State */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                  {user.username ? user.username[0].toUpperCase() : 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-[150px] truncate" title={user.email}>
                  {user.username || user.email}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'text-lg font-medium py-2 border-b border-border/50 transition-colors',
                  isActive ? 'text-primary' : 'text-foreground'
                )}
              >
                {link.name}
              </Link>
            );
          })}
          
          {user ? (
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {user.username ? user.username[0].toUpperCase() : 'U'}
                </div>
                <span className="text-base font-medium text-gray-700 truncate">
                  {user.username || user.email}
                </span>
              </div>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="bg-amber-500 hover:bg-amber-600 text-white text-center px-5 py-3 rounded-md text-base font-medium cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              onClick={() => setMobileMenuOpen(false)}
              className="bg-primary text-primary-foreground text-center px-5 py-3 rounded-md text-base font-medium mt-2"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}