import React from 'react';
import { Compass, Shield, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative py-24 md:py-32 bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-6">
            We are <span className="text-blue-600">Travilever</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A community of passionate travelers, storytellers, and explorers dedicated to helping you experience the world in an authentic way.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              We believe that travel is the ultimate educator. It breaks down barriers, challenges our preconceptions, and shows us the incredible beauty of our diverse planet.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Travilever was born out of a desire to create honest, practical, and inspiring travel guides that go beyond the typical tourist traps. We want to empower you to travel deeper, smarter, and more sustainably.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We refuse to measure exploration in vanity numbers or country checklists. For us, real adventure is about the depth of connections formed and the positive, enduring footprint we leave behind.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-zinc-800/50 dark:to-zinc-900/50 backdrop-blur-md border border-gray-200/50 dark:border-zinc-700/50 p-8 rounded-3xl relative overflow-hidden shadow-xl">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2 block">
                The Vision 2030
              </span>
              <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                Our Ambitious Pledges
              </h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                      100% Local-First Impact
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      We partner directly with native guides and locally-owned stays, committing to redirecting tourism spend directly into the hands of host communities.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                      The Absolute Truth Guarantee
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      No paid promotions, no undisclosed sponsorships, and zero AI-generated hallucinated itineraries. We only publish verified, human-lived experiences.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                      Carbon-Negative Explorations
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      For every trip documented on our platform, we purchase verified carbon removal credits. We aim to offset 10x the carbon footprint of our travel by 2030.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}