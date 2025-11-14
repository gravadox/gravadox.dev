"use client"

import React, { useRef, useEffect } from "react"

interface CanvasRunnerProps {
  code: string
  mode?: "2d" | "3d"
  width?: number
  height?: number | string
}

export default function CanvasRunner({
  code,
  mode = "2d",
  width = 768,
  height = 400,
}: CanvasRunnerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx =
      mode === "3d"
        ? (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        : canvas.getContext("2d")

    if (!ctx) return

    try {
      const fn = new Function("ctx", "canvas", code)
      fn(ctx, canvas)
    } catch (err) {
      console.error("Canvas code error:", err)
    }
  }, [code, mode])

  return (
    <div className="w-full max-w-3xl mx-auto my-4">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-auto border"
        style={{ aspectRatio: `${width}/${height}` }}
      />
    </div>
  )
}