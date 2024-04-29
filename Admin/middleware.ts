// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
import { withAuth, NextRequestWithAuth } from "next-auth/middleware"
import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isAuthenticated = !!req.cookies.get("next-auth.session-token")
    const session = await getToken({ req: req, secret: process.env.NEXTAUTH_JWT_SECRET, });


    if (path.startsWith("/register") && session?.role !== "Admin") {
        return NextResponse.rewrite(
            new URL("/denied", req.url)
        )
    }
    if (isAuthenticated && path.startsWith("/login")){
        return NextResponse.rewrite(
            new URL("/", req.url)
        )
    }
}


// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = { matcher: ["/register", "/login", "/:path*"] }