"use client"

import Link from "next/link"
import { useState } from "react"
import Nav from "../nav"
import { Button } from "@/components/ui/button"
import { sendMail } from "@/actions/contact"

export default function ContactPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setStatusMessage(null)

    const formData = new FormData(e.currentTarget)
    try {
      const res = await sendMail(formData)
      setStatusMessage(res.message)
      if (res.success) {
        setEmail("")
        setMessage("")
      }
    } catch (err) {
      setStatusMessage("Something went wrong. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Nav />
      <div className="mx-auto max-w-xl px-6 py-16 space-y-6">
        <h1 className="text-3xl font-bold">Contact</h1>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2"
          />
          <textarea
            required
            name="message"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full min-h-[120px] border px-4 py-2"
          />

          <Button
            type="submit"
            variant="transparent"
            className="bg-black px-6 text-white text-left flex justify-start p-0 hover:underline disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </form>

        {/* Status Message */}
        {statusMessage && (
          <p className="text-sm text-zinc-400">{statusMessage}</p>
        )}

        {/* Direct Email */}
        <div className="py-2">
          <p className="font-medium">Email</p>
          <a
            href="mailto:contact@gravadox.dev"
            className="text-zinc-600 underline"
          >
            contact@gravadox.dev
          </a>
        </div>

        {/* Social Links */}
        <div className="space-y-2">
          <p className="font-medium">Socials</p>
          <ul className="space-y-1 text-zinc-600">
            <li><Link className="hover:underline" href="https://github.com/gravadox">GitHub</Link></li>
            <li><Link className="hover:underline" href="https://instagram.com/gravadoxx">Instagram</Link></li>
            <li><Link className="hover:underline" href="https://x.com/gravadox">X</Link></li>
            <li><Link className="hover:underline" href="https://discord.gg/fvtjNmE3Uw">Discord</Link></li>
            <li><Link className="hover:underline" href="https://youtube.com/@gravadox">YouTube</Link></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
