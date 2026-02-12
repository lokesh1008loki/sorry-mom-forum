import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Add paths that require authentication
const protectedPaths = ['/dashboard', '/profile', '/settings', '/admin']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Skip middleware for homepage and public routes
  if (path === '/' || path.startsWith('/api/') || path.startsWith('/_next/')) {
    return NextResponse.next()
  }

  // Check if the path requires authentication
  if (protectedPaths.some(prefix => path.startsWith(prefix))) {
    const token = await getToken({ req: request })

    // If no token, redirect to login
    if (!token) {
      const url = new URL('/login', request.url)
      url.searchParams.set('from', path)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 