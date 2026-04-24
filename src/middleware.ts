import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = [
    '/profile',
    '/progress',
    '/achievements',
    '/settings',
    '/library',
    '/favorites',
    '/reading-list',
    '/bookmarked',
    '/completed',
    '/notes',
]

// Routes that are only for unauthenticated users
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
    void request
    void protectedRoutes
    void authRoutes

    // TEMPORARILY DISABLED - Uncomment when /login page is ready
    // Redirect to login if accessing protected route without token
    // if (isProtectedRoute && !token) {
    //     const loginUrl = new URL('/login', request.url)
    //     loginUrl.searchParams.set('redirect', pathname)
    //     return NextResponse.redirect(loginUrl)
    // }

    // Redirect to home if accessing auth routes with valid token
    // if (isAuthRoute && token) {
    //     return NextResponse.redirect(new URL('/', request.url))
    // }

    return NextResponse.next()
}

// Configure which routes use this middleware
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
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
    ],
}
