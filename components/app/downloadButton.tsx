"use client"

import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import {SiGithub} from "react-icons/si"

export type Download = {
  name?: string
  link?: string
}

type Props = {
  downloads: Download[]
  github?: string | null
}

const BROWSER_KEYWORDS = ["firefox", "chrome", "chromium"]

function isBrowserDownload(d: Download): boolean {
  return BROWSER_KEYWORDS.some(kw => d.name?.toLowerCase().includes(kw))
}

function detectOS(): string | null {
  if (typeof window === "undefined") return null
  const p = navigator.platform.toLowerCase()
  if (p.includes("win")) return "windows"
  if (p.includes("mac")) return "mac"
  if (p.includes("linux")) return "linux"
  return null
}

function detectBrowser(): string | null {
  if (typeof window === "undefined") return null
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes("firefox")) return "firefox"
  if (ua.includes("chrome") || ua.includes("chromium")) return "chrome"
  return null
}

export default function AppDownloadSection({ downloads, github }: Props) {
  const available = downloads.filter(d => d.link)
  const osDownloads = available.filter(d => !isBrowserDownload(d))
  const browserDownloads = available.filter(d => isBrowserDownload(d))

  const [selectedOS, setSelectedOS] = useState<Download | null>(null)
  const [selectedBrowser, setSelectedBrowser] = useState<Download | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const os = detectOS()
    const browser = detectBrowser()
    setSelectedOS(osDownloads.find(d => d.name?.toLowerCase().includes(os || "")) || osDownloads[0] || null)
    setSelectedBrowser(browserDownloads.find(d => d.name?.toLowerCase().includes(browser || "")) || browserDownloads[0] || null)
  }, [downloads])

  if (!mounted || (available.length === 0 && !github)) return null

  return (
    <div className="flex flex-col gap-2 w-full mb-3">

      {/* OS downloads */}
      {selectedOS?.link && (
        <div className="flex items-stretch w-full">
          <a
            href={selectedOS.link}
            className="px-4 h-11 bg-zinc-950 border text-zinc-500 flex items-center justify-center w-full"
            download
          >
            Download {selectedOS.name || ""}
          </a>
          {osDownloads.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-11 h-11 bg-zinc-950 text-zinc-500 flex items-center justify-center border rounded-none cursor-pointer">
                  <ChevronDown size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end" className="min-w-[150px] bg-zinc-950 border text-zinc-500 rounded-none">
                {osDownloads.map((d, i) => (
                  <DropdownMenuItem
                    key={i}
                    onClick={() => setSelectedOS(d)}
                    className="hover:!bg-zinc-zinc-900 !text-zinc-500 rounded-none"
                  >
                    {d.name || `Download ${i + 1}`}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      {/* Browser extension downloads */}
      {selectedBrowser?.link && (
        <div className="flex items-stretch w-full">
          <a
            href={selectedBrowser.link}
            className="px-4 h-11 bg-zinc-950 border text-zinc-500 flex items-center justify-center w-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            Install {selectedBrowser.name || ""}
          </a>
          {browserDownloads.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-11 h-11 bg-zinc-950 text-zinc-500 flex items-center justify-center border rounded-none cursor-pointer">
                  <ChevronDown size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end" className="min-w-[150px] bg-zinc-950 border text-zinc-500 rounded-none">
                {browserDownloads.map((d, i) => (
                  <DropdownMenuItem
                    key={i}
                    onClick={() => setSelectedBrowser(d)}
                    className="hover:!bg-zinc-zinc-900 !text-zinc-500 rounded-none"
                  >
                    {d.name || `Install ${i + 1}`}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

    </div>
  )
}
