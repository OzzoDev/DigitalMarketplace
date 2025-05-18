import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('payload-token')?.value
  const { pathname } = req.nextUrl

  const isProtectedRoute = pathname.startsWith('/cart')
  const isAuthPage = ['/sign-in', '/sign-up'].includes(pathname)

  if (isProtectedRoute && !token) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/sign-in'
    loginUrl.searchParams.set('origin', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/cart/:path*', '/sign-in', '/sign-up'],
}
