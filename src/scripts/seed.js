import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse .env.local manually
let uri = 'mongodb://localhost:27017/travilever_blog';
try {
  const envPath = path.join(__dirname, '../../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^MONGODB_URI=["']?([^"\n\r']+)["']?/m);
    if (match && match[1]) {
      uri = match[1];
    }
  }
} catch (e) {
  console.warn('Could not parse .env.local, using default local URI.');
}

const CATEGORIES = [
  { name: 'Adventure', slug: 'adventure', image: '/images/category_adventure.png', description: 'Thrilling outdoor experiences and active travels.', color: 'bg-orange-500' },
  { name: 'Luxury Travel', slug: 'luxury-travel', image: '/images/category_luxury.png', description: 'Premium stays and upscale travel guides.', color: 'bg-purple-500' },
  { name: 'Budget Backpacking', slug: 'budget-backpacking', image: '/images/category_budget.png', description: 'Affordable travel tips and budget guides.', color: 'bg-green-500' },
  { name: 'Food & Culinary', slug: 'food-culinary', image: '/images/category_food.png', description: 'Discovering the world through local cuisines.', color: 'bg-red-500' },
  { name: 'Solo Travel', slug: 'solo-travel', image: '/images/category_solo.png', description: 'Guides and inspiration for solo adventurers.', color: 'bg-blue-500' },
  { name: 'Photography', slug: 'photography', image: '/images/category_photography.png', description: 'Camera tips and travel photography inspiration.', color: 'bg-teal-500' },
  { name: 'Road Trips', slug: 'road-trips', image: '/images/category_road_trip.png', description: 'Scenic drives and route guides.', color: 'bg-yellow-500' },
  { name: 'Sustainable Travel', slug: 'sustainable-travel', image: '/images/category_sustainable.png', description: 'Eco-friendly and responsible travel guides.', color: 'bg-emerald-500' },
];

const POSTS = [
  {
    title: 'The Ultimate 14-Day Japan Itinerary',
    slug: 'japan-itinerary',
    excerpt: 'Explore ancient temples, neon-lit cities, and scenic mountain views with this 14-day itinerary.',
    content: '<p>Japan is a fascinating contrast of ultra-modern cities and ancient traditions. In this guide, we walk you through a perfect two-week route from Tokyo to Kyoto.</p>',
    category: 'Adventure',
    image: '/images/post_japan.jpg',
    status: 'Active',
    readTime: '8 min',
    author: { name: 'Alex Wanderer', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop' },
    createdAt: new Date('2026-06-12T10:00:00Z'),
    updatedAt: new Date('2026-06-12T10:00:00Z')
  },
  {
    title: 'Backpacking Through Europe on a Budget',
    slug: 'backpacking-europe-budget',
    excerpt: 'How to see Europe’s greatest cities, stay in hostels, and travel cheap.',
    content: '<p>Backpacking Europe is a rite of passage. Learn how to stretch your euros with smart train bookings and affordable accommodation.</p>',
    category: 'Budget Backpacking',
    image: '/images/post_europe.png',
    status: 'Active',
    readTime: '12 min',
    author: { name: 'Sarah Miller', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop' },
    createdAt: new Date('2026-06-10T10:00:00Z'),
    updatedAt: new Date('2026-06-10T10:00:00Z')
  },
  {
    title: 'Hidden Gems in the Swiss Alps',
    slug: 'hidden-gems-swiss-alps',
    excerpt: 'Step away from the tourist hubs and explore quiet mountain villages.',
    content: '<p>The Swiss Alps offer spectacular views, but tourist spots can get crowded. Discover these hidden alpine lakes and villages.</p>',
    category: 'Road Trips',
    image: '/images/post_alps.png',
    status: 'Active',
    readTime: '6 min',
    author: { name: 'Marco Silva', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop' },
    createdAt: new Date('2026-06-08T10:00:00Z'),
    updatedAt: new Date('2026-06-08T10:00:00Z')
  },
  {
    title: 'A Food Lover’s Guide to Mexico City',
    slug: 'food-guide-mexico-city',
    excerpt: 'From street tacos to upscale dining, discover Mexico City’s best culinary experiences.',
    content: '<p>Mexico City is a global culinary capital. Here are the markets and cantinas you cannot afford to miss.</p>',
    category: 'Food & Culinary',
    image: '/images/post_mexico.png',
    status: 'Active',
    readTime: '10 min',
    author: { name: 'Elena Gomez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop' },
    createdAt: new Date('2026-06-05T10:00:00Z'),
    updatedAt: new Date('2026-06-05T10:00:00Z')
  },
  {
    title: 'Digital Nomad Life in Bali',
    slug: 'digital-nomad-bali',
    excerpt: 'Tips for working remotely, finding high-speed internet, and enjoying island life.',
    content: '<p>Bali has become a haven for remote workers. Learn how to navigate coworking spaces, visas, and scooters.</p>',
    category: 'Solo Travel',
    image: '/images/post_bali.png',
    status: 'Active',
    readTime: '7 min',
    author: { name: 'Alex Wanderer', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop' },
    createdAt: new Date('2026-06-02T10:00:00Z'),
    updatedAt: new Date('2026-06-02T10:00:00Z')
  },
  {
    title: 'Safari Adventures in Kenya',
    slug: 'safari-adventures-kenya',
    excerpt: 'A guide to exploring the Maasai Mara national park and seeing the Big Five.',
    content: '<p>Witness the great migration and experience close encounters with wildlife on a Kenyan safari excursion.</p>',
    category: 'Adventure',
    image: '/images/post_kenya.png',
    status: 'Active',
    readTime: '15 min',
    author: { name: 'Sarah Miller', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop' },
    createdAt: new Date('2026-05-30T10:00:00Z'),
    updatedAt: new Date('2026-05-30T10:00:00Z')
  },
  {
    title: 'Exploring the Ancient Temples of Kyoto',
    slug: 'kyoto-temples-guide',
    excerpt: 'A photography guide to capturing Kyoto’s most beautiful traditional shrines.',
    content: '<p>Kyoto is the cultural heart of Japan. Discover the best times of day to capture stunning photographs of Kinkaku-ji and Fushimi Inari.</p>',
    category: 'Photography',
    image: '/images/category_adventure.png',
    status: 'Active',
    readTime: '9 min',
    author: { name: 'Alex Wanderer', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop' },
    createdAt: new Date('2026-05-25T10:00:00Z'),
    updatedAt: new Date('2026-05-25T10:00:00Z')
  },
  {
    title: 'A Guide to the Best Castles in Germany',
    slug: 'best-castles-germany',
    excerpt: 'Explore Germany’s fairytale castles, including Neuschwanstein.',
    content: '<p>Germany is home to some of the most spectacular medieval castles in Europe. Here is our list of the top five castles to visit.</p>',
    category: 'Luxury Travel',
    image: '/images/category_luxury.png',
    status: 'Active',
    readTime: '11 min',
    author: { name: 'Sarah Miller', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop' },
    createdAt: new Date('2026-05-20T10:00:00Z'),
    updatedAt: new Date('2026-05-20T10:00:00Z')
  },
  {
    title: 'Hiking the Tour du Mont Blanc',
    slug: 'tour-du-mont-blanc-hiking',
    excerpt: 'Everything you need to know about hiking this famous alpine loop trail.',
    content: '<p>Hiking across France, Italy, and Switzerland on the Tour du Mont Blanc is an unforgettable challenge. Learn about routes and refuges.</p>',
    category: 'Budget Backpacking',
    image: '/images/category_budget.png',
    status: 'Active',
    readTime: '14 min',
    author: { name: 'Marco Silva', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop' },
    createdAt: new Date('2026-05-15T10:00:00Z'),
    updatedAt: new Date('2026-05-15T10:00:00Z')
  },
  {
    title: 'Tasting Street Food in Bangkok',
    slug: 'bangkok-street-food',
    excerpt: 'Navigate the night markets and food stalls of Bangkok like a local.',
    content: '<p>From Pad Thai to Mango Sticky Rice, Bangkok street food is world-renowned. Find the best food stalls with our guide.</p>',
    category: 'Food & Culinary',
    image: '/images/category_food.png',
    status: 'Active',
    readTime: '8 min',
    author: { name: 'Elena Gomez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop' },
    createdAt: new Date('2026-05-10T10:00:00Z'),
    updatedAt: new Date('2026-05-10T10:00:00Z')
  },
  {
    title: 'How to Travel Solo Safely in South America',
    slug: 'solo-travel-south-america',
    excerpt: 'Key safety tips, cultural insights, and must-know rules for solo travelers.',
    content: '<p>Solo travel in South America is incredibly rewarding, but safety should be top of mind. Here are practical tips to keep you secure.</p>',
    category: 'Solo Travel',
    image: '/images/category_solo.png',
    status: 'Active',
    readTime: '10 min',
    author: { name: 'Alex Wanderer', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop' },
    createdAt: new Date('2026-05-05T10:00:00Z'),
    updatedAt: new Date('2026-05-05T10:00:00Z')
  },
  {
    title: 'Ultimate Safari Packing List',
    slug: 'safari-packing-list',
    excerpt: 'What to pack for an eco-friendly safari, from gear to clothing colors.',
    content: '<p>Packing for a safari requires careful consideration of weight limits and nature-appropriate materials. Here is our essential packing guide.</p>',
    category: 'Sustainable Travel',
    image: '/images/category_sustainable.png',
    status: 'Active',
    readTime: '6 min',
    author: { name: 'Sarah Miller', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop' },
    createdAt: new Date('2026-04-28T10:00:00Z'),
    updatedAt: new Date('2026-04-28T10:00:00Z')
  }
];

async function seed() {
  console.log(`Connecting to MongoDB at: ${uri}`);
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();

    // 1. Seed Categories
    console.log('Seeding categories...');
    const categoriesCollection = db.collection('categories');
    
    // Clear existing categories
    await categoriesCollection.deleteMany({});
    
    // Insert new categories
    const catResult = await categoriesCollection.insertMany(CATEGORIES);
    console.log(`Successfully seeded ${catResult.insertedCount} categories.`);

    // 2. Seed Posts
    console.log('Seeding posts...');
    const postsCollection = db.collection('posts');
    
    // Clear existing posts
    await postsCollection.deleteMany({});
    
    // Insert new posts
    const postResult = await postsCollection.insertMany(POSTS);
    console.log(`Successfully seeded ${postResult.insertedCount} posts.`);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seed();
