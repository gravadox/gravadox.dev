import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createSession } from "@/lib/auth"
import { timingSafeEqual, createHash } from "crypto"

export async function POST(req: Request) {

  // origin block
  const origin = req.headers.get("origin")
  const host = req.headers.get("host")
  if (!origin || new URL(origin).host !== host) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  // logoin logic
  const key = (await req.text()).trim()
  const secret = process.env.ADMIN_SECRET?.trim()
  const input = key.trim()

  if (!key || !secret) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // timingSafeEqual requires same-length buffers, hash both to normalize
  const keyBuf = createHash("sha256").update(key).digest()
  const secretBuf = createHash("sha256").update(secret).digest()

  if (!timingSafeEqual(keyBuf, secretBuf)) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const token = await createSession()
  ;(await cookies()).set("admin", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    path: "/",
    maxAge: 3600,
  })
  return NextResponse.json({ ok: true })

}
