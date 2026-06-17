import { isAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const h = await headers()
  const pathname = h.get("x-pathname") ?? ""

  if (!pathname.startsWith("/admin/login") && !(await isAdmin())) {
    redirect("/admin/login")
  }

  return <>{children}</>
}
