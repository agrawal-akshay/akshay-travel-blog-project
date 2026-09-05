"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Calendar, ChevronRight, Home } from 'lucide-react';

// Static data for UI representation. We will connect this to MongoDB later.
const slugify = (text: string) => 
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

interface Post {
  id?: string;
  _id?: string;
  title: string;
  category: string;
  readTime: string;
  date?: string;
  createdAt?: string;
  image: string;
  slug?: string;
  destination?: string;
}

const FALLBACK_POSTS: Post[] = [
  { title: 'The Ultimate 14-Day Japan Itinerary', category: 'Adventure', readTime: '8 min', date: 'Oct 12, 2026', image: '/images/post_japan.jpg', slug: 'japan-itinerary', destination: 'Japan' },
  { title: 'Backpacking Through Europe on a Budget', category: 'Budget Backpacking', readTime: '12 min', date: 'Sep 28, 2026', image: '/images/post_europe.png', slug: 'backpacking-europe-budget', destination: 'Italy' },
  { title: 'Hidden Gems in the Swiss Alps', category: 'Road Trips', readTime: '6 min', date: 'Sep 15, 2026', image: '/images/post_alps.png', slug: 'hidden-gems-swiss-alps', destination: 'Switzerland' },
  { title: 'A Food Lover’s Guide to Mexico City', category: 'Food & Culinary', readTime: '10 min', date: 'Aug 30, 2026', image: '/images/post_mexico.png', slug: 'food-guide-mexico-city', destination: 'Mexico' },
  { title: 'Digital Nomad Life in Bali', category: 'Solo Travel', readTime: '7 min', date: 'Aug 12, 2026', image: '/images/post_bali.png', slug: 'digital-nomad-bali', destination: 'Indonesia' },
  { title: 'Safari Adventures in Kenya', category: 'Adventure', readTime: '15 min', date: 'Jul 22, 2026', image: '/images/post_kenya.png', slug: 'safari-adventures-kenya', destination: 'Kenya' },
  { title: 'Exploring the Ancient Temples of Kyoto', category: 'Photography', readTime: '9 min', date: 'Jul 10, 2026', image: '/images/category_adventure.png', slug: 'kyoto-temples-guide', destination: 'Japan' },
  { title: 'A Guide to the Best Castles in Germany', category: 'Luxury Travel', readTime: '11 min', date: 'Jun 28, 2026', image: '/images/category_luxury.png', slug: 'best-castles-germany', destination: 'Germany' },
  { title: 'Hiking the Tour du Mont Blanc', category: 'Budget Backpacking', readTime: '14 min', date: 'Jun 15, 2026', image: '/images/category_budget.png', slug: 'tour-du-mont-blanc-hiking', destination: 'France' },
  { title: 'Tasting Street Food in Bangkok', category: 'Food & Culinary', readTime: '8 min', date: 'May 30, 2026', image: '/images/category_food.png', slug: 'bangkok-street-food', destination: 'Thailand' },
  { title: 'How to Travel Solo Safely in South America', category: 'Solo Travel', readTime: '10 min', date: 'May 12, 2026', image: '/images/category_solo.png', slug: 'solo-travel-south-america', destination: 'Peru' },
  { title: 'Ultimate Safari Packing List', category: 'Sustainable Travel', readTime: '6 min', date: 'Apr 22, 2026', image: '/images/category_sustainable.png', slug: 'safari-packing-list', destination: 'Kenya' },
];

function BlogContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  
  const formatCategoryName = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state with URL search params if present
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setVisibleCount(6);
  }, [searchParams]);

  // Fetch posts from database API
  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        const categoryFilter = searchParams.get('category') || '';
        // Fetch up to 100 posts, optionally filtered by category
        const url = `/api/posts?limit=100${categoryFilter ? `&category=${categoryFilter}` : ''}`;
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          const formattedPosts = result.data.map((post: any) => ({
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
            destination: post.destination || '',
          }));
          setPosts(formattedPosts);
        } else {
          // If no posts in DB, use local mock posts (filter by category if needed)
          const fallback = categoryFilter 
            ? FALLBACK_POSTS.filter(p => slugify(p.category) === categoryFilter.toLowerCase())
            : FALLBACK_POSTS;
          setPosts(fallback);
        }
      } catch (error) {
        console.error('Error fetching posts from database:', error);
        const categoryFilter = searchParams.get('category') || '';
        const fallback = categoryFilter 
          ? FALLBACK_POSTS.filter(p => slugify(p.category) === categoryFilter.toLowerCase())
          : FALLBACK_POSTS;
        setPosts(fallback);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [searchParams]);

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      post.title.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query) ||
      (post.destination && post.destination.toLowerCase().includes(query))
    );
  });

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  return (
    <div className="container mx-auto px-4 pt-8 pb-16 md:pt-10 md:pb-24 min-h-screen">
      {/* Breadcrumb Trail */}
      <div className="max-w-6xl mx-auto mb-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
          <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all font-medium">
            <Home className="w-4 h-4 mr-1" /> Home
          </Link>
          <span className="text-gray-400 font-medium">&raquo;</span>
          {category || search ? (
            <>
              <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all font-medium">
                Blogs
              </Link>
              <span className="text-gray-400 font-medium">&raquo;</span>
              <span className="text-gray-500 dark:text-gray-400 font-medium">
                {category ? `Category: ${formatCategoryName(category)}` : `Search: "${search}"`}
              </span>
            </>
          ) : (
            <span className="text-gray-500 dark:text-gray-400 font-medium">Blogs</span>
          )}
        </nav>
      </div>

      {/* Header Section */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-6">
          Travel Stories & Guides
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Discover expert tips, breathtaking destinations, and practical advice to make your next trip unforgettable.
        </p>
        
        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(6);
            }}
            placeholder="Search articles, destinations, or topics..." 
            className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : visiblePosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {visiblePosts.map((post) => (
            <Link 
              key={post.id || post.title} 
              href={`/blog/${post.slug || post.id}`}
              className="flex"
            >
              <article className="group cursor-pointer bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 flex flex-col w-full">
                <div className="relative h-64 overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 font-serif">
                  {post.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <span className="text-lg font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-600">{post.category}</span>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm dark:bg-black/90 px-3 py-1 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {post.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No articles found matching "{searchQuery}".</p>
        </div>
      )}

      {/* Load More Button */}
      {!isLoading && visibleCount < filteredPosts.length && (
        <div className="text-center">
          <button 
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-medium hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
          >
            Load More Articles <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <BlogContent />
    </Suspense>
  );
}