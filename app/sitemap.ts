import { MetadataRoute } from "next"
import { db } from "@/lib/db"

const BASE_URL = "https://gravadox.dev"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const [posts, apps] = await Promise.all([
    db.post.findMany({
      where: { publishAt: { lte: now } },
      select: { slug: true, updatedAt: true },
    }),
    db.app.findMany({
      where: { publishAt: { lte: now } },
      select: { slug: true, updatedAt: true },
    }),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ]

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const appRoutes: MetadataRoute.Sitemap = apps.map((app) => ({
    url: `${BASE_URL}/projects/${app.slug}`,
    lastModified: app.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticRoutes, ...postRoutes, ...appRoutes]
}
