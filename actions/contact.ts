"use server"

import nodemailer from "nodemailer"
import { headers } from "next/headers"
import { db } from "@/lib/db"

const COOLDOWN_MS = 60 * 1000 // 10 minutes

export async function sendMail(formData: FormData) {
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  if (!email || !message || message.length > 7000) return { success: false, message: "Invalid data" }

  const h = await headers()
  const ip =
    h.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"

  const now = new Date()
  const record = await db.ip.findUnique({ where: { ip } })

  if (record) {
    const diff = now.getTime() - record.lastUpdate.getTime()
    if (diff < COOLDOWN_MS) {
      const waitSec = Math.ceil((COOLDOWN_MS - diff) / 1000)
      return { success: false, message: `Please wait ${waitSec} seconds before sending another message.` }
    }
    await db.ip.update({ where: { ip }, data: { lastUpdate: now } })
  } else {
    await db.ip.create({ data: { ip, lastUpdate: now } })
  }

  // Send email
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: `"Contact Form" <${process.env.SMTP_USER}>`,
    to: "contact@gravadox.dev",
    replyTo: email,
    subject: "Contact Email",
    text: message,
  })

  return { success: true, message: "Email sent successfully!" }
}
