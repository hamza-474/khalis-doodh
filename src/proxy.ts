import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin routes protection
    if (path.startsWith("/admin")) {
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/api/auth/signin?error=AccessDenied", req.url));
      }
    }

    // Gwala routes protection
    if (path.startsWith("/gwala")) {
      if (token?.role !== "gwala") {
        return NextResponse.redirect(new URL("/api/auth/signin?error=AccessDenied", req.url));
      }
    }

    // Customer routes protection
    if (path.startsWith("/account") || path.startsWith("/subscribe")) {
      // Allow if authenticated with any role (usually customer, but gwala/admin might want to test)
      // For strictness, if it must be customer:
      // if (token?.role !== "customer") {
      //   return NextResponse.redirect(new URL("/api/auth/signin?error=AccessDenied", req.url));
      // }
      // But let's just make sure they are logged in:
      if (!token) {
        return NextResponse.redirect(new URL("/api/auth/signin", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // If the route is in the matcher, we must return true if token exists for the middleware function to run
        // If we return false, it redirects to login immediately.
        // We will handle role-based redirection inside the middleware function, so just check token exists here.
        const path = req.nextUrl.pathname;
        if (path.startsWith("/admin") || path.startsWith("/gwala") || path.startsWith("/account") || path.startsWith("/subscribe")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/gwala/:path*", "/account/:path*", "/subscribe/:path*"],
};
