import { Apps } from "./apps"
import SideBar from "@/components/sidebar/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { getPublishedApps } from "@/actions/getPublicApps"
import Nav from "@/app/nav"


export default async function PostList() {

  const data = await getPublishedApps()
  if (!data.length) return (
        <div className="flex">
          <SidebarProvider className="w-fit">
            <SideBar />
          </SidebarProvider>
          <div className="w-full">
            <Nav />
            <p className="w-full h-screen flex items-center justify-center">No apps available yet</p>
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
      <Apps data={data} />
      </div>
    </div>
  )
}
