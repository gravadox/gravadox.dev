import { getPublishedPosts } from "@/actions/getPublicBlog"
import { getPublishedApps } from "@/actions/getPublicApps"
import { SideBarClient } from "./sidebarClient"

export default async function SideBar({activeId}:{activeId?:string}) {
  const posts = await getPublishedPosts()
  const apps = await getPublishedApps()

  return (
    <div className="flex">
      <SideBarClient posts={posts} apps={apps} activeId={activeId} />
    </div>
  )
}
