import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_123456';

export async function verifyAdmin(req: NextRequest): Promise<boolean> {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return false;

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return payload.role === 'admin';
  } catch (error) {
    console.error('[AUTH_VERIFY_ADMIN_ERROR]', error);
    return false;
  }
}
