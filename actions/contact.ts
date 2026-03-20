"use server"
import { ipAddress } from "@vercel/functions"
import nodemailer from "nodemailer"
import { headers } from "next/headers"
import { db } from "@/lib/db"

const COOLDOWN_MS = 60 * 10000 // 10 MINUUTTEESSS

export async function sendMail(formData: FormData) {
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  if (!email || !message || message.length > 7000) return { success: false, message: "Invalid data" }

  const h = await headers()
  const ip = ipAddress({ headers: h }) ?? "unknown"

  if ((ip === "unknown") && process.env.NODE_ENV !== "development") {
    return { success: false, message: "Could not verify request origin." }
  }
  
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

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return { success: false, message: "Service temporarily unavailable." }
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
