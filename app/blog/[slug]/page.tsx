import { SidebarProvider } from "@/components/ui/sidebar";
import SideBar from "@/components/sidebar/sidebar"
import { db } from "@/lib/db";
import BlogArticle from "./blogArticle";
import { notFound } from "next/navigation";
import Nav from "@/app/nav";
import type { Metadata } from "next";
import { cache } from "react";

const getPost = cache((slug: string) =>
  db.post.findUnique({
    where: { slug },
    include: { blocks: true },
  })
);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post || (post.publishAt && post.publishAt > new Date())) return {}

  const images = post.banner
    ? [{ url: post.banner, width: 1000, height: 400, alt: post.title }]
    : []

  return {
    title: post.title,
    description: post.description ?? undefined,
    openGraph: {
      title: post.title,
      description: post.description ?? undefined,
      type: "article",
      images,
    },
    twitter: {
      card: images.length ? "summary_large_image" : "summary",
      title: post.title,
      description: post.description ?? undefined,
      images: images.map((i) => i.url),
    },
  }
}

export default async function Layout({ params }: { params: Promise<{ slug: string }> }){
      const {slug} = await params
      const post = await getPost(slug)

    if(!post) return notFound()

    if (post.publishAt && post.publishAt > new Date()) {
      return notFound()
}

    return(
<div className="flex">
<SidebarProvider className="w-fit">
<SideBar activeId={post.id} />
</SidebarProvider>
<div className="w-full">
<Nav />
<BlogArticle post={post} />
</div>
</div>
)
}