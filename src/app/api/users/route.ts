import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { verifyAdmin } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  try {
    if (!(await verifyAdmin(req))) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin role required.' }, { status: 401 });
    }

    const db = await getDb();
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    console.error('[GET_USERS_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await verifyAdmin(req))) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin role required.' }, { status: 401 });
    }

    const { username, email, password, role } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const usersCollection = db.collection('users');

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      email,
      password: hashedPassword,
      role: role || 'user',
      createdAt: new Date(),
    };

    await usersCollection.insertOne(newUser);

    return NextResponse.json(
      { success: true, message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[CREATE_USER_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await verifyAdmin(req))) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin role required.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid user ID' }, { status: 400 });
    }

    const db = await getDb();
    const usersCollection = db.collection('users');

    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('[DELETE_USER_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
