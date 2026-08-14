import { SidebarProvider } from "@/components/ui/sidebar";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import AppArticle from "./appArticle";
import SideBar from "@/components/sidebar/sidebar";
import Nav from "@/app/nav";
import type { Metadata } from "next";
import { cache } from "react";

const getApp = cache((slug: string) =>
  db.app.findUnique({
    where: { slug },
    include: { blocks: true, downloads: true },
  })
);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const app = await getApp(slug)

  if (!app || (app.publishAt && app.publishAt > new Date())) return {}

  const images = app.banner
    ? [{ url: app.banner, width: 1000, height: 400, alt: app.title }]
    : app.icon
    ? [{ url: app.icon, width: 100, height: 100, alt: app.title }]
    : []

  return {
    title: app.title,
    description: app.description ?? undefined,
    openGraph: {
      title: app.title,
      description: app.description ?? undefined,
      type: "article",
      images,
      tags: app.tags,
    },
    twitter: {
      card: images.length ? "summary_large_image" : "summary",
      title: app.title,
      description: app.description ?? undefined,
      images: images.map((i) => i.url),
    },
  }
}

export default async function Layout({ params }: { params: Promise<{ slug: string }> }){
    const {slug} = await params
    const app = await getApp(slug)

    if(!app) return notFound()

    if (app.publishAt && app.publishAt > new Date()) {
      return notFound()
}
    return(
      <div className="flex">
      <SidebarProvider className="w-fit">
      <SideBar activeId={app.id} />
      </SidebarProvider>
      <div className="w-full">
      <Nav />
      <AppArticle app={app} />
      </div>
      </div>
)
}