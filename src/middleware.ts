// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const adminPaths = ["/admin"];

export async function middleware(req: NextRequest) {
  try {
    const pathname = req.nextUrl.pathname;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (adminPaths.some((path) => pathname.startsWith(path))) {
      const roles = token?.roles || [];
      if (!Array.isArray(roles) || !roles.includes("admin")) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
