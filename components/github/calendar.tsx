"use client"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Contribution {
  date: string
  count: number
  symbol: string
}
interface ApiResponse {
  total: number
  calendar: Contribution[]
}
interface ContributionAsciiProps {
  shrink?: boolean
}
export default function ContributionAscii({ shrink }: ContributionAsciiProps) {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [year, setYear] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [activeCell, setActiveCell] = useState<number | null>(null)
  
  const calenderRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const [optionsWidth, setOptionsWidth] = useState(0)
  const fetchData = (y?: number) => {
    const url = y ? `/api/github/contributions?year=${y}` : `/api/github/contributions`
    fetch(url)
      .then(r => r.json())
      .then(json => setData(json?.calendar ? json : null))
      .catch(() => setData(null))
  }

  useEffect(() => { fetchData() }, [])
  useEffect(() => { if (year !== null) fetchData(year) }, [year])
  useEffect(() => {
    if (!calenderRef.current || !data) return
    requestAnimationFrame(() => {
      calenderRef.current!.scrollLeft = calenderRef.current!.scrollWidth 
      calenderRef.current!.scrollLeft -= 30 
    
    })
    setOptionsWidth(calenderRef.current?.clientWidth)
  }, [data])

  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let y = currentYear; y >= 2001; y--) years.push(y)
if(data)
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-4 pt-4 text-sm relative">
        {data?.total && 
        <span>Total contributions: {data.total}</span>
        }
        <div className="relative inline-flex items-center">
          <button
            ref={btnRef}
            onClick={() => setOpen(v => !v)}
            className="px-2 py-1 text-white rounded flex items-center gap-2"
            aria-expanded={open}
            aria-haspopup="true"
          >
            {year === null ? "Current" : year}
            <span className="select-none">ˇ</span>
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ x: -15, scale: 0.98 }}
                animate={{ x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -8, scale: 0.98 }}
                transition={{ duration: 0.16 }}
                className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-20 overflow-x-auto"
                style={{ width: optionsWidth - 200 }}
              >
                <div className="inline-flex items-center gap-2 whitespace-nowrap bg-transparent">
                  <span className="px-2 py-1 text-sm text-zinc-400">|</span>
                  {years.map((y, idx) => (
                    <div key={y} className="inline-flex items-center">
                      <button
                        onClick={() => { setYear(y === currentYear ? null : y); setOpen(false) }}
                        className="px-2 py-1 text-sm rounded hover:bg-zinc-700 text-white"
                      >
                        {y}
                      </button>
                      {idx < years.length - 1 && (
                        <span className="px-1 text-sm text-zinc-400 select-none">&gt;</span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex">
        <div className="flex flex-col mr-2 gap-0.5">
          {Array(5).fill("[").map((s, i) => <p key={i}>{s}</p>)}
        </div>

<div
  ref={calenderRef}
  className={`overflow-x-auto ${shrink ? "w-full" : "max-w-[1000px]"}`}
>
  <div className="grid grid-flow-col grid-rows-5 gap-[2px] pb-6">
      {data.calendar.map((d, i) => (
        <div
          key={i}
          className="relative w-6 h-6 flex items-center justify-center rounded-[1px] group"
          onTouchStart={() => setActiveCell(i)}
          onTouchEnd={() => setTimeout(() => setActiveCell(null), 1500)}
        >
          <div
            className={`w-full h-full flex items-center justify-center rounded transition-colors duration-150 
              ${activeCell === i ? "bg-zinc-800" : "bg-transparent"} 
              group-hover:bg-zinc-800`}
          >
            {d.symbol}
          </div>
          <div
            className={`absolute top-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-zinc-800 text-white z-10 
              opacity-0 ${activeCell === i ? "opacity-100" : ""} 
              group-hover:opacity-100 pointer-events-none whitespace-nowrap`}
          >
            {d.date} | {d.count}
          </div>
        </div>
      ))}
  </div>
</div>

        <div className="flex flex-col gap-0.5">
          {Array(5).fill("]").map((s, i) => <p key={i}>{s}</p>)}
        </div>
      </div>
    </div>
  )
}
