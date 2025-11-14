"use client"
import { useRef, useState } from "react"
import { Play, Pause } from "lucide-react"

interface VideoPlayerProps {
  src: string
  poster?: string
  className?: string
}

export default function VideoPlayer({ src, poster, className = "" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setIsPlaying(true)
    } else {
      v.pause()
      setIsPlaying(false)
    }
  }

  return (
    <div className={`relative max-w-3xl ${className} bg-zinc-950 my-4`}>
      <video
        preload=""
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full"
      />
      <div className="absolute  top-1/2 left-1/2 text-white flex flex-col items-center justify-center">
            <button onClick={togglePlay}>{isPlaying ? <Pause /> : <Play />}</button>
      </div>
    </div>
  )
}