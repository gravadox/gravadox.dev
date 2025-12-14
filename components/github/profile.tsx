"use client"
import React, { useEffect, useState } from "react"
import ContributionAscii from "./calendar"
import Image from "next/image"
import { useAppTranslation } from "../lang/useAppTranslation"

interface Repo {
  name: string
  url: string
  updated: string
  language: string | null
  description: string | null
  stars: number
  commits: number
}

interface GitHubUser {
  avatar: string
  username: string
  name: string
  bio: string
  followers: number
  following: number
  totalContributions: number
  totalStars: number
  repos: Repo[]
}

export default function GitHubProfile({ onLoad }: { onLoad?: () => void }) {
  const {t} = useAppTranslation()
  const [data, setData] = useState<GitHubUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [phone, setPhone] = useState(false)
  const [shrink, setShrink] = useState(false)
  const [font, setFont] = useState(false)

  useEffect(() => {
    // console.log("Fetching GitHub data")
    fetch("/api/github/profile")
      .then(res => res.json())
      .then(setData)
      .finally(() => {
        setLoading(false)
        onLoad?.()
      })
  }, [onLoad])

  useEffect(() => {
    const onResize = () => {
      setPhone(innerWidth < 600)
      setShrink(innerWidth < 980)
      setFont(innerWidth < 450)
    }
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])
  if (loading) return null 
  return (
    <div className={`px-4 ${shrink ? "block" : "flex"} w-full justify-center min-h-screen`}>
      <div className={`shrink-0 ${shrink ? "flex" : ""} ${font ? "text-sm" : ""}`}>
        {data?.avatar && data.username &&
        <Image
          src={data.avatar}
          width={460}
          height={460}
          alt={data.username}
          className={phone ? "w-40 h-40" : shrink ? "w-64 h-64" : "w-80 h-80"}
        />
        }
        <div className={`flex justify-center flex-col ${shrink ? "pl-4" : ""}`}>
          {data?.username &&
          <a
            className={`${font ? "text-lg" : "text-xl"} font-bold mt-2`}
            target="_blank"
            href={`https://github.com/${data.username}`}
          >
            @{data.username.charAt(0).toUpperCase() + data.username.slice(1)}
          </a>
          }
          {data?.bio &&
          <p className="text-zinc-300">{data.bio}</p>
          }
          {data?.followers &&
          <p className="text-sm text-zinc-500">
            {t("github.followers")}: {data.followers} | {t("github.following")}: {data.following} | {t("github.stars")}: {data.totalStars}
          </p>
          }
        </div>
      </div>

<div
  className={`transition-all duration-300 ${
    phone
      ? "w-full pl-0"
      : shrink
      ? "w-[100%]"
      : "w-[65%] max-w-[1000px] pl-4"
  }`}
>
          {data?.repos && 
          <>
        <h3 className="font-semibold">{t("github.recent")}:</h3>
        <ul className={`mt-2 space-2 gap-2 grid w-full pb-4 ${phone ? "grid-cols-1" : "grid-cols-2"}`}>
          {data.repos.map(repo => (
            <li key={repo.name} className="p-2 border rounded hover:bg-zinc-900 w-full">
              <a href={repo.url} target="_blank" className="font-medium">
                {repo.name}
              </a>
              {repo.description && <p className="text-sm text-zinc-400">{repo.description}</p>}
              <span className="text-xs text-zinc-500">
                Updated: {new Date(repo.updated).toLocaleDateString()} | Language:{" "}
                {repo.language ?? "N/A"} | ★ {repo.stars} | Commits: {repo.commits}
              </span>
            </li>
          ))}
        </ul>
        <hr className="my-2 border-zinc-800" />
          </>
          }
        <ContributionAscii shrink={shrink} />
      </div>
    </div>
  )
}
