"use server"

import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

const rawSecret = process.env.SESSION_SECRET
if (!rawSecret || rawSecret.length < 16) {
  throw new Error("SESSION_SECRET env var must be set and at least 16 characters long")
}
const secret = new TextEncoder().encode(rawSecret)

export async function createSession() {
  return await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(secret)
}


export async function isAdmin() {
  try {
    const token = (await cookies()).get("admin")?.value
    if (!token) return false
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Not Authorized")
}
