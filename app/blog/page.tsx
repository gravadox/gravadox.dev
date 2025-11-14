import { getPublishedPosts } from "@/actions/getPublicBlog"
import { Blogs } from "./blogs"
import SideBar from "@/components/sidebar/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import Nav from "@/app/nav"


export default async function PostList() {

  const data = await getPublishedPosts()
  if (!data.length) return(
    <div className="flex">
      <SidebarProvider className="w-fit">
        <SideBar />
      </SidebarProvider>
      <div className="w-full">
        <Nav />
        <p className="w-full h-screen flex items-center justify-center">No posts available yet</p>
      </div>
    </div>
  )

  return (
    <div className="flex">
      <SidebarProvider className="w-fit">
        <SideBar />
      </SidebarProvider>
      <div className="w-full">
      <Nav />
      <Blogs data={data} />
      </div>
    </div>
  )
}
