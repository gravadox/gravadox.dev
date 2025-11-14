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

function detectOS(): string | null {
  if (typeof window === "undefined") return null
  const p = navigator.platform.toLowerCase()
  if (p.includes("win")) return "windows"
  if (p.includes("mac")) return "mac"
  if (p.includes("linux")) return "linux"
  return null
}

export default function AppDownloadSection({ downloads, github }: Props) {
  const available = downloads.filter(d => d.link)
  const [selected, setSelected] = useState<Download | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const os = detectOS()
    const preferred = available.find(d => d.name?.toLowerCase().includes(os || "")) || available[0] || null
    setSelected(preferred)
  }, [downloads])

  if (!mounted || (available.length === 0 && !github)) return null

  return (
    <div className="flex items-stretch w-full mb-3">

      {selected?.link && (
        <div className="flex items-stretch w-full">
          <a
            href={selected.link}
            className="px-4 h-11 bg-zinc-950 border text-zinc-500 flex items-center justify-center w-full"
            download
          >
            Download {selected.name || ""}
          </a>

          {available.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-11 h-11 bg-zinc-950 text-zinc-500 flex items-center justify-center border rounded-none cursor-pointer">
                  <ChevronDown size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end" className="min-w-[150px] bg-zinc-950 border text-zinc-500 rounded-none">
                {available.map((d, i) => (
                  <DropdownMenuItem
                    key={i}
                    onClick={() => setSelected(d)}
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

    </div>
  )
}
