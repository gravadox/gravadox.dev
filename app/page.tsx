"use client"
import { useEffect, useState, useRef } from "react"
import Nav from "./nav"
import Loader from "@/components/loader/loader"
import BlackHole from "@/components/3d/blackHole"
import Hero from "./hero"

export default function Home() {
  const [domReady, setDomReady] = useState(false)
  const [modelReady, setModelReady] = useState(false)
  const blackHoleMounted = useRef(false)

  useEffect(() => {
    setDomReady(true)
  }, [])

  const loaded = domReady && modelReady

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {!loaded && (
        <div className="inset-0 z-50 flex items-center justify-center fixed top-0 left-0">
          <Loader />
        </div>
      )}

      <Nav />

      {!blackHoleMounted.current && (
        <BlackHole
          onLoad={() => {
            if (!blackHoleMounted.current) {
              blackHoleMounted.current = true
              setModelReady(true)
            }
          }}
        />
      )}

      {loaded && <Hero />}
    </div>
  )
}
