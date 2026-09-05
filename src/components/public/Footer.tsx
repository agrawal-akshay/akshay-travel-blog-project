"use client";
import React from 'react';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import { FaTwitter, FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-300 py-12 md:py-16 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 text-white">
              <Globe className="w-6 h-6 text-primary" />
              <span className="font-serif text-xl font-bold tracking-tight">Travilever</span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
              Inspiring stories, expert travel guides, and practical tips to help you explore the world with confidence and curiosity.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="hover:text-white transition-colors"><FaInstagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><FaTwitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><FaFacebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><FaYoutube className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/destinations" className="hover:text-primary transition-colors">Destinations</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Travel Blog</Link></li>
              <li><Link href="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
              <li><Link href="/travel-tips" className="hover:text-primary transition-colors">Travel Tips</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Stay Updated</h3>
            <p className="text-sm text-zinc-400 mb-4">Get the latest travel guides and tips delivered straight to your inbox.</p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-zinc-900 border border-zinc-800 text-white px-4 py-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <button 
                type="submit" 
                className="bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        <div className="border-t border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} Travilever Travel Blog. All rights reserved.</p>
          <p>Designed with Love for travelers.</p>
        </div>
      </div>
    </footer>
  );
}