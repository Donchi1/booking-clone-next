import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/main/profile',
  '/main/reservations',
];

// Routes that should redirect authenticated users
const AUTH_ROUTES = [
  '/auth/login',
  '/auth/register',
];

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Check if the user is authenticated by checking the token
  const token = request.cookies.get('access_token')?.value || '';

  // Determine if the current route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    path.startsWith(route)
  );

  // Determine if the current route is an auth route
  const isAuthRoute = AUTH_ROUTES.some(route => 
    path.startsWith(route)
  );

  // If trying to access an auth route while authenticated, redirect to main page
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If trying to access a protected route without authentication
  if (isProtectedRoute && !token) {
    // Redirect to login and save the original destination
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  // If everything is fine, continue the request
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Match all routes under /main and /auth
    '/main/:path*',
    '/auth/:path*',
  ],
}