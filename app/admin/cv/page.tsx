"use client"

import { useEffect, useState } from "react"
import { saveCV, getCv } from "@/actions/cv"
import ExperienceTimeline from "@/components/cv/experience";
import { Prisma } from "@prisma/client";
import { Home, Mail, Phone } from "@/icons";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export type XPInput = { id: string; work: string; at: string; url: string; date: string }
export type SkillLevels = "BEGINNER" | "INTERMEDIATE" | "PROFICIENT" | "ADVANCED" | "EXPERT"
export type SkillInput = { id: string; name: string; level: SkillLevels | "" }

export type ExtraField = { id: string; key: string; value: string, url: string }
export type ExtraBlock = { id: string; name: string; fields: ExtraField[] }

export type CVInput = {
  name: string
  description: string
  photo: string
  location: string
  phone: string
  email: string
  xp: XPInput[]
  skills: SkillInput[]
  extra: ExtraBlock[]
}

type RawXP = {
  id: string
  cvId?: string
  work: string
  at: string | null
  url: string | null
  date: string | null
}

type RawSkill = {
  id: string
  cvId?: string
  name: string
  level: SkillLevels | null
}


type RawCV = {
  name: string | null
  description: string | null
  photo: string | null
  location: string | null
  phone: string | null
  email: string | null
  xp: RawXP[]
  skills: RawSkill[]
  extra: Prisma.JsonValue
}


function parseExtra(extra: Prisma.JsonValue | null): ExtraBlock[] {
  if (!extra || !Array.isArray(extra)) return []

  return extra.flatMap((b): ExtraBlock[] => {
    if (typeof b !== "object" || b === null || Array.isArray(b)) return []

    const block = b as { id: string; name?: string | null; fields?: Prisma.JsonValue }
    if (!Array.isArray(block.fields)) return []

    const fields: ExtraField[] = block.fields.flatMap((f): ExtraField[] => {
      if (typeof f !== "object" || f === null || Array.isArray(f)) return []
      const field = f as { id: string; key?: string | null; value?: string | null, url: string | null }
      return [{ id: field.id, key: field.key ?? "", value: field.value ?? "", url: field.url ?? "" }]
    })

    return [{ id: block.id, name: block.name ?? "", fields }]
  })
}


