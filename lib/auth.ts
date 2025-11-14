"use server"

import { cookies } from "next/headers"

export async function isAdmin() {
  return (await cookies()).get("admin")?.value === process.env.ADMIN_SECRET
}

export async function requireAdmin() {
  if (!isAdmin()) throw new Error("Not Authorized")
}
