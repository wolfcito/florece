import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to protect routes
 *
 * Public routes: /, /login
 * Protected routes: /diagnostic, /plan/*, /actions/*, /receipts/*, /api/* (except /api/test-agent)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes - always allow
  const publicRoutes = ['/', '/login'];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Public API routes for testing
  if (pathname === '/api/test-agent') {
    return NextResponse.next();
  }

  // Check for auth token (Firebase ID token in cookie or header)
  const authToken =
    request.cookies.get('auth-token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  // If no token, redirect to login
  if (!authToken) {
    // For API routes, return 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // For pages, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // TODO: Verify token with Firebase Admin
  // For now, just check if token exists (demo mode)
  // In production, verify the token:
  // const { auth } = getFirebaseAdmin();
  // await auth.verifyIdToken(authToken);

  return NextResponse.next();
}

/**
 * Configure which routes use this middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
