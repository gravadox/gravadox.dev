import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import Link from "next/link"
import DeletePostOrApp from "./delete"

export default async function AdminPage() {
  await requireAdmin()

  const posts = await db.post.findMany()
  const apps = await db.app.findMany()



  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      {/* Posts */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        <div className="flex flex-wrap gap-4">
          {posts.map(post => (
            <div key={post.id} className="border p-4 flex flex-col justify-between hover:shadow transition w-1/4">
              <Link href={`/blog/${post.slug}`} className="block">
                <h3 className="font-semibold text-lg">{post.title}</h3>
                {post.description && <p className="text-zinc-600 w-full truncate mt-1">{post.description}</p>}
              </Link>
              <Link href={`/admin/edit/post/${post.id}`} className="mt-3 bg-white text-black py-1 px-2 text-center">
                Edit
              </Link>
              <DeletePostOrApp id={post.id} type="post" />
            </div>
          ))}
        </div>
      </section>

      {/* Apps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        <div className="flex flex-wrap gap-4">
          {apps.map(app => (
            <div key={app.id} className="border  p-4 flex flex-col justify-between hover:shadow transition w-1/4">
              <Link href={`/projects/${app.slug}`} className="block">
                <h3 className="font-semibold text-lg">{app.title}</h3>
                {app.description && <p className="text-zinc-600 w-full truncate mt-1">{app.description}</p>}
              </Link>
              <Link href={`/admin/edit/app/${app.id}`} className="mt-3 bg-white text-black py-1 px-2 text-center">
                Edit
              </Link>
              <DeletePostOrApp id={app.id} type="app" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
