import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { rateLimit } from '@/lib/rate-limiter';

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(req, 5)) {
      return NextResponse.json(
        { success: false, error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
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

    // Check if user already exists
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
      { success: true, message: 'Admin user registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[REGISTER_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
