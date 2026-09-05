import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();
    const { name, slug, description, color } = body;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid category ID' }, { status: 400 });
    }

    const db = await getDb();
    const categoriesCollection = db.collection('categories');

    const updateData: any = {};
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (color) updateData.color = color;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: false, error: 'No update data provided' }, { status: 400 });
    }

    const result = await categoriesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Category updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('[UPDATE_CATEGORY_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid category ID' }, { status: 400 });
    }

    const db = await getDb();
    const categoriesCollection = db.collection('categories');

    const result = await categoriesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Category deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('[DELETE_CATEGORY_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
