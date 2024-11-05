import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const hostname = req.headers.get('host') || ''
    const subdomain = hostname.split('.')[0]
    
    // Skip subdomain check for main domain
    if (hostname === 'afftrack.live') {
      // If the user is not authenticated and trying to access protected routes
      if (!req.nextauth.token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.next();
    }

    // For subdomains, add the subdomain to headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-subdomain', subdomain);

    // If the user is not authenticated and trying to access protected routes
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/assets/:path*",
    "/reports/:path*",
    "/landing-pages/:path*",
    "/users/:path*",
    "/activity/:path*",
    "/settings/:path*",
  ],
};