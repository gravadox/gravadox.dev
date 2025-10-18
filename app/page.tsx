"use client"
import { useEffect, useState, useRef } from "react"
import Nav from "./nav"
import Loader from "@/components/loader/loader"
import BlackHole from "@/components/3d/blackHole"
import Hero from "./hero"

export default function Home() {
  const [domReady, setDomReady] = useState(false)
  const [modelReady, setModelReady] = useState(false)
  const blackHoleRef = useRef(false)

  useEffect(() => {
    setDomReady(true)
  }, [])

  const loaded = domReady && modelReady

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Overlay loader until DOM + 3D ready */}
      {!loaded && (
        <div className="inset-0 z-50 flex items-center justify-center fixed top-0 left-0">
          <Loader />
        </div>
      )}

      <Nav />
      {/* Mount BlackHole once */}
      {!blackHoleRef.current && (
        <BlackHole
          onLoad={() => {
            setModelReady(true)
            blackHoleRef.current = true
          }}
        />
      )}

      <Hero />
    </div>
  )
}
