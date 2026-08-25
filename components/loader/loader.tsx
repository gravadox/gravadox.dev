/*/ All loaders are fake don't blame me now /*/
"use client"

import { useEffect, useState } from "react"

export default function Loader() {
  const [progress, setProgress] = useState(31)

  useEffect(() => {
    const i = setInterval(() => {
      setProgress(p => {
        if (p >= 99) return 99
        return p + 1
      })
    }, 100)
    return () => clearInterval(i)
  }, [])

  const totalBars = 30
  const filledBars = Math.floor((progress / 100) * totalBars)
  const bar =
    "[" +
    "#".repeat(filledBars) +
    "*".repeat(totalBars - filledBars) +
    "] " +
    progress.toFixed(0) +
    "%"

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <pre style={{ fontFamily: "monospace", fontSize: "14px", whiteSpace: "pre" }}>
        {bar}
      </pre>
    </div>
  )
}
