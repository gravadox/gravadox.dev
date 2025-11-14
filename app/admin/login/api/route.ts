import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const key = await req.text()
  const input = key.trim()
  const secret = process.env.ADMIN_SECRET?.trim()

  if (input && secret && input === secret) {
    (await cookies()).set("admin", secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      path: "/",
    })
    return NextResponse.json({ ok: true })
  }

  return new NextResponse("Unauthorized", { status: 401 })
}
