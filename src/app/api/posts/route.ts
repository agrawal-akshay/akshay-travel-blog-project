import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDb } from '../../../lib/db';
import { ObjectId } from 'mongodb';
import { verifyAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET API: Saari posts fetch karne ke liye (ya filter karne ke liye)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');

    const db = await getDb();
    const postsCollection = db.collection('posts');

    // Query builder logic
    const statusParam = searchParams.get('status');
    const query: any = {};
    
    if (statusParam === 'all') {
      // Return all posts (for admin view)
    } else if (statusParam) {
      query.status = statusParam;
    } else {
      // Default: show both PUBLISHED and Active posts for public blog
      query.status = { $in: ['PUBLISHED', 'Active'] };
    }

    if (category) {
      const categoriesCollection = db.collection('categories');
      const catObj = await categoriesCollection.findOne({
        $or: [
          { slug: category.toLowerCase() },
          { name: { $regex: new RegExp(`^${category}$`, 'i') } }
        ]
      });

      if (catObj) {
        query.category = { $regex: new RegExp(`^${catObj.name}$`, 'i') };
      } else {
        const allCats = await categoriesCollection.find({}).toArray();
        const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const matchedCat = allCats.find((c: any) => slugify(c.name) === category.toLowerCase() || c.slug === category.toLowerCase());
        
        if (matchedCat) {
          query.category = { $regex: new RegExp(`^${matchedCat.name}$`, 'i') };
        } else {
          query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }
      }
    }

    // Database se data fetch karna, sort karna (latest first), aur limit lagana
    const posts = await postsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: posts,
    }, { status: 200 });

  } catch (error) {
    console.error('[GET_POSTS_ERROR]', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch posts' 
    }, { status: 500 });
  }
}

// POST API: Nayi blog post create karne ke liye
export async function POST(req: NextRequest) {
  try {
    if (!(await verifyAdmin(req))) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin role required.' }, { status: 401 });
    }

    const body = await req.json();

    // Basic validation (Isme aage chal kar Zod library use kar sakte hain)
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title, slug, and content are required' 
      }, { status: 400 });
    }

    const db = await getDb();
    const postsCollection = db.collection('posts');

    // Check if slug already exists (URL unique hona chahiye)
    const existingPost = await postsCollection.findOne({ slug: body.slug });
    if (existingPost) {
      return NextResponse.json({ 
        success: false, 
        error: 'A post with this slug already exists' 
      }, { status: 409 });
    }

    // Parse custom createdAt if date fields are provided
    let createdAt = new Date();
    if (body.year && body.month && body.day) {
      const year = parseInt(body.year);
      const month = parseInt(body.month) - 1;
      const day = parseInt(body.day);
      let hours = 0;
      let minutes = 0;
      if (body.time) {
        const timeMatch = body.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (timeMatch) {
          hours = parseInt(timeMatch[1]);
          minutes = parseInt(timeMatch[2]);
          const ampm = timeMatch[3];
          if (ampm) {
            if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
            if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
          }
        }
      }
      createdAt = new Date(year, month, day, hours, minutes);
    }

    // New post object mapping
    const newPost = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || '',
      content: body.content,
      category: body.category || 'General',
      image: body.image || '',
      instructorName: body.instructorName || '',
      instructorImage: body.instructorImage || '',
      destination: body.destination || '',
      status: body.status || 'Active', // Active or PUBLISHED
      readTime: body.readTime || '5 min',
      views: 0,
      author: {
        name: body.authorName || 'Travilever Admin',
        avatar: body.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'
      },
      year: body.year || '',
      month: body.month || '',
      day: body.day || '',
      time: body.time || '',
      createdAt,
      updatedAt: new Date(),
    };

    // Database mein insert karna
    const result = await postsCollection.insertOne(newPost);

    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${newPost.slug}`);
    } catch (e) {
      console.warn('[REVALIDATE_WARN]', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Post created successfully',
      data: { ...newPost, _id: result.insertedId },
    }, { status: 201 });

  } catch (error) {
    console.error('[CREATE_POST_ERROR]', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}