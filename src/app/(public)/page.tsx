import React from 'react';
import Link from 'next/link';
import { Compass, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      
      {/* PREMIUM HERO SECTION WITH TRANSPARENT PHOTO BACKGROUND
        ----------------------------------------------------
        - We use h-[85vh] to make it almost full screen height.
        - Background Image is set via inline CSS url().
      */}
      <section 
        className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden bg-zinc-900"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=2000&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        
        {/* THIS IS THE TRANSPARENT LAYER (OVERLAY) user requested!
          - It's a dark gradient from top to bottom.
          - 'opacity-80' makes it transparent so image is visible but dark.
        */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/80 to-zinc-950 opacity-90 z-10"></div>

        {/* CONTENT OVERLAID ON TOP (Z-10 to stay above overlay) */}
        <div className="relative z-20 container mx-auto px-4 md:px-6 text-center text-white">
          
          {/* Small Tagline with Glass Effect */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs md:text-sm font-semibold mb-6 tracking-wide uppercase">
            <Compass className="w-4 h-4 text-blue-400" /> Your Journey Begins Here
          </span>

          {/* Main Headline (using Playfair Serif font for premium feel) */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-tight mb-6 text-balance max-w-5xl mx-auto">
            Travel Smarter, <span className="text-blue-400">Dream</span> Bigger, Discover More.
          </h1>

          {/* Sub-headline */}
          <p className="text-xl md:text-2xl text-zinc-200 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Authentic stories, curated itineraries, and expert guides from <span className="font-semibold text-white">Travilever</span> to inspire your next great escape.
          </p>

          {/* Premium CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
            <Link 
              href="/blog"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-md hover:shadow-lg w-48 text-center"
            >
              Explore Blog
            </Link>
            <Link 
              href="/destinations"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-semibold text-lg transition-all w-48 text-center backdrop-blur-sm"
            >
              Destinations
            </Link>
          </div>

        </div>
      </section>

      {/* FEATURED QUICK LINKS SECTION (Just below hero)
      */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/blog?category=adventure" className="group bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 hover:shadow-lg transition-all flex items-center gap-6">
            <Zap className="w-10 h-10 text-orange-500" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600">Adventure Travel</h3>
              <p className="text-gray-600 dark:text-gray-400">Hiking, Safaris, and Thrills.</p>
            </div>
          </Link>
          <Link href="/blog?category=food-culinary" className="group bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 hover:shadow-lg transition-all flex items-center gap-6">
            <Zap className="w-10 h-10 text-red-500" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600">Culinary Guides</h3>
              <p className="text-gray-600 dark:text-gray-400">Best street food and dining.</p>
            </div>
          </Link>
          <Link href="/blog?category=budget-backpacking" className="group bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 hover:shadow-lg transition-all flex items-center gap-6">
            <Zap className="w-10 h-10 text-green-500" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600">Budget Backpacking</h3>
              <p className="text-gray-600 dark:text-gray-400">Travel deeper for less.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Baaki sections (Featured Posts, Latest, etc.) yahan aayenge */}

    </div>
  );
}