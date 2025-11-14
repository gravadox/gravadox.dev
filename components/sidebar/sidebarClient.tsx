"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AppWindow, Book, ChevronDown, ChevronRight } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"

interface Posts {
  id: string
  title: string
  description: string | null
  banner: string | null
  slug: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  publishAt: Date | null
  pinned: number | null
}

interface Apps {
  id: string
  title: string
  banner: string | null
  description: string | null
  slug: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  publishAt: Date | null
  pinned: number | null
  icon: string | null
  github: string | null
}

export function SideBarClient({
  posts,
  apps,
  activeId,
}: {
  posts: Posts[]
  apps: Apps[]
  activeId?: string
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState<{ [key: string]: boolean }>({})
  const [close, setClose] = useState<boolean>(false)
  const categories = [
    { title: "projects", path: "/projects", icon: AppWindow, items: apps },
    { title: "posts", path: "/blog", icon: Book, items: posts },
  ]

  useEffect(() => {
    const next = { ...open }
    for (const cat of categories) next[cat.title] = pathname.startsWith(cat.path)
    setOpen(next)
  }, [pathname])

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 1010) setClose(false)
      else setClose(true)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <SidebarProvider open={close} onOpenChange={setClose}>
      {/* Mobile toggle button */}
      <SidebarTrigger className="fixed bottom-0 mb-4 right-4 z-50 bg-zinc-900 text-zinc-100 p-2 rounded-md border border-zinc-800">
        <span className="sr-only">Toggle sidebar</span>
        <AppWindow className="w-5 h-5" />
      </SidebarTrigger>

      {/* Sidebar */}
      <Sidebar className="bg-zinc-950 border-r border-zinc-900">
        <SidebarContent className="gap-0 pl-4 py-4 pr-1 bg-zinc-950 overflow-y-auto h-full">
          {categories.map((cat) => (
            <SidebarGroup key={cat.title} className="m-0 p-0">
              <Collapsible
                open={open[cat.title]}
                onOpenChange={(v) => setOpen({ ...open, [cat.title]: v })}
              >
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex items-center cursor-pointer w-full justify-between">
                    <div className="items-center flex gap-2 text-lg">
                      <cat.icon className="w-4 h-4" />
                      {cat.title}
                    </div>
                      {open[cat.title] ? (
                        <ChevronDown className="h-4 transition-transform duration-200 rotate-0" />
                      ) : (
                        <ChevronRight className="h-4 transition-transform duration-200" />
                      )}
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent className="ml-4 pl-4 border-l transition-all duration-200 ease-in-out">
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {cat.items.map((item) => (
                        <SidebarMenuItem key={item.slug}>
                          <SidebarMenuButton
                            asChild
                            className={`rounded-none hover:bg-zinc-900 text-zinc-400 ${
                              item.id === activeId ? "bg-zinc-900 text-zinc-100" : ""
                            }`}
                          >
                            <Link
                              href={
                                cat.path === "/blog"
                                  ? `/blog/${item.slug}`
                                  : `/projects/${item.slug}`
                              }
                              className="text-sm"
                            >
                              <p className="truncate">{item.title}</p>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
