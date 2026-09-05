import { MongoClient, Db, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

async function seedInitialData(db: Db) {
  try {
    const usersCollection = db.collection('users');
    // Ensure only real admin accounts exist, removing any fake users
    await usersCollection.deleteMany({ role: { $ne: 'admin' } });
    const adminCount = await usersCollection.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin@123', 10);
      await usersCollection.insertMany([
        {
          _id: new ObjectId('60d5ecb8b5c9d5e99e9d44a1'),
          username: 'akshay',
          email: 'akshay@cantilever',
          password: hashedPassword,
          role: 'admin',
          createdAt: new Date(),
        },
        {
          _id: new ObjectId('60d5ecb8b5c9d5e99e9d44a2'),
          username: 'admin',
          email: 'admin@travilever.com',
          password: hashedPassword,
          role: 'admin',
          createdAt: new Date(),
        },
      ]);
      console.log('[DB] Auto-seeded admin accounts');
    }

    const categoriesCollection = db.collection('categories');
    const catCount = await categoriesCollection.countDocuments();
    if (catCount === 0) {
      await categoriesCollection.insertMany([
        { name: 'Adventure', slug: 'adventure', image: '/images/category_adventure.png', description: 'Thrilling outdoor experiences and active travels.', color: 'bg-orange-500' },
        { name: 'Luxury Travel', slug: 'luxury-travel', image: '/images/category_luxury.png', description: 'Premium stays and upscale travel guides.', color: 'bg-purple-500' },
        { name: 'Budget Backpacking', slug: 'budget-backpacking', image: '/images/category_budget.png', description: 'Affordable travel tips and budget guides.', color: 'bg-green-500' },
        { name: 'Food & Culinary', slug: 'food-culinary', image: '/images/category_food.png', description: 'Discovering the world through local cuisines.', color: 'bg-red-500' },
        { name: 'Solo Travel', slug: 'solo-travel', image: '/images/category_solo.png', description: 'Guides and inspiration for solo adventurers.', color: 'bg-blue-500' },
        { name: 'Photography', slug: 'photography', image: '/images/category_photography.png', description: 'Camera tips and travel photography inspiration.', color: 'bg-teal-500' },
        { name: 'Road Trips', slug: 'road-trips', image: '/images/category_road_trip.png', description: 'Scenic drives and route guides.', color: 'bg-yellow-500' },
        { name: 'Sustainable Travel', slug: 'sustainable-travel', image: '/images/category_sustainable.png', description: 'Eco-friendly and responsible travel guides.', color: 'bg-emerald-500' },
      ]);
      console.log('[DB] Auto-seeded default categories');
    }

    const postsCollection = db.collection('posts');
    const postCount = await postsCollection.countDocuments();
    if (postCount === 0) {
      await postsCollection.deleteMany({});
      await postsCollection.insertMany([
        {
          _id: new ObjectId('60d5ecb8b5c9d5e99e9d44f1'),
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
          _id: new ObjectId('60d5ecb8b5c9d5e99e9d44f2'),
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
          _id: new ObjectId('60d5ecb8b5c9d5e99e9d44f3'),
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
          _id: new ObjectId('60d5ecb8b5c9d5e99e9d44f4'),
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
          _id: new ObjectId('60d5ecb8b5c9d5e99e9d44f5'),
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
          _id: new ObjectId('60d5ecb8b5c9d5e99e9d44f6'),
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
          _id: new ObjectId('60d5ecb8b5c9d5e99e9d44f7'),
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
          _id: new ObjectId('60d5ecb8b5c9d5e99e9d44f8'),
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
          _id: new ObjectId('60d5ecb8b5c9d5e99e9d44f9'),
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
          _id: new ObjectId('60d5ecb8b5c9d5e99e9d44fa'),
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
          _id: new ObjectId('60d5ecb8b5c9d5e99e9d44fb'),
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
          _id: new ObjectId('60d5ecb8b5c9d5e99e9d44fc'),
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
      ]);
      console.log('[DB] Auto-seeded default posts (12 total)');
    }

    const messagesCollection = db.collection('messages');
    await messagesCollection.deleteMany({});
    console.log('[DB] Cleaned fake messages inbox');
  } catch (err) {
    console.error('[DB_SEED_ERROR]', err);
  }
}

const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
  _mongoMemoryServer?: any;
  _inMemoryDb?: any;
};

class InMemoryCollection {
  name: string;
  docs: any[];

  constructor(name: string, initialDocs: any[] = []) {
    this.name = name;
    this.docs = [...initialDocs];
  }

  private matchesQuery(doc: any, query: any): boolean {
    if (!query || Object.keys(query).length === 0) return true;

    for (const key of Object.keys(query)) {
      const val = query[key];

      if (key === '_id') {
        const docIdStr = doc._id ? doc._id.toString() : String(doc._id);
        const queryIdStr = val ? (val.toString ? val.toString() : String(val)) : String(val);
        if (docIdStr !== queryIdStr) return false;
        continue;
      }

      if (key === '$or' && Array.isArray(val)) {
        const orMatch = val.some((subQ) => this.matchesQuery(doc, subQ));
        if (!orMatch) return false;
        continue;
      }

      if (val && typeof val === 'object' && val.$ne !== undefined) {
        if (doc[key] === val.$ne) return false;
        continue;
      }

      if (val && typeof val === 'object' && Array.isArray(val.$in)) {
        if (!val.$in.includes(doc[key])) return false;
        continue;
      }

      if (val && typeof val === 'object' && Array.isArray(val.$nin)) {
        const docIdStr = doc[key] ? (doc[key].toString ? doc[key].toString() : String(doc[key])) : String(doc[key]);
        const inList = val.$nin.map((x: any) => (x ? (x.toString ? x.toString() : String(x)) : String(x)));
        if (inList.includes(docIdStr)) return false;
        continue;
      }

      if (val && typeof val === 'object' && val.$regex) {
        const flags = val.$options || '';
        const regex = new RegExp(val.$regex, flags);
        if (!regex.test(doc[key] || '')) return false;
        continue;
      }

      if (doc[key] !== val) return false;
    }
    return true;
  }

  async findOne(query?: any) {
    return this.docs.find((d) => this.matchesQuery(d, query)) || null;
  }

  find(query?: any) {
    let results = this.docs.filter((d) => this.matchesQuery(d, query));

    const cursor = {
      sort(sortObj: any) {
        if (sortObj) {
          const key = Object.keys(sortObj)[0];
          const dir = sortObj[key];
          results.sort((a, b) => {
            const valA = a[key] instanceof Date ? a[key].getTime() : a[key];
            const valB = b[key] instanceof Date ? b[key].getTime() : b[key];
            if (valA < valB) return dir === 1 ? -1 : 1;
            if (valA > valB) return dir === 1 ? 1 : -1;
            return 0;
          });
        }
        return cursor;
      },
      skip(count: number) {
        results = results.slice(count);
        return cursor;
      },
      limit(count: number) {
        results = results.slice(0, count);
        return cursor;
      },
      project() {
        return cursor;
      },
      async toArray() {
        return [...results];
      },
    };
    return cursor;
  }

  async insertOne(doc: any) {
    const newDoc = {
      _id: doc._id || new ObjectId(),
      ...doc,
      createdAt: doc.createdAt || new Date(),
    };
    this.docs.push(newDoc);
    return { insertedId: newDoc._id };
  }

  async insertMany(docs: any[]) {
    const insertedIds: any[] = [];
    for (const doc of docs) {
      const res = await this.insertOne(doc);
      insertedIds.push(res.insertedId);
    }
    return { insertedIds };
  }

  async updateOne(query: any, update: any) {
    const doc = await this.findOne(query);
    if (!doc) return { modifiedCount: 0 };

    if (update.$set) {
      Object.assign(doc, update.$set);
    }
    return { modifiedCount: 1 };
  }

  async deleteOne(query: any) {
    const index = this.docs.findIndex((d) => this.matchesQuery(d, query));
    if (index !== -1) {
      this.docs.splice(index, 1);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  async deleteMany(query: any) {
    let count = 0;
    for (let i = this.docs.length - 1; i >= 0; i--) {
      if (this.matchesQuery(this.docs[i], query)) {
        this.docs.splice(i, 1);
        count++;
      }
    }
    return { deletedCount: count };
  }

  async countDocuments(query?: any) {
    if (!query || Object.keys(query).length === 0) return this.docs.length;
    return this.docs.filter((d) => this.matchesQuery(d, query)).length;
  }
}

class InMemoryDb {
  collections: Map<string, InMemoryCollection> = new Map();

  collection(name: string): InMemoryCollection {
    if (!this.collections.has(name)) {
      this.collections.set(name, new InMemoryCollection(name));
    }
    return this.collections.get(name)!;
  }
}

async function connectClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (uri) {
    try {
      const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000,
      });
      await client.connect();
      console.log('[DB] Connected to primary MongoDB successfully.');
      return client;
    } catch (error) {
      console.warn('[DB] Primary MONGODB_URI connection failed or timed out. Falling back to shared MongoMemoryServer...');
    }
  }

  // Try MongoMemoryServer
  try {
    if (!globalWithMongo._mongoMemoryServer) {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      globalWithMongo._mongoMemoryServer = await MongoMemoryServer.create();
      console.log('[DB] MongoMemoryServer started at:', globalWithMongo._mongoMemoryServer.getUri());
    }

    const memUri = globalWithMongo._mongoMemoryServer.getUri();
    const memClient = new MongoClient(memUri);
    await memClient.connect();
    return memClient;
  } catch (memErr) {
    console.warn('[DB] MongoMemoryServer failed (e.g. serverless environment). Using pure JS InMemoryDb fallback.', memErr);
    throw memErr; // Will trigger fallback in getDb()
  }
}

let clientPromise: Promise<MongoClient> | null = null;

delete globalWithMongo._mongoClientPromise;

if (!globalWithMongo._mongoClientPromise) {
  globalWithMongo._mongoClientPromise = (async () => {
    try {
      const client = await connectClient();
      const db = client.db();
      await seedInitialData(db as any);
      return client;
    } catch (err) {
      delete globalWithMongo._mongoClientPromise;
      throw err;
    }
  })();
}
clientPromise = globalWithMongo._mongoClientPromise;

export async function getDb(): Promise<Db | any> {
  try {
    if (globalWithMongo._inMemoryDb) {
      return globalWithMongo._inMemoryDb;
    }
    if (!clientPromise) {
      throw new Error('clientPromise is null');
    }
    const connectedClient = await clientPromise;
    return connectedClient.db();
  } catch (err) {
    if (!globalWithMongo._inMemoryDb) {
      console.log('[DB] Initializing pure JS InMemoryDb fallback...');
      const inMemDb = new InMemoryDb();
      await seedInitialData(inMemDb as any);
      globalWithMongo._inMemoryDb = inMemDb;
    }
    return globalWithMongo._inMemoryDb;
  }
}

export default clientPromise;