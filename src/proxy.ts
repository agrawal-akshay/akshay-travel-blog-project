import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_123456';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if it's an admin path and not the login page
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      
      if (payload.role !== 'admin') {
        const response = NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url));
        return response;
      }
      
      return NextResponse.next();
    } catch (error) {
      console.error('JWT verification error in proxy:', error);
      // Clear token cookie and redirect to login
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
