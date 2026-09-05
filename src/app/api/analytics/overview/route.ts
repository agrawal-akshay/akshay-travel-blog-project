import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const postsCollection = db.collection('posts');
    const categoriesCollection = db.collection('categories');
    const usersCollection = db.collection('users');

    const totalPosts = await postsCollection.countDocuments({});
    const activePosts = await postsCollection.countDocuments({ status: { $in: ['PUBLISHED', 'Active'] } });
    const draftPosts = await postsCollection.countDocuments({ status: { $in: ['DRAFT', 'Inactive'] } });
    
    const totalCategories = await categoriesCollection.countDocuments({});
    const totalAdmins = await usersCollection.countDocuments({ role: 'admin' });

    // Fetch the 5 most recent posts for quick overview
    const recentPosts = await postsCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    // Calculate real stats from database
    const allPosts = await postsCollection.find({}).project({ views: 1, createdAt: 1 }).toArray();
    const totalViews = allPosts.reduce((sum: number, p: any) => sum + (p.views || 0), 0);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const postsThisWeek = allPosts.filter((p: any) => p.createdAt && new Date(p.createdAt) >= oneWeekAgo).length;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const viewsThisMonth = allPosts
      .filter((p: any) => p.createdAt && new Date(p.createdAt) >= thirtyDaysAgo)
      .reduce((sum: number, p: any) => sum + (p.views || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        totalPosts,
        activePosts,
        draftPosts,
        totalCategories,
        totalAdmins,
        totalViews,
        postsThisWeek,
        viewsThisMonth,
        recentPosts,
      }
    }, { status: 200 });
  } catch (error) {
    console.error('[GET_ANALYTICS_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}
