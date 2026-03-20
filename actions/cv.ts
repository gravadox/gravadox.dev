"use server"

import { requireAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"

type SkillLevels =
  | "BEGINNER"
  | "INTERMEDIATE"
  | "PROFICIENT"
  | "ADVANCED"
  | "EXPERT"

type XPInput = {
  id: string
  work: string
  at: string
  url: string
  date: string
}

type SkillInput = {
  id: string
  name: string
  level: SkillLevels | ""
}

type CVInput = {
  name: string
  description: string
  photo: string
  location: string
  phone: string
  email: string
  xp: XPInput[]
  lang: "EN" | "DE"
  skills: SkillInput[]
  extra: Prisma.InputJsonValue
}

export async function saveCV(raw:string) {
  await requireAdmin()
  const cv: CVInput = JSON.parse(raw)
  const existing = await getCv(cv.lang)

  if (existing) {
    await db.cV.update({
      where: { id: existing.id },
      data: {
        name: cv.name,
        description: cv.description || null,
        photo: cv.photo || null,
        location: cv.location || null,
        phone: cv.phone || null,
        email: cv.email || null,
        extra: cv.extra,
        xp: {
          deleteMany: {}, // remove old XP
          create: cv.xp.map((x) => ({
            work: x.work,
            at: x.at || null,
            url: x.url || null,
            date: x.date || null,
          })),
        },
        skills: {
          deleteMany: {}, // remove old skills
          create: cv.skills.map((s) => ({
            name: s.name,
            level: s.level || null,
          })),
        },
      },
    })
  } else {
    await db.cV.create({
      data: {
        name: cv.name,
        description: cv.description || null,
        photo: cv.photo || null,
        location: cv.location || null,
        phone: cv.phone || null,
        email: cv.email || null,
        extra: cv.extra,
        lang: cv.lang,
        xp: {
          create: cv.xp.map((x) => ({
            work: x.work,
            at: x.at || null,
            url: x.url || null,
            date: x.date || null,
          })),
        },
        skills: {
          create: cv.skills.map((s) => ({
            name: s.name,
            level: s.level || null,
          })),
        },
      },
    })
  }
}

export async function getCv(lang: "EN"|"DE") {
  return await db.cV.findFirst({ where: {lang} ,include: {skills: true, xp: true}})
}