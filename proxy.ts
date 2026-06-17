import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(req: NextRequest) {
  const isLoginPage = req.nextUrl.pathname.startsWith("/admin/login")
  const cookie = req.cookies.get("admin")?.value

  if (!cookie && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  // Forward the real pathname to server components (used by admin layout for auth guard)
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set("x-pathname", req.nextUrl.pathname)

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ["/admin/:path*"]
}
