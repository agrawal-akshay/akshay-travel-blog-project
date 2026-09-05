import React from 'react';
import Link from 'next/link';

import { getDb } from '@/lib/db';
import { Home } from 'lucide-react';

interface DbCategory {
  name: string;
  slug: string;
  image: string;
  posts?: number;
}

export default async function CategoriesPage() {
  let categories: DbCategory[] = [];
  
  try {
    const db = await getDb();
    const categoriesCollection = db.collection('categories');
    const postsCollection = db.collection('posts');

    const dbCategories = await categoriesCollection.find({}).toArray();

    // Dynamically calculate the post count for each category
    categories = await Promise.all(
      dbCategories.map(async (cat: any) => {
        const count = await postsCollection.countDocuments({
          category: { $regex: new RegExp(`^${cat.name}$`, 'i') },
          status: { $in: ['PUBLISHED', 'Active'] },
        });
        return {
          name: cat.name,
          slug: cat.slug || cat.name.toLowerCase().replace(' ', '-'),
          image: cat.image || '/images/category_adventure.png',
          posts: count,
        };
      })
    );
  } catch (error) {
    console.error('Error fetching categories from database:', error);
    // Fallback to static default values if database fails
    categories = [
      { name: 'Adventure', slug: 'adventure', image: '/images/category_adventure.png', posts: 0 },
      { name: 'Luxury Travel', slug: 'luxury-travel', image: '/images/category_luxury.png', posts: 0 },
      { name: 'Budget Backpacking', slug: 'budget-backpacking', image: '/images/category_budget.png', posts: 0 },
      { name: 'Food & Culinary', slug: 'food-culinary', image: '/images/category_food.png', posts: 0 },
      { name: 'Solo Travel', slug: 'solo-travel', image: '/images/category_solo.png', posts: 0 },
      { name: 'Photography', slug: 'photography', image: '/images/category_photography.png', posts: 0 },
      { name: 'Road Trips', slug: 'road-trips', image: '/images/category_road_trip.png', posts: 0 },
      { name: 'Sustainable Travel', slug: 'sustainable-travel', image: '/images/category_sustainable.png', posts: 0 },
    ];
  }

  return (
    <div className="container mx-auto px-4 pt-8 pb-16 md:pt-10 md:pb-24 min-h-screen">
      {/* Breadcrumb Trail */}
      <div className="max-w-6xl mx-auto mb-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
          <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all font-medium">
            <Home className="w-4 h-4 mr-1" /> Home
          </Link>
          <span className="text-gray-400 font-medium">&raquo;</span>
          <span className="text-gray-500 dark:text-gray-400 font-medium">Categories</span>
        </nav>
      </div>

      <div className="max-w-2xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4">
          Explore by Category
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Find exactly what you are looking for. Browse our articles by your favorite travel style.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
        {categories.map((category) => (
          <Link 
            href={`/blog?category=${category.slug}`} 
            key={category.name} 
            className="group relative overflow-hidden rounded-2xl aspect-square border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-6"
          >
            {/* Background Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={category.image} 
              alt={category.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-opacity duration-300 group-hover:from-black/95 group-hover:via-black/50"></div>
            
            {/* Content overlay */}
            <div className="relative z-10 flex flex-col">
              <h3 className="text-lg md:text-xl font-bold text-white mb-1 transition-transform duration-300 group-hover:-translate-y-1">
                {category.name}
              </h3>
              <p className="text-xs text-gray-300 font-medium tracking-wide uppercase">
                {category.posts || 0} Articles
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}