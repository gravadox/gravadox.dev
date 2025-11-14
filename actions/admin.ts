"use server"

import { requireAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { BlockType, Prisma } from "@prisma/client"

export interface BlockInput {
  type: BlockType
  data: Record<string, string>
}

export interface DownloadInput {
  name: string
  link: string
}

export interface App {
  title: string
  description: string
  banner?: string
  icon?: string
  downloads: DownloadInput[]
  github?: string
  version?: string
  slug: string
  tags: string[]
  publishAt: Date
  pinned?: number | null
  blocks: BlockInput[]
}

export interface postInput {
  title: string
  description: string
  banner?: string
  slug: string
  tags: string[]
  publishAt?: Date
  pinned?: number | null
  blocks: BlockInput[]
}


// apps

export async function createApp(data: App) {
  await requireAdmin()
  const { title, description,icon, banner,version, slug, tags, publishAt, pinned, blocks, downloads, github } = data

  const sanitizedBlocks = blocks.map(b => ({
    type: b.type,
    data: Object.fromEntries(Object.entries(b.data).map(([k, v]) => [k, v?.trim() ?? ""])),
  }))

  return db.app.create({
    data: {
      title,
      description,
      banner: banner || null,
      slug,
      tags,
      version,
      icon,
      publishAt,
      pinned,
      github: github || null,
      blocks: {
        create: sanitizedBlocks as Prisma.BlockCreateWithoutAppInput[],
      },
      downloads: {
        create: downloads, // <— FIX
      },
    },
  })
}

export async function getAppById(id: string) {
  await requireAdmin()
  return db.app.findUnique({ where: { id }, include: { blocks: true, downloads: true } })
}

export async function updateApp(id: string, data: App) {
  await requireAdmin()
  const { title, description, icon, banner,version, slug, tags, publishAt, pinned, blocks, downloads, github } = data

  const sanitizedBlocks = blocks.map(b => ({
    type: b.type,
    data: Object.fromEntries(Object.entries(b.data).map(([k, v]) => [k, v?.trim() ?? ""])),
  }))

  return db.app.update({
    where: { id },
    data: {
      title,
      description,
      icon,
      banner: banner || null,
      slug,
      tags,
      version,
      publishAt,
      pinned,
      github: github || null,
      blocks: { deleteMany: {}, create: sanitizedBlocks as Prisma.BlockCreateWithoutAppInput[] },
      downloads: {
        deleteMany: {}, // remove previous
        create: downloads, // add new
      },
    },
  })
}

export async function deleteApp(id: string) {
  await requireAdmin()
  return db.app.delete({ where: { id } })
}

// posts

export async function createPost(data: postInput) {
  await requireAdmin()
  const { title, description, banner, slug, tags, publishAt, pinned, blocks } = data

  const sanitizedBlocks = blocks.map(b => ({
    type: b.type,
    data: Object.fromEntries(
      Object.entries(b.data).map(([k, v]) => [k, v?.trim() ?? ""])
    ),
  }))

  return db.post.create({
    data: {
      title,
      description,
      banner: banner || null,
      slug,
      tags,
      publishAt,
      pinned,
      blocks: {
        create: sanitizedBlocks as Prisma.BlockCreateWithoutPostInput[],
      },
    },
  })
}

export async function getPostById(id: string) {
  await requireAdmin()
  return db.post.findUnique({ where: { id }, include: { blocks: true } })
}

export async function updatePost(id: string, data: postInput) {
  await requireAdmin()
  const { title, description, banner, slug, tags, publishAt, pinned, blocks } = data
  const sanitizedBlocks = blocks.map(b => ({
    type: b.type,
    data: Object.fromEntries(Object.entries(b.data).map(([k,v]) => [k, v?.trim() ?? ""]))
  }))

  return db.post.update({
    where: { id },
    data: {
      title, description, banner: banner||null, slug, tags, publishAt, pinned,
      blocks: { deleteMany: {}, create: sanitizedBlocks as Prisma.BlockCreateWithoutPostInput[] }
    }
  })
}

export async function deletePost(id: string) {
  await requireAdmin()
  return db.post.delete({
    where: { id },
  })
}