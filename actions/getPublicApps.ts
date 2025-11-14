"use server"

import { db } from "@/lib/db"

export async function getPublishedApps() {
  const now = new Date()

  const apps = await db.app.findMany({
    where: {
      publishAt: {
        lte: now, 
      },
    },
    orderBy: [
      { pinned: "asc" }, 
      { publishAt: "desc" },
    ],
    include: {
      downloads: true,
    },
  })

  return apps
}
