import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const isLoginPage = req.nextUrl.pathname.startsWith("/admin/login")
  const cookie = req.cookies.get("admin")?.value

  if (!cookie && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"]
}
