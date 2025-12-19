"use client"
import { useEffect, useState, useMemo } from "react"
import Nav from "./nav"
import Loader from "@/components/loader/loader"
import BlackHole from "@/components/3d/blackHole"
import Hero from "./hero"
import GitHubProfile from "@/components/github/profile"

export default function Home() {
  const [domReady, setDomReady] = useState(false)
  const [blackHoleReady, setBlackHoleReady] = useState(false)
  const [githubReady, setGithubReady] = useState(false)
  const [flex, setFlex] = useState(false)

  useEffect(() => {
    setDomReady(true)
    setFlex(innerWidth >= 700)
    const onResize = () => setFlex(innerWidth >= 700)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const loaded = blackHoleReady && githubReady

  // thanks to whoever tf invented useMemo
  const githubProfile = useMemo(() => (
    <GitHubProfile onLoad={() => setGithubReady(true)} />
  ), [])

  const blackHole = useMemo(() => (
  <BlackHole onLoad={() => setBlackHoleReady(true)} />
), [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      {!loaded && (
        <div className="inset-0 z-50 flex items-center justify-center fixed top-0 left-0">
          <Loader />
        </div>
      )}

      <Nav />

      <div className={`p-6 justify-between h-screen pt-40 ${flex ? "flex" : "block !pt-10"} `}>
        {loaded && domReady && <Hero />}
        {blackHole}
      </div>

      {githubProfile}
    </div>
  )
}
