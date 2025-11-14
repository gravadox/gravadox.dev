import { SidebarProvider } from "@/components/ui/sidebar";
import SideBar from "@/components/sidebar/sidebar"
import { db } from "@/lib/db";
import BlogArticle from "./blogArticle";
import { notFound } from "next/navigation";
import Nav from "@/app/nav";
export default async function Layout({ params }: { params: { slug: string } }){
      const {slug} = await params
      const post = await db.post.findUnique({
        where: { slug: slug },
        include: { blocks: true },
      })
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