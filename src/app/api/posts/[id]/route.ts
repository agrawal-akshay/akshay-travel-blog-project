import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { verifyAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const db = await getDb();
    const postsCollection = db.collection('posts');

    const query = ObjectId.isValid(id)
      ? { $or: [{ _id: new ObjectId(id) }, { slug: id }] }
      : { slug: id };

    const post = await postsCollection.findOne(query);
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post }, { status: 200 });
  } catch (error) {
    console.error('[GET_SINGLE_POST_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await verifyAdmin(req))) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin role required.' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();

    // Basic Validation
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { success: false, error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const postsCollection = db.collection('posts');

    const query = ObjectId.isValid(id)
      ? { $or: [{ _id: new ObjectId(id) }, { slug: id }] }
      : { slug: id };

    const targetPost = await postsCollection.findOne(query);
    if (!targetPost) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    // Check if slug is taken by another post
    const existingPostWithSlug = await postsCollection.findOne({
      slug: body.slug,
      _id: { $ne: targetPost._id },
    });
    if (existingPostWithSlug) {
      return NextResponse.json(
        { success: false, error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }

    // Parse custom createdAt if date fields are provided
    let createdAt = undefined;
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

    const updatePost = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || '',
      content: body.content,
      category: body.category || 'General',
      image: body.image || '',
      instructorName: body.instructorName || '',
      instructorImage: body.instructorImage || '',
      destination: body.destination || '',
      status: body.status || 'Active',
      readTime: body.readTime || '5 min',
      type: body.type || 'Blog',
      author: {
        name: body.authorName || targetPost.author?.name || 'Travilever Admin',
        avatar: body.authorAvatar || targetPost.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      },
      year: body.year || '',
      month: body.month || '',
      day: body.day || '',
      time: body.time || '',
      metaTitle: body.metaTitle || '',
      metaKeywords: body.metaKeywords || '',
      metaDescription: body.metaDescription || '',
      ...(createdAt ? { createdAt } : {}),
      updatedAt: new Date(),
    };

    const result = await postsCollection.updateOne(
      { _id: targetPost._id },
      { $set: updatePost }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${updatePost.slug}`);
      if (targetPost.slug && targetPost.slug !== updatePost.slug) {
        revalidatePath(`/blog/${targetPost.slug}`);
      }
    } catch (e) {
      console.warn('[REVALIDATE_WARN]', e);
    }

    return NextResponse.json({ success: true, message: 'Post updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('[UPDATE_POST_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await verifyAdmin(req))) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin role required.' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const db = await getDb();
    const postsCollection = db.collection('posts');

    const query = ObjectId.isValid(id)
      ? { $or: [{ _id: new ObjectId(id) }, { slug: id }] }
      : { slug: id };

    const targetPost = await postsCollection.findOne(query);
    const result = await postsCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    try {
      revalidatePath('/blog');
      if (targetPost?.slug) {
        revalidatePath(`/blog/${targetPost.slug}`);
      }
    } catch (e) {
      console.warn('[REVALIDATE_WARN]', e);
    }

    return NextResponse.json({ success: true, message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('[DELETE_POST_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
