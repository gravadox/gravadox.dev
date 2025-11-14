"use server"

import { db } from "@/lib/db"

export async function getPublishedPosts() {
  const now = new Date()

  const posts = await db.post.findMany({
    where: {
      publishAt: {
        lte: now, 
      },
    },
    orderBy: [
      { pinned: "asc" }, 
      { publishAt: "desc" },
    ],
    // include: {
    //   blocks: true,
    // },
  })

  return posts
}
