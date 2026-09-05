import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { verifyAdmin } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limiter';

function sanitizeInput(str: string): string {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

export async function GET(req: NextRequest) {
  try {
    if (!(await verifyAdmin(req))) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin role required.' }, { status: 401 });
    }

    const db = await getDb();
    const messagesCollection = db.collection('messages');
    const messages = await messagesCollection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: messages }, { status: 200 });
  } catch (error) {
    console.error('[GET_MESSAGES_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit public form submission to 5 per minute per IP
    if (!rateLimit(req, 5)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { firstName, lastName, email, message } = await req.json();

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Input sanitization to prevent XSS
    const cleanFirstName = sanitizeInput(firstName);
    const cleanLastName = sanitizeInput(lastName);
    const cleanEmail = sanitizeInput(email);
    const cleanMessage = sanitizeInput(message);

    const db = await getDb();
    const messagesCollection = db.collection('messages');

    const newMessage = {
      firstName: cleanFirstName,
      lastName: cleanLastName,
      email: cleanEmail,
      message: cleanMessage,
      status: 'unread',
      createdAt: new Date(),
    };

    await messagesCollection.insertOne(newMessage);

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[CREATE_MESSAGE_ERROR]', error);
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
      return NextResponse.json({ success: false, error: 'Invalid message ID' }, { status: 400 });
    }

    const db = await getDb();
    const messagesCollection = db.collection('messages');

    const result = await messagesCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Message deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('[DELETE_MESSAGE_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
