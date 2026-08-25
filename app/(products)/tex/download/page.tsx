"use client"

import { useState, useEffect, useMemo } from "react"
import { SiGithub } from "react-icons/si"
import { Download as DownloadIcon } from "lucide-react"

type DownloadItem = {
  id: string
  name: string
  os: "mac" | "windows" | "linux" | "firefox" | "chrome"
  version: string
  link: string
  arch?: string
}

const DOWNLOADS: DownloadItem[] = [
    { id: "windows", name: "Windows (installer)", os: "windows", version: "1.7.0", link: "https://github.com/gravadox/TEx/releases/download/v1.7.0/TEx_1.7_window_installer.exe" },
    { id: "windows-exe", name: "Windows (executable)", os: "windows", version: "1.7.0", link: "https://github.com/gravadox/TEx/releases/download/v1.7.0/TEx.exe" },
  { id: "linux-appimage", name: "Linux (AppImage)", os: "linux", version: "1.7.0", link: "https://github.com/gravadox/TEx/releases/download/v1.7.0/TEx-x86_64.AppImage" },
]

function detectOS(): DownloadItem["os"] | null {
  if (typeof window === "undefined") return null
  const p = navigator.platform.toLowerCase()
  const ua = navigator.userAgent.toLowerCase()
  if (p.includes("mac")) return "mac"
  if (p.includes("win")) return "windows"
  if (p.includes("linux")) return "linux"
  if (ua.includes("firefox")) return "firefox"
  if (ua.includes("chrome") || ua.includes("chromium")) return "chrome"
  return null
}

function detectArch(): string | null {
  if (typeof window === "undefined") return null
  return /arm|apple silicon/i.test(navigator.userAgent) ? "arm64" : null
}

export default function DownloadsPage() {
  const [mounted, setMounted] = useState(false)
  const [detected, setDetected] = useState<DownloadItem["os"] | null>(null)
  const [arch, setArch] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    setDetected(detectOS())
    setArch(detectArch())
  }, [])

  const sorted = useMemo(() => {
    if (!mounted) return DOWNLOADS
    const score = (d: DownloadItem) => {
      if (d.os !== detected) return 0
      if (arch && d.arch === arch) return 2
      return 1
    }
    return [...DOWNLOADS].sort((a, b) => score(b) - score(a))
  }, [mounted, detected, arch])

  const primary = mounted ? sorted[0] : undefined
  const rest = mounted ? sorted.slice(1) : sorted

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col px-4 py-24">
      <h3 className="text-3xl font-medium mb-4">Download TEx</h3>
      {primary ? (
        <>
        <a
          href={primary.link}
          download={primary.link.startsWith("http") ? undefined : true}
          target={primary.link.startsWith("http") ? "_blank" : undefined}
          rel={primary.link.startsWith("http") ? "noopener noreferrer" : undefined}
          className="flex items-center gap-3 h-14  transition-colors mt-5"
        >
            <span className="hover:underline w-full">
          Download for {primary.name}
            </span>
          <DownloadIcon size={16} />
        </a>
        </>
      ) : null}

      {primary ? (
        <span className="text-xs text-zinc-600 mb-5">
          v{primary.version} 
        </span>
      ) : null}

        <hr className="w-full"></hr>

      <div className="flex flex-col">
        {rest.map(function (d) {
          const isExternal = d.link.startsWith("http")
          return (
            <a
              key={d.id}
              href={d.link}
              download={isExternal ? undefined : true}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="flex items-center justify-between h-16 transition-colors"
            >
              <div className="flex flex-col w-full">
                <span className="text-sm text-zinc-500 hover:text-white hover:underline w-full">{d.name}</span>
                <span className="text-xs text-zinc-600">v{d.version} </span>
              </div>
              <DownloadIcon size={16} className="text-zinc-600" />
            </a>
          )
        })}
      </div>

      <a
        href="https://github.com/gravadox/tex"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 mt-12 text-zinc-500 hover:text-zinc-300 text-sm"
      >
        <SiGithub size={16} />
        View source on GitHub
      </a>
    </div>
  )
}