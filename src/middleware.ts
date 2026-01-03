// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // If no token and trying to access protected route
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// ✅ Configure where middleware runs
export const config = {
    matcher: [
      '/admin/:path*', 
      '/counter/:path*',
      '/inventory/:path*',
      '/catelog/:path*',
      '/promotion/:path*',
    ],
  };