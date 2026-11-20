import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

// Route → allowed roles
const PROTECTED_ROUTES: Record<string, string[]> = {
  "/buyer": ["BUYER", "BULK_BUYER"],
  "/farmer": ["FARMER"],
  "/bulk-buyer": ["BULK_BUYER"],
  "/admin": ["ADMIN"],
};

// Public paths that never need auth
const PUBLIC_PATHS = [
  "/",
  "/about",
  "/how-it-works",
  "/contact",
  "/explore",
  "/farmers",
  "/login",
  "/register",
  "/forgot-password",
  "/verify",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/products",
  "/api/farmers",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next.js internals and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if public
  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // Get session
  const session = await getSessionFromRequest(request);

  // No session — redirect to login
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based route checking
  for (const [prefix, allowedRoles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(prefix)) {
      if (!allowedRoles.includes(session.role)) {
        // Redirect to their appropriate dashboard
        const dashboardRoutes: Record<string, string> = {
          FARMER: "/farmer/dashboard",
          BUYER: "/buyer/dashboard",
          BULK_BUYER: "/bulk-buyer/dashboard",
          ADMIN: "/admin/dashboard",
        };
        return NextResponse.redirect(
          new URL(dashboardRoutes[session.role] || "/", request.url)
        );
      }
      break;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