export default function CVEditor() {


  const [cv, setCv] = useState<CVInput>({
    name: "",
    description: "",
    photo: "",
    location: "",
    phone: "",
    email: "",
    xp: [{ id: crypto.randomUUID(), work: "", at: "", url: "", date: "" }],
    skills: [{ id: crypto.randomUUID(), name: "", level: "" }],
    extra: [{ id: crypto.randomUUID(), name: "", fields: [{ id: crypto.randomUUID(), key: "", value: "", url:"" }] }],
  })
    const upd = <K extends keyof CVInput>(key: K, val: CVInput[K]) =>
    setCv((c) => ({ ...c, [key]: val }))

  const updXP = <K extends keyof XPInput>(id: string, key: K, val: XPInput[K]) =>
    setCv((c) => ({
      ...c,
      xp: c.xp.map((x) => (x.id === id ? { ...x, [key]: val } : x)),
    }))

  const updSkill = <K extends keyof SkillInput>(id: string, key: K, val: SkillInput[K]) =>
    setCv((c) => ({
      ...c,
      skills: c.skills.map((s) => (s.id === id ? { ...s, [key]: val } : s)),
    }))

  const updExtraName = (id: string, val: string) =>
    setCv((c) => ({
      ...c,
      extra: c.extra.map((b) => (b.id === id ? { ...b, name: val } : b)),
    }))

  const updExtraField = (blockId: string, fieldId: string, key: "key" | "value" | "url", val: string) =>
    setCv((c) => ({
      ...c,
      extra: c.extra.map((b) =>
        b.id === blockId
          ? {
              ...b,
              fields: b.fields.map((f) =>
                f.id === fieldId ? { ...f, [key]: val } : f
              ),
            }
          : b
      ),
    }))

  const addXP = () =>
    setCv((c) => ({
      ...c,
      xp: [...c.xp, { id: crypto.randomUUID(), work: "", at: "", url: "", date: "" }],
    }))

  const addSkill = () =>
    setCv((c) => ({
      ...c,
      skills: [...c.skills, { id: crypto.randomUUID(), name: "", level: "" }],
    }))

  const addExtraBlock = () =>
    setCv((c) => ({
      ...c,
      extra: [
        ...c.extra,
        {
          id: crypto.randomUUID(),
          name: "",
          fields: [{ id: crypto.randomUUID(), key: "", value: "", url: "" }],
        },
      ],
    }))

  const addExtraField = (blockId: string) =>
    setCv((c) => ({
      ...c,
      extra: c.extra.map((b) =>
        b.id === blockId
          ? {
              ...b,
              fields: [...b.fields, { id: crypto.randomUUID(), key: "", value: "", url:"" }],
            }
          : b
      ),
    }))

  const delXP = (id: string) =>
    setCv((c) => ({ ...c, xp: c.xp.filter((x) => x.id !== id) }))

  const delSkill = (id: string) =>
    setCv((c) => ({ ...c, skills: c.skills.filter((s) => s.id !== id) }))

  const delExtraBlock = (id: string) =>
    setCv((c) => ({ ...c, extra: c.extra.filter((b) => b.id !== id) }))

  const delExtraField = (blockId: string, fieldId: string) =>
    setCv((c) => ({
      ...c,
      extra: c.extra.map((b) =>
        b.id === blockId
          ? { ...b, fields: b.fields.filter((f) => f.id !== fieldId) }
          : b
      ),
    }))

  const nonEmptyXP = cv.xp.filter((x) => x.work || x.at || x.date)
  const nonEmptySkills = cv.skills.filter((s) => s.name)
  const nonEmptyExtra = cv.extra
    .map((b) => ({
      ...b,
      fields: b.fields.filter((f) => f.key || f.value || f.url),
    }))
    .filter((b) => b.name || b.fields.length > 0)


    const submitSaveCV = async (formData: FormData)=>{

        const raw = formData.get("payload")
        if (typeof raw !== "string"){return}
      
        try{
          await saveCV(raw)
            toast("CV Saved", {
            description: "CV has been successfully saved.",
            })
        }
        catch(err){
          toast("Failed to Save", {
          description: `Something went wrong: ${err}`,
          })
        }
    }

  useEffect(() => {
    getCv().then((data: RawCV | null) => {
      if (!data) return

      setCv({
        name: data.name ?? "",
        description: data.description ?? "",
        photo: data.photo ?? "",
        location: data.location ?? "",
        phone: data.phone ?? "",
        email: data.email ?? "",
        xp: (data.xp ?? []).map(x => ({
          id: x.id,
          work: x.work,
          at: x.at ?? "",
          url: x.url ?? "",
          date: x.date ?? "",
        })),
        skills: (data.skills ?? []).map(s => ({
          id: s.id,
          name: s.name,
          level: s.level ?? "",
        })),
        extra: parseExtra(data.extra ?? null),
      })
    })
  }, [])

  return (
    <div className="flex gap-10 p-10 w-full">
      <form action={submitSaveCV} className="flex flex-col gap-8 p-6 border rounded-lg w-xl">

        {/* GENERAL */}
        <div className="border rounded-lg p-4 space-y-3 flex flex-col">
          <h3 className="font-medium">General</h3>
          <input className="border p-2 rounded" placeholder="Name" value={cv.name} onChange={(e) => upd("name", e.target.value)} />
          <textarea className="border p-2 rounded" placeholder="description" value={cv.description} onChange={(e) => upd("description", e.target.value)} />
          <input className="border p-2 rounded" placeholder="Photo URL" value={cv.photo} onChange={(e) => upd("photo", e.target.value)} />
          <input className="border p-2 rounded" placeholder="Location" value={cv.location} onChange={(e) => upd("location", e.target.value)} />
          <input className="border p-2 rounded" placeholder="Phone" value={cv.phone} onChange={(e) => upd("phone", e.target.value)} />
          <input className="border p-2 rounded" placeholder="Email" value={cv.email} onChange={(e) => upd("email", e.target.value)} />
        </div>

        {/* XP */}
        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="font-medium">Experience</h3>
          {cv.xp.map((x) => (
            <div key={x.id} className="space-y-2">
              <div className="flex justify-between">
                <span />
                <button type="button" onClick={() => delXP(x.id)} className="text-red-600 text-sm">Delete</button>
              </div>
              <input className="border p-2 rounded w-full" placeholder="Work" value={x.work} onChange={(e) => updXP(x.id, "work", e.target.value)} />
              <input className="border p-2 rounded w-full" placeholder="At" value={x.at} onChange={(e) => updXP(x.id, "at", e.target.value)} />
              <input className="border p-2 rounded w-full" placeholder="url" value={x.url} onChange={(e) => updXP(x.id, "url", e.target.value)} />
              <input className="border p-2 rounded w-full" placeholder="Date" value={x.date} onChange={(e) => updXP(x.id, "date", e.target.value)} />
            </div>
          ))}
          <button type="button" onClick={addXP} className="border px-3 py-1 rounded">Add XP</button>
        </div>

        {/* SKILLS */}
        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="font-medium">Skills</h3>
          {cv.skills.map((s) => (
            <div key={s.id} className="space-y-2">
              <div className="flex justify-between">
                <span />
                <button type="button" onClick={() => delSkill(s.id)} className="text-red-600 text-sm">Delete</button>
              </div>
              <input className="border p-2 rounded w-full" placeholder="Skill" value={s.name} onChange={(e) => updSkill(s.id, "name", e.target.value)} />
              <select className="border p-2 rounded w-full" value={s.level} onChange={(e) => updSkill(s.id, "level", e.target.value as SkillLevels | "")}>
                <option value="">Select level</option>
                <option value="BEGINNER">BEGINNER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="PROFICIENT">PROFICIENT</option>
                <option value="ADVANCED">ADVANCED</option>
                <option value="EXPERT">EXPERT</option>
              </select>
            </div>
          ))}
          <button type="button" onClick={addSkill} className="border px-3 py-1 rounded">Add Skill</button>
        </div>

        {/* EXTRA */}
        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="font-medium">Extra Sections</h3>
          {cv.extra.map((b) => (
            <div key={b.id} className="space-y-2 p-3 border rounded">
              <div className="flex justify-between">
                <input className="border p-2 rounded w-full" placeholder="Section Title" value={b.name} onChange={(e) => updExtraName(b.id, e.target.value)} />
                <button type="button" onClick={() => delExtraBlock(b.id)} className="text-red-600 text-sm ml-2">X</button>
              </div>

              {b.fields.map((f) => (
                <div key={f.id} className="flex gap-2 items-center">
                  <input className="border p-2 rounded w-1/2" placeholder="Key" value={f.key} onChange={(e) => updExtraField(b.id, f.id, "key", e.target.value)} />
                  <input className="border p-2 rounded w-1/2" placeholder="Value" value={f.value} onChange={(e) => updExtraField(b.id, f.id, "value", e.target.value)} />
                  <input className="border p-2 rounded w-1/2" placeholder="url" value={f.url} onChange={(e) => updExtraField(b.id, f.id, "url", e.target.value)} />
                  <button type="button" onClick={() => delExtraField(b.id, f.id)} className="text-red-600 text-sm">X</button>
                </div>
              ))}

              <button type="button" onClick={() => addExtraField(b.id)} className="border px-3 py-1 rounded">
                Add Field
              </button>
            </div>
          ))}

          <button type="button" onClick={addExtraBlock} className="border px-3 py-1 rounded">
            Add Extra Section
          </button>
        </div>

        <input type="hidden" name="payload" value={JSON.stringify(cv)} />
        <button type="submit" className="bg-white text-black py-2 rounded">Save CV</button>
      </form>

      {/* PREVIEW */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Preview</h2>
        <Separator />
        <div className="flex gap-2 items-center">
        {cv.photo && <img src={cv.photo} alt="" className="w-17 h-17 object-cover rounded-full" />}
        {cv.name && <strong className="text-3xl bold text-zinc-300">{cv.name.toUpperCase()}</strong>}
        </div>
        <div className="flex gap-4 items-center text-zinc-300">
        {cv.location && <div className="flex gap-1 bold text-lg items-center"><Home size={18}/>{cv.location}</div>}
        {cv.phone && <div className="flex gap-1 bold text-lg items-center"><Phone size={18}/>{cv.phone}</div>}
        {cv.email && <div className="flex gap-1 bold text-lg items-center"><Mail size={18}/>{cv.email}</div>}
        </div>
        <Separator />
        {cv.description && <div className="whitespace-pre-line">{cv.description}</div>}
        <Separator />
        <div className="my-3">
        {nonEmptyXP.length > 0 && (
          <>
            <h3 className="text-xl bold text-zinc-300 mt-2">WORK EXPERIENCE</h3>
            <ExperienceTimeline data={nonEmptyXP} />
          </>
        )}
        </div>
        <Separator />
        <div className="my-3">
        {nonEmptySkills.length > 0 && (
          <>
            <h3 className="text-xl bold text-zinc-300">SKILLS</h3>
            {nonEmptySkills.map((s) => (
              <div key={s.id} className="w-full flex gap-2 justify-between">
                <div className="w-1/2 bold text-xl">
                  {s.name} 
                </div>
                <div className="w-1/2">
                {s.level && `${s.level}`}
                </div>
              </div>
            ))}
          </>
        )}
        </div>
        <Separator />
        <div className="my-3">
        {nonEmptyExtra.length > 0 && (
          <>
            {nonEmptyExtra.map((b) => (
              <div key={b.id}>
                {b.name && <h3 className="text-xl bold text-zinc-300 mt-4">{b.name}</h3>}
                {b.fields.map((f) => (
                  <div key={f.id} className="flex w-full gap-2 justify-between my-2">
                    <a href={f.url || undefined} className="w-1/2 text-xl hover:underline">
                      {f.key}
                    </a>
                    <div className="w-1/2">
                    {f.value}
                    </div>
                  </div>
                ))}
              <Separator className="mt-8" />
              </div>
            ))}
          </>
        )}
        </div>
      </div>
    </div>
  )
}