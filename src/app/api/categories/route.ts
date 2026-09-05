import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const categoriesCollection = db.collection('categories');
    const postsCollection = db.collection('posts');

    const categories = await categoriesCollection.find({}).toArray();

    // Dynamically calculate the post count for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat: any) => {
        const count = await postsCollection.countDocuments({
          category: { $regex: new RegExp(`^${cat.name}$`, 'i') },
          status: { $in: ['PUBLISHED', 'Active'] },
        });
        return {
          ...cat,
          posts: count,
        };
      })
    );

    return NextResponse.json({ success: true, data: categoriesWithCounts }, { status: 200 });
  } catch (error) {
    console.error('[GET_CATEGORIES_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, description, color } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Category Name is required' }, { status: 400 });
    }

    const catSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const db = await getDb();
    const categoriesCollection = db.collection('categories');

    const existingCategory = await categoriesCollection.findOne({ slug: catSlug });
    if (existingCategory) {
      return NextResponse.json({ success: false, error: 'Category with this slug already exists' }, { status: 409 });
    }

    const newCategory = {
      name,
      slug: catSlug,
      description: description || '',
      color: color || 'bg-blue-500',
      createdAt: new Date(),
    };

    const result = await categoriesCollection.insertOne(newCategory);

    return NextResponse.json(
      { success: true, data: { ...newCategory, _id: result.insertedId } },
      { status: 201 }
    );
  } catch (error) {
    console.error('[CREATE_CATEGORY_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
