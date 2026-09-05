import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, User, Tag, ChevronLeft, Home } from 'lucide-react';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import ShareButton from '@/components/public/ShareButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SingleBlogPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const slug = resolvedParams?.slug || '';
  const decodedSlug = decodeURIComponent(Array.isArray(slug) ? slug[0] : slug);

  let post: any = null;
  let relatedPosts: any[] = [];

  try {
    const db = await getDb();
    
    // Flexible query matching exact slug, case-insensitive slug, or _id
    const queryConditions: any[] = [
      { slug: slug },
      { slug: decodedSlug },
      { slug: { $regex: new RegExp(`^${decodedSlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }
    ];

    if (ObjectId.isValid(decodedSlug)) {
      queryConditions.push({ _id: new ObjectId(decodedSlug) });
    }

    post = await db.collection('posts').findOne({
      $or: queryConditions
    });

    if (post && post._id) {
      await db.collection('posts').updateOne(
        { _id: post._id },
        { $inc: { views: 1 } }
      );
      post.views = (post.views || 0) + 1;

      // Fetch related posts (same category, excluding current post)
      relatedPosts = await db.collection('posts')
        .find({
          _id: { $ne: post._id },
          category: post.category
        })
        .limit(3)
        .toArray();

      // If we don't have 3 related posts, fill with other active posts
      if (relatedPosts.length < 3) {
        const extraPosts = await db.collection('posts')
          .find({
            _id: { $ne: post._id, $nin: relatedPosts.map(p => p._id) }
          })
          .limit(3 - relatedPosts.length)
          .toArray();
        relatedPosts = [...relatedPosts, ...extraPosts];
      }
    }
  } catch (error) {
    console.error('Error fetching post from DB:', error);
  }

  // If post doesn't exist in DB, show 404 page
  if (!post) {
    notFound();
  }

  // Populate mock related posts if DB did not return any
  if (relatedPosts.length === 0) {
    relatedPosts = [
      { title: 'Backpacking Through Europe on a Budget', category: 'Budget Backpacking', image: '/images/post_europe.png', slug: 'backpacking-europe-budget' },
      { title: 'Hidden Gems in the Swiss Alps', category: 'Road Trips', image: '/images/post_alps.png', slug: 'hidden-gems-swiss-alps' },
      { title: 'Digital Nomad Life in Bali', category: 'Solo Travel', image: '/images/post_bali.png', slug: 'digital-nomad-bali' }
    ].filter(p => p.slug !== slug).slice(0, 3);
  }

  const formattedPost = {
    title: post.title,
    category: post.category,
    date: post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) : (post.date || 'Oct 12, 2026'),
    time: post.time || '12:00 AM',
    readTime: post.readTime,
    author: post.author || {
      name: 'Alex Wanderer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'
    },
    instructorName: post.instructorName || '',
    instructorImage: post.instructorImage || '',
    image: post.image || '',
    excerpt: post.excerpt || '',
    content: post.content,
    tags: post.tags || [post.category, 'Travel']
  };

  return (
    <article className="min-h-screen bg-white dark:bg-black pb-20">
      {/* Breadcrumb Trail */}
      <div className="container mx-auto px-4 pt-24 pb-4 max-w-5xl">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
          <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all font-medium">
            <Home className="w-4 h-4 mr-1" /> Home
          </Link>
          <span className="text-gray-400 font-medium">&raquo;</span>
          <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all font-medium">
            Blogs
          </Link>
          <span className="text-gray-400 font-medium">&raquo;</span>
          <span className="text-gray-500 dark:text-gray-400 font-medium break-words">
            {formattedPost.title}
          </span>
        </nav>
      </div>

      {/* Header Section */}
      <header className="container mx-auto px-4 max-w-5xl text-center mb-6">
        <div className="mb-6">
          <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider">
            {formattedPost.category}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 dark:text-white leading-tight mb-4 text-balance">
          {formattedPost.title}
        </h1>

        {formattedPost.excerpt && (
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mt-4 font-normal">
            {formattedPost.excerpt}
          </p>
        )}
      </header>

      {/* Instructor & Metadata Bar */}
      <div className="container mx-auto px-4 max-w-5xl mb-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3.5 border-y border-gray-200 dark:border-zinc-800 text-xs sm:text-sm text-gray-600 dark:text-gray-400 select-none">
          
          {/* Left section: Avatar, Instructor Name, Date, Time */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gray-150 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 shadow-sm">
                {formattedPost.instructorImage ? (
                  <Image 
                    src={formattedPost.instructorImage} 
                    alt="Instructor" 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <svg className="w-5 h-5 text-gray-400 dark:text-zinc-500" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{formattedPost.instructorName || 'Travilever Instructor'}</span>
            </div>
            
            <div className="h-4 w-px bg-gray-300 dark:bg-zinc-800 hidden sm:block"></div>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{formattedPost.date}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{formattedPost.time}</span>
            </div>
          </div>

          {/* Right section: Social share links */}
          <div className="flex items-center gap-3.5 text-gray-400 dark:text-zinc-500">
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(formattedPost.title)}`} target="_blank" rel="noopener noreferrer" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 dark:hover:text-blue-500 transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
              </svg>
            </a>
            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(formattedPost.title)}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-500 dark:hover:text-green-400 transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.135-3.328c1.6.951 3.525 1.455 5.823 1.456 5.568 0 10.1-4.529 10.1-10.098.002-2.699-1.047-5.236-2.952-7.143-1.905-1.907-4.437-2.956-7.147-2.958-5.575 0-10.108 4.531-10.11 10.1-.001 2.023.522 4.004 1.517 5.753L2.247 21.75l3.945-1.078z"/>
              </svg>
            </a>
            <a href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-red-600 dark:hover:text-red-500 transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>

        </div>
      </div>

      {/* Featured Image */}
      {formattedPost.image && (
        <div className="container mx-auto px-4 max-w-5xl mb-16">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src={formattedPost.image} 
              alt={formattedPost.title} 
              fill 
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Render HTML Content safely */}
        <div 
          className="prose prose-lg dark:prose-invert prose-blue max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: formattedPost.content }}
        />

        {/* Footer of the article (Tags & Share) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-5 h-5 text-gray-400 mr-2" />
            {formattedPost.tags.map((tag: string) => (
              <span key={tag} className="bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-md text-sm">
                {tag}
              </span>
            ))}
          </div>
          
          <ShareButton title={formattedPost.title} />
        </div>
      </div>

      {/* Related Articles Section */}
      {relatedPosts.length > 0 && (
        <section className="container mx-auto px-4 max-w-5xl mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-2xl font-bold font-serif text-gray-900 dark:text-white mb-8">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rPost: any) => {
              const rPostDate = rPost.createdAt ? new Date(rPost.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }) : 'Oct 12, 2026';

              return (
                <Link 
                  key={rPost._id?.toString() || rPost.slug} 
                  href={`/blog/${rPost.slug}`}
                  className="group flex flex-col bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 flex-1"
                >
                  <div className="relative h-44 overflow-hidden bg-gray-50 dark:bg-zinc-850">
                    <img 
                      src={rPost.image || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1000&auto=format&fit=crop'} 
                      alt={rPost.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm dark:bg-black/90 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {rPost.category}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-4 leading-snug">
                      {rPost.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {rPostDate}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}