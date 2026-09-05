"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Plane, 
  Coins, 
  ShieldCheck, 
  Smartphone, 
  Calendar,
  Compass,
  Home
} from 'lucide-react';

interface Post {
  id?: string;
  _id?: string;
  title: string;
  category: string;
  readTime: string;
  date?: string;
  image: string;
  slug?: string;
}

const DUMMY_POSTS = [
  { title: 'Ultimate Safari Packing List', category: 'Sustainable Travel', readTime: '6 min', date: 'Apr 22, 2026', image: '/images/category_sustainable.png', slug: 'safari-packing-list' },
  { title: 'Backpacking Through Europe on a Budget', category: 'Budget Backpacking', readTime: '12 min', date: 'Sep 28, 2026', image: '/images/post_europe.png', slug: 'backpacking-europe-budget' },
  { title: 'How to Travel Solo Safely in South America', category: 'Solo Travel', readTime: '10 min', date: 'May 12, 2026', image: '/images/category_solo.png', slug: 'solo-travel-south-america' },
];

export default function TravelTipsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedPosts() {
      try {
        const response = await fetch('/api/posts?limit=3');
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          const formatted = result.data.slice(0, 3).map((post: any) => ({
            id: post._id,
            title: post.title,
            category: post.category,
            readTime: post.readTime,
            slug: post.slug,
            date: new Date(post.createdAt || post.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            image: post.image || '',
          }));
          setPosts(formatted);
        } else {
          setPosts(DUMMY_POSTS);
        }
      } catch (err) {
        console.error(err);
        setPosts(DUMMY_POSTS);
      } finally {
        setLoading(false);
      }
    }
    fetchRelatedPosts();
  }, []);

  const coreTips = [
    {
      icon: <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "Packing Hacks",
      desc: "Roll, don't fold. Use packing cubes to compress clothes and save up to 30% space. Always pack a change of clothes in your carry-on in case of lost baggage.",
      color: "from-blue-500/10 to-indigo-500/5",
    },
    {
      icon: <Plane className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      title: "Flight & Booking",
      desc: "Book flights on Tuesdays or Wednesdays for lower rates. Use incognito browser windows to search, and set up tracking alerts on Google Flights.",
      color: "from-purple-500/10 to-pink-500/5",
    },
    {
      icon: <Coins className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Smart Budgeting",
      desc: "Use fee-free travel cards (like Wise). Keep small local cash on hand for street food, and travel during shoulder season to cut costs by 40%.",
      color: "from-emerald-500/10 to-teal-500/5",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-red-600 dark:text-red-400" />,
      title: "Health & Safety",
      desc: "Share your live itinerary with trusted family members. Keep copies of passports in the cloud, and buy comprehensive travel insurance.",
      color: "from-red-500/10 to-orange-500/5",
    },
    {
      icon: <Smartphone className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      title: "Travel Technology",
      desc: "Download offline Google Maps, use Airalo for eSims, install Google Translate offline language packs, and always carry a high-quality portable power bank.",
      color: "from-amber-500/10 to-yellow-500/5",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-20">
      {/* Breadcrumb Trail */}
      <div className="container mx-auto px-4 pt-8 max-w-5xl">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
          <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all font-medium">
            <Home className="w-4 h-4 mr-1" /> Home
          </Link>
          <span className="text-gray-400 font-medium">&raquo;</span>
          <span className="text-gray-500 dark:text-gray-400 font-medium">Travel Tips</span>
        </nav>
      </div>

      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-b from-blue-50 to-transparent dark:from-zinc-900/50 dark:to-transparent border-b border-gray-100 dark:border-zinc-800">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/60 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Compass className="w-3.5 h-3.5" />
            <span>Expert Travel Advice</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-6">
            Travel Tips & Guides
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            Tried-and-tested advice, smart hacks, and safety recommendations to help you navigate the world like a seasoned explorer.
          </p>
        </div>
      </div>

      {/* Curated Advice Grid */}
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-10 text-center">
          Our Golden Rules of Travel
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreTips.map((tip, idx) => (
            <div 
              key={idx}
              className={`bg-white dark:bg-zinc-900 border border-gray-200/60 dark:border-zinc-800 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${tip.color}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-gray-100 dark:border-zinc-700 flex items-center justify-center mb-5">
                {tip.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {tip.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {tip.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Helpful Apps Feature */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                The Traveler's Offline Toolkit
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                Before boarding your next flight, ensure these essentials are downloaded. They make navigating strange cities and local transactions stress-free.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-white/10 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/20">Google Maps (Offline)</span>
                <span className="bg-white/10 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/20">Wise (Finances)</span>
                <span className="bg-white/10 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/20">Airalo (eSims)</span>
                <span className="bg-white/10 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/20">Google Translate</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
              <h4 className="font-bold text-white mb-2">Our Top Safety Pledges</h4>
              <div className="flex gap-3 text-sm">
                <span className="text-blue-200">✓</span>
                <p>Register with your embassy’s travel warning database (e.g. STEP in the USA).</p>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="text-blue-200">✓</span>
                <p>Never keep all your credit cards and cash in one single wallet.</p>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="text-blue-200">✓</span>
                <p>Pack a secondary physical keycard backup for emergency authentication.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Guides Link Section */}
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-10 text-center">
          Deep Dives: Practical Guides
        </h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link 
                key={post.id || post.title} 
                href={`/blog/${post.slug || post.id}`}
                className="group bg-white dark:bg-zinc-900 border border-gray-200/60 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 font-serif">
                  {post.image ? (
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 animate-fade-in"
                    />
                  ) : (
                    <span className="text-base font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-600">{post.category}</span>
                  )}
                  <span className="absolute top-4 left-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full text-blue-600 dark:text-blue-400">
                    {post.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-4 border-t border-gray-100 dark:border-zinc-800 pt-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
