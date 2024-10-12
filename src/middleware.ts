/* eslint-disable prettier/prettier */
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decode } from "./helpers/jwtHelpers";

/* eslint-disable prettier/prettier */

const authRoutes = ["/login", "signup"];

export async function middleware(request: NextRequest) {
  console.log(request, "middleware");

  const { pathname } = request.nextUrl;

  const accessToken = cookies().get("accessToken")?.value;

  //protecting hybrid routes
  if (!accessToken) {
    if (authRoutes.includes(pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(
          pathname ? `/login?redirect=${pathname}` : "/login",
          request.url
        )
      );
    }
  }

  //rolebase authorization
  let decodedToken = null;

  decodedToken = decode(accessToken) as any;

  const role = decodedToken?.role;

  if (role === "admin" && pathname.match(/^\/admin-dashboard/) ) {
    return NextResponse.next();
  }
  if (role === "user" && pathname.match(/^\/dashboard/)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard/:page*",
    "/admin-dashboard/:page*",
  ],
};
