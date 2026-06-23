import { NextRequest, NextResponse } from "next/server";

import { decode } from "./helpers/jwtHelpers";

const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    if (authRoutes.includes(pathname)) {
      return NextResponse.next();
    }

    return NextResponse.redirect(
      new URL(pathname ? `/login?redirect=${pathname}` : "/login", request.url)
    );
  }

  let decodedToken = null;

  try {
    decodedToken = decode(accessToken) as any;
  } catch (error) {
    console.error("Invalid access token in middleware:", error);
    const response = NextResponse.redirect(new URL("/login", request.url));

    response.cookies.delete("accessToken");
    return response;
  }

  const role = decodedToken?.role;
  const dashboardRoute = role === "admin" ? "/admin-dashboard" : "/dashboard";

  if (authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(dashboardRoute, request.url));
  }

  if (role === "admin" && pathname.match(/^\/dashboard/)) {
    return NextResponse.redirect(new URL("/admin-dashboard", request.url));
  }

  if (role === "user" && pathname.match(/^\/admin-dashboard/)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (role === "admin" && pathname.match(/^\/admin-dashboard/)) {
    return NextResponse.next();
  }

  if (role === "user" && pathname.match(/^\/dashboard/)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/login", "/signup", "/dashboard/:page*", "/admin-dashboard/:page*"],
};
