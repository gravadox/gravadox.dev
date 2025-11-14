"use client"

import { useState } from "react"

export default function AdminLogin() {
  const [value, setValue] = useState("")

  async function submit() {
    const res = await fetch("/admin/login/api", {
      method: "POST",
      body: value
    })
    if (res.ok) location.href = "/admin"
    else alert("Wrong key")
  }

  return (
    <div className="p-8 max-w-sm mx-auto">
      <input
        className="border p-2 w-full"
        placeholder="Enter admin key"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button
        className="border mt-2 p-2 w-full"
        onClick={submit}
      >
        Login
      </button>
    </div>
  )
}
