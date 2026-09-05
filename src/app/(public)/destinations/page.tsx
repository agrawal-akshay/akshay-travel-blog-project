"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Compass, Home } from 'lucide-react';

// Premium Mock Data with High-Quality Unsplash Images
const REGIONS = ['All', 'Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'];

const DESTINATIONS = [
  { id: '2', country: 'Italy', city: 'Amalfi Coast', region: 'Europe', articles: 18, image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop' },
  { id: '3', country: 'Indonesia', city: 'Bali', region: 'Asia', articles: 32, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop' },
  { id: '4', country: 'Greece', city: 'Santorini', region: 'Europe', articles: 15, image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop' },
  { id: '5', country: 'Peru', city: 'Machu Picchu', region: 'South America', articles: 9, image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=800&auto=format&fit=crop' },
  { id: '6', country: 'Morocco', city: 'Marrakech', region: 'Africa', articles: 11, image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=800&auto=format&fit=crop' },
  { id: '1', country: 'Japan', city: 'Kyoto', region: 'Asia', articles: 24, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop' },
  { id: '7', country: 'Australia', city: 'Sydney', region: 'Oceania', articles: 14, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1200&auto=format&fit=crop' },
];

// Map common countries/destinations to their respective continents for accurate dynamic filtering
const DESTINATION_REGIONS: { [key: string]: string } = {
  // Africa
  'kenya': 'Africa',
  'morocco': 'Africa',
  'egypt': 'Africa',
  'south africa': 'Africa',
  'tanzania': 'Africa',
  'nigeria': 'Africa',
  'madagascar': 'Africa',

  // Asia
  'japan': 'Asia',
  'indonesia': 'Asia',
  'bali': 'Asia',
  'india': 'Asia',
  'china': 'Asia',
  'thailand': 'Asia',
  'vietnam': 'Asia',
  'singapore': 'Asia',
  'malaysia': 'Asia',
  'south korea': 'Asia',
  'kyoto': 'Asia',

  // Europe
  'italy': 'Europe',
  'greece': 'Europe',
  'france': 'Europe',
  'spain': 'Europe',
  'united kingdom': 'Europe',
  'germany': 'Europe',
  'switzerland': 'Europe',
  'iceland': 'Europe',
  'croatia': 'Europe',
  'amalfi coast': 'Europe',
  'santorini': 'Europe',

  // North America
  'usa': 'North America',
  'united states': 'North America',
  'canada': 'North America',
  'mexico': 'North America',

  // South America
  'peru': 'South America',
  'brazil': 'South America',
  'argentina': 'South America',
  'colombia': 'South America',
  'machu picchu': 'South America',

  // Oceania
  'australia': 'Oceania',
  'new zealand': 'Oceania',
  'fiji': 'Oceania',
  'sydney': 'Oceania'
};

function getRegionForDestination(destination: string): string {
  const destClean = destination.trim().toLowerCase();
  
  // Exact match
  if (DESTINATION_REGIONS[destClean]) {
    return DESTINATION_REGIONS[destClean];
  }
  
  // Substring match
  for (const [key, value] of Object.entries(DESTINATION_REGIONS)) {
    if (destClean.includes(key)) {
      return value;
    }
  }

  return 'Asia'; // Default fallback
}

export default function DestinationsPage() {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPosts(data.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const postDestinations = posts.reduce((acc: any, post: any) => {
    if (post.destination) {
      const destKey = post.destination.trim().toLowerCase();
      const region = getRegionForDestination(post.destination);

      if (!acc[destKey]) {
        acc[destKey] = {
          country: post.destination.trim(),
          city: post.excerpt || post.title || 'Guide',
          region: region,
          image: post.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop',
          articles: 0
        };
      }
      acc[destKey].articles += 1;
    }
    return acc;
  }, {});

  const mergedDestinations = DESTINATIONS.map(dest => {
    const destKey = dest.country.toLowerCase();
    const dynamicDest = postDestinations[destKey];
    return {
      ...dest,
      articles: dynamicDest ? dynamicDest.articles : 0
    };
  });

  Object.keys(postDestinations).forEach(key => {
    const alreadyExists = DESTINATIONS.some(dest => dest.country.toLowerCase() === key);
    if (!alreadyExists) {
      const dynamicDest = postDestinations[key];
      mergedDestinations.push({
        id: `dynamic-${key}`,
        country: dynamicDest.country,
        city: dynamicDest.city,
        region: dynamicDest.region,
        articles: dynamicDest.articles,
        image: dynamicDest.image
      });
    }
  });

  const filteredDestinations = selectedRegion === 'All'
    ? mergedDestinations
    : mergedDestinations.filter(dest => dest.region.toLowerCase() === selectedRegion.toLowerCase());

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-8 pb-24">
      {/* Breadcrumb Trail */}
      <div className="container mx-auto px-4 mb-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
          <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all font-medium">
            <Home className="w-4 h-4 mr-1" /> Home
          </Link>
          <span className="text-gray-400 font-medium">&raquo;</span>
          <span className="text-gray-500 dark:text-gray-400 font-medium">Destinations</span>
        </nav>
      </div>

      {/* Page Header */}
      <div className="container mx-auto px-4 text-center mb-12 max-w-3xl">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-6 text-blue-600 dark:text-blue-400">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-6">
          Where to Next?
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Explore our curated guides for the world's most breathtaking destinations. From bustling cities to serene landscapes, find your next adventure here.
        </p>
      </div>

      {/* Regions Filter */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex overflow-x-auto pb-4 gap-3 md:justify-center no-scrollbar">
          {REGIONS.map((region) => {
            const isActive = selectedRegion === region;
            return (
              <button 
                key={region} 
                onClick={() => setSelectedRegion(region)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-colors border cursor-pointer ${
                  isActive 
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-black border-transparent shadow-md' 
                    : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white'
                }`}
              >
                {region}
              </button>
            );
          })}
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="container mx-auto px-4">
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((dest) => (
              <Link 
                href={`/blog?search=${encodeURIComponent(dest.country)}`} 
                key={dest.id} 
                className="group relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-900 h-96"
              >
                <Image 
                  src={dest.image} 
                  alt={`${dest.city}, ${dest.country}`} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="absolute bottom-0 left-0 p-6 w-full flex flex-col justify-end h-full">
                  <span className="text-blue-300 font-medium text-sm mb-2 uppercase tracking-wider block translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {dest.region}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-1">
                    {dest.country}
                  </h3>
                  <p className="text-gray-300 text-sm flex items-center justify-between">
                    <span>{dest.city}</span>
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white">
                      {dest.articles} Articles
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No destinations found in this region.</p>
          </div>
        )}
      </div>
    </div>
  );
}