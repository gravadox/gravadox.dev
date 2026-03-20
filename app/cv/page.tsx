"use client"

import { useEffect, useState } from "react"
import { getCv } from "@/actions/cv"
import { RequestFullCv } from "@/components/cv/request"
import ExperienceTimeline from "@/components/cv/experience"
import { Separator } from "@/components/ui/separator"
import { Home, Mail, Phone } from "@/icons"
import { notFound, useRouter } from "next/navigation"
import Nav from "../nav"
import { useAppTranslation } from "@/components/lang/useAppTranslation"
import { JsonValue } from "@prisma/client/runtime/library"

interface CvXP {
  id: string
  work: string
  at: string | null
  url: string | null
  date: string | null
  cvId: string
}

interface CvSkill {
  id: string
  name: string
  level?: string | null
  cvId: string
}

interface CvExtraField {
  id: string
  key: string
  url: string
  value: string
}

interface CvExtraBlock {
  id: string
  name?: string
  fields: CvExtraField[]
}

interface CvData {
  id: string
  name: string
  description?: string | null
  photo?: string | null
  location?: string | null
  phone?: string | null
  email?: string | null
  xp?: CvXP[]
  lang: string
  skills: CvSkill[]
  extra?: JsonValue | null
}


// Type guards
function isObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === "object" && obj !== null
}

function isCvExtraBlock(obj: unknown): obj is CvExtraBlock {
  if (!isObject(obj)) return false
  if (!("id" in obj) || !("fields" in obj)) return false
  if (!Array.isArray(obj.fields)) return false
  return true
}

function isCvExtraField(obj: unknown): obj is CvExtraField {
  if (!isObject(obj)) return false
  return "id" in obj && "key" in obj && "value" in obj
}

export default function Cv() {
  const { t } = useAppTranslation()
  const lang = t("common.lang")

  const [cv, setCv] = useState<CvData | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true
    getCv(lang as "EN"|"DE").then((data) => {
      if (active) {
        setCv(data)
        setLoaded(true)
      }
    })
    return () => {
      active = false
    }
  }, [lang])

  if (loaded && !cv) return useRouter().push('/404')
  if (!cv) return null

  const nonEmptyXP: CvXP[] = (cv.xp || []).map((xp) => ({
    id: xp.id,
    work: xp.work,
    at: xp.at ?? "",
    url: xp.url ?? "",
    date: xp.date ?? "",
    cvId: xp.cvId,
  }))

  const nonEmptySkills: CvSkill[] = (cv.skills || []).filter((s) => s.name)

  let nonEmptyExtra: CvExtraBlock[] = []

  if (Array.isArray(cv.extra)) {
    for (const block of cv.extra) {
      if (isCvExtraBlock(block)) {
        const fields: CvExtraField[] = []
        for (const f of block.fields) {
          if (isCvExtraField(f)) {
            fields.push({
              id: String(f.id),
              key: String(f.key),
              url: String(f.url),
              value: String(f.value),
            })
          }
        }
        if (fields.length > 0) {
          nonEmptyExtra.push({
            id: String(block.id),
            name: typeof block.name === "string" ? block.name : undefined,
            fields,
          })
        }
      }
    }
  }

  return (
    <div className="w-full flex flex-col items-center min-h-screen p-4 relative">
      <Nav />
      <RequestFullCv />
      <div className="flex flex-col gap-2 mt-4 sm:mt-20 max-w-5xl">
        <div className="flex gap-2 items-center">
          {cv.photo && (
            <img
              src={cv.photo}
              alt=""
              className="w-16 h-16 object-cover rounded-full"
            />
          )}
          {cv.name && (
            <strong className="text-3xl font-bold text-zinc-300">
              {cv.name.toUpperCase()}
            </strong>
          )}
        </div>

        <div className="flex gap-4 items-center text-zinc-300 flex-wrap">
          {cv.location && (
            <div className="flex gap-1 font-bold text-lg items-center">
              <Home size={16} color="#d4d4d8" />
              {cv.location}
            </div>
          )}
          {cv.phone && (
            <a
              href={`tel:${cv.phone}`}
              className="flex gap-1 font-bold text-lg items-center hover:underline"
            >
              <Phone size={16} color="#d4d4d8" />
              {cv.phone}
            </a>
          )}
          {cv.email && (
            <a
              href={`mailto:${cv.email}`}
              className="flex gap-1 font-bold text-lg items-center hover:underline"
            >
              <Mail size={16} color="#d4d4d8" />
              {cv.email}
            </a>
          )}
        </div>

        <Separator />

        {cv.description && (
          <div className="whitespace-pre-line">{cv.description}</div>
        )}

        <Separator />

        {nonEmptyXP.length > 0 && (
          <div className="my-3">
            <h3 className="text-xl font-bold text-zinc-300 mt-2">
              {t("cv.xp")}
            </h3>
            <ExperienceTimeline data={nonEmptyXP} />
          </div>
        )}

        <Separator />

        {nonEmptySkills.length > 0 && (
          <div className="my-3">
            <h3 className="text-xl font-bold text-zinc-300">{t("cv.skills")}</h3>
            {nonEmptySkills.map((s) => (
              <div
                key={s.id}
                className="w-full flex gap-2 justify-between items-center"
              >
                <div className="w-1/2 font-bold text-xl">{s.name}</div>
                <div className="w-1/2">{t(`cv.levels.${s.level?.toLocaleLowerCase()}`) ?? ""}</div>
              </div>
            ))}
          </div>
        )}

        <Separator />

        {nonEmptyExtra.length > 0 && (
          <div className="my-3">
            {nonEmptyExtra.map((b) => (
              <div key={b.id}>
                {b.name && (
                  <h3 className="text-xl font-bold text-zinc-300 mt-4">
                    {b.name}
                  </h3>
                )}
                {b.fields.map((f) => (
                  <div
                    key={f.id}
                    className="flex w-full gap-2 justify-between items-center my-2"
                  >
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={f.url || undefined}
                      className={`w-1/2 text-xl ${
                        f.url ? "hover:underline" : ""
                      }`}
                    >
                      {f.key}
                    </a>
                    <div className="w-1/2">{f.value}</div>
                  </div>
                ))}
                <Separator className="mt-8" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
