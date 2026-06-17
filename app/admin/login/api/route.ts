import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createSession } from "@/lib/auth"
import { timingSafeEqual, createHash } from "crypto"
import { ipAddress } from "@vercel/functions"
import { db } from "@/lib/db"

const LOCKOUT_MS = 2 * 60 * 1000 // 2-minute cooldown after a failed attempt

export async function POST(req: Request) {

  // origin block
  const origin = req.headers.get("origin")
  const host = req.headers.get("host")
  if (!origin || new URL(origin).host !== host) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  const ip = ipAddress(req) ?? "unknown"
  const failKey = `login:fail:${ip}`

  // Rate limit: check if this IP has a recent failed attempt
  if (ip !== "unknown") {
    const record = await db.ip.findUnique({ where: { ip: failKey } }).catch(() => null)
    if (record) {
      const elapsed = Date.now() - record.lastUpdate.getTime()
      if (elapsed < LOCKOUT_MS) {
        const waitSec = Math.ceil((LOCKOUT_MS - elapsed) / 1000)
        return new NextResponse(`Too many failed attempts. Try again in ${waitSec}s.`, { status: 429 })
      }
    }
  }

  // login logic
  const key = (await req.text()).trim()
  const secret = process.env.ADMIN_SECRET?.trim()

  if (!key || !secret) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // timingSafeEqual requires same-length buffers, hash both to normalize
  const keyBuf = createHash("sha256").update(key).digest()
  const secretBuf = createHash("sha256").update(secret).digest()

  if (!timingSafeEqual(keyBuf, secretBuf)) {
    // Record failed attempt to start cooldown
    if (ip !== "unknown") {
      await db.ip.upsert({
        where: { ip: failKey },
        update: { lastUpdate: new Date() },
        create: { ip: failKey, lastUpdate: new Date() },
      }).catch(() => {})
    }
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // Success — clear any failed attempt record
  if (ip !== "unknown") {
    await db.ip.deleteMany({ where: { ip: failKey } }).catch(() => {})
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
