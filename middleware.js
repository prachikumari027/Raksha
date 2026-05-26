import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get tokens from cookies
  const userToken = request.cookies.get('userToken')?.value;
  const doctorToken = request.cookies.get('doctorToken')?.value;

  // If on root path and authenticated, redirect to dashboard
  if (pathname === '/') {
    if (userToken) {
      return NextResponse.redirect(new URL('/user/home', request.url));
    }
    if (doctorToken) {
      return NextResponse.redirect(new URL('/doctor/home', request.url));
    }
    // Not authenticated, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access login but already authenticated, redirect to dashboard
  if (pathname === '/login') {
    if (userToken) {
      return NextResponse.redirect(new URL('/user/home', request.url));
    }
    if (doctorToken) {
      return NextResponse.redirect(new URL('/doctor/home', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login'],
};
