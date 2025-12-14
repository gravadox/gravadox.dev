import { getCv } from "@/actions/cv"
import { DownloadPdfButton } from "@/components/cv/download"
import ExperienceTimeline from "@/components/cv/experience"
import { Separator } from "@/components/ui/separator"
import { Home, Mail, Phone } from "@/icons"
import { notFound } from "next/navigation"
import Nav from "../nav"

interface CvXP {
  id: string
  work: string
  at: string
  url: string
  date: string
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

export default async function Cv() {
  const cv = await getCv()
  if (!cv) return notFound()

  // XP normalization
  const nonEmptyXP: CvXP[] = (cv.xp || []).map((xp) => ({
    id: xp.id,
    work: xp.work,
    at: xp.at ?? "",
    url: xp.url ?? "",
    date: xp.date ?? "",
    cvId: xp.cvId,
  }))

  const nonEmptySkills: CvSkill[] = (cv.skills || []).filter((s) => s.name)

  // Extra normalization
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
    <DownloadPdfButton />
    <div className="flex flex-col gap-2 mt-4 sm:mt-20 max-w-5xl">
      <div className="flex gap-2 items-center">
        {cv.photo && <img src={cv.photo} alt="" className="w-16 h-16 object-cover rounded-full" />}
        {cv.name && <strong className="text-3xl font-bold text-zinc-300">{cv.name.toUpperCase()}</strong>}
      </div>
      <div className="flex gap-4 items-center text-zinc-300 flex-wrap">
        {cv.location && (
          <div className="flex gap-1 font-bold text-lg items-center">
            <Home size={16} color="#d4d4d8" />
            {cv.location}
          </div>
        )}
        {cv.phone && (
          <a href={`tel:${cv.phone}`} className="flex gap-1 font-bold text-lg items-center hover:underline">
            <Phone size={16} color="#d4d4d8" />
            {cv.phone}
          </a>
        )}
        {cv.email && (
          <a href={`mailto:${cv.email}`} className="flex gap-1 font-bold text-lg items-center hover:underline">
            <Mail size={16} color="#d4d4d8" />
            {cv.email}
          </a>
        )}
      </div>
      <Separator />
      {cv.description && <div className="whitespace-pre-line">{cv.description}</div>}
      <Separator />
      {nonEmptyXP.length > 0 && (
        <div className="my-3">
          <h3 className="text-xl font-bold text-zinc-300 mt-2">WORK EXPERIENCE</h3>
          <ExperienceTimeline data={nonEmptyXP} />
        </div>
      )}
      <Separator />
      {nonEmptySkills.length > 0 && (
        <div className="my-3">
          <h3 className="text-xl font-bold text-zinc-300">SKILLS</h3>
          {nonEmptySkills.map((s) => (
            <div key={s.id} className="w-full flex gap-2 justify-between items-center">
              <div className="w-1/2 font-bold text-xl">{s.name}</div>
              <div className="w-1/2">{s.level ?? ""}</div>
            </div>
          ))}
        </div>
      )}
      <Separator />
      {nonEmptyExtra.length > 0 && (
        <div className="my-3">
          {nonEmptyExtra.map((b) => (
            <div key={b.id}>
              {b.name && <h3 className="text-xl font-bold text-zinc-300 mt-4">{b.name}</h3>}
              {b.fields.map((f) => (
                <div key={f.id} className="flex w-full gap-2 justify-between items-center my-2">
                  <a target="_blank" href={f.url || undefined} className={`w-1/2 text-xl ${f.url? "hover:underline" :""}`}>{f.key}</a>
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
