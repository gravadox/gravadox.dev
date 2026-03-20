import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createSession } from "@/lib/auth"

export async function POST(req: Request) {
  const key = (await req.text()).trim()
  const secret = process.env.ADMIN_SECRET?.trim()
  const input = key.trim()

  if (key && secret && key === secret) {
    const token = await createSession()
    ;(await cookies()).set("admin", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      path: "/",
      maxAge: 60**2,
    })
    return NextResponse.json({ ok: true })
  }

  return new NextResponse("Unauthorized", { status: 401 })
}
