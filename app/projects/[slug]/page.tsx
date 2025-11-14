import { SidebarProvider } from "@/components/ui/sidebar";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import AppArticle from "./appArticle";
import SideBar from "@/components/sidebar/sidebar";
import Nav from "@/app/nav";
export default async function Layout({ params }: { params: { slug: string } }){
      const {slug} = await params
      const app = await db.app.findUnique({
        where: { slug: slug },
        include: { blocks: true, downloads: true },
      })
    if(!app) return notFound()
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