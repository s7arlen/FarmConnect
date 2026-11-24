import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

// Specific protected routes → allowed roles
const PROTECTED_ROUTES: Record<string, string[]> = {
  "/buyer/dashboard": ["BUYER", "BULK_BUYER"],
  "/buyer/cart": ["BUYER", "BULK_BUYER"],
  "/buyer/checkout": ["BUYER", "BULK_BUYER"],
  "/buyer/orders": ["BUYER", "BULK_BUYER"],
  "/buyer/profile": ["BUYER", "BULK_BUYER"],
  "/buyer/settings": ["BUYER", "BULK_BUYER"],
  "/buyer/wishlist": ["BUYER", "BULK_BUYER"],
  "/buyer/bulk": ["BUYER", "BULK_BUYER"],
  "/farmer": ["FARMER"],
  "/bulk-buyer": ["BULK_BUYER"],
  "/admin": ["ADMIN"],
};

const DASHBOARD_ROUTES: Record<string, string> = {
  FARMER: "/farmer/dashboard",
  BUYER: "/buyer/dashboard",
  BULK_BUYER: "/bulk-buyer/dashboard",
  ADMIN: "/admin/dashboard",
};

// Public paths that never need auth
const PUBLIC_PATHS = [
  "/",
  "/get-started",
  "/get-started/roles",
  "/about",
  "/how-it-works",
  "/contact",
  "/explore",
  "/farmers",
  "/buyer/explore",
  "/buyer/farmers",
  "/buyer/products",
  "/login",
  "/register",
  "/forgot-password",
  "/verify",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/auth/google",
  "/api/auth/google/callback",
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

  // Get session
  const session = await getSessionFromRequest(request);

  // If logged-in user visits welcome, login, or register -> redirect to their role dashboard
  if (session && (pathname === "/get-started" || pathname === "/get-started/roles" || pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL(DASHBOARD_ROUTES[session.role] || "/buyer/dashboard", request.url));
  }

  // If logged-in user visits root "/", redirect to their role dashboard
  if (session && pathname === "/") {
    return NextResponse.redirect(new URL(DASHBOARD_ROUTES[session.role] || "/buyer/dashboard", request.url));
  }

  // If new visitor lands on "/" without session, check if they've visited before or opted to explore as guest
  if (!session && pathname === "/") {
    const hasVisited = request.cookies.get("farmconnect_visited")?.value;
    const isGuestParam = request.nextUrl.searchParams.has("guest");
    if (!hasVisited && !isGuestParam) {
      return NextResponse.redirect(new URL("/get-started", request.url));
    }
  }

  // Check if public
  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // Check if current route requires protection
  const isProtected = Object.keys(PROTECTED_ROUTES).some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // No session — redirect to login
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based route checking
  for (const [prefix, allowedRoles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      if (!allowedRoles.includes(session.role)) {
        // Redirect to their appropriate dashboard
        return NextResponse.redirect(
          new URL(DASHBOARD_ROUTES[session.role] || "/", request.url)
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
