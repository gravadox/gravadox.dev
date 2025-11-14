"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import type { BlockInput, DownloadInput } from "@/actions/admin"
import { BlockType } from "@/lib/generated/prisma/client"

import TextBlock from "@/components/blog/text/text"
import ImageBlock from "@/components/blog/image/blogImage"
import VideoBlock from "@/components/blog/video/videoPlayer"
import CodeBlock from "@/components/blog/code/codeBlock"
import CanvasRunner from "@/components/blog/canvas/canvas"
import BlogButton from "@/components/blog/button/button"
import BlogEmbed from "@/components/blog/embed/blogEmbed"
import { getAppById, updateApp } from "@/actions/admin"
import AppDownloadSection from "@/components/app/downloadButton"
import Image from "next/image"

interface EditAppProps {
  appId: string
}

export default function EditApp({ appId }: EditAppProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    title: "",
    description: "",
    banner: "",
    icon:"",
    github: "",
    version: "",
    slug: "",
    tags: "",
    publishAt: "",
    pinned: "",
  })

  const [downloads, setDownloads] = useState<DownloadInput[]>([])
  const [blocks, setBlocks] = useState<BlockInput[]>([])

  useEffect(() => {
    async function load() {
      try {
        const app = await getAppById(appId)
        if (!app) {
          toast("app not found")
          router.push("/admin")
          return
        }

        setForm({
          title: app.title,
          description: app.description || "",
          banner: app.banner || "",
          slug: app.slug,
          icon: app.icon || "",
          github: app.github || "",
          version: app.version || "",
          tags: app.tags.join(", "),
          publishAt: app.publishAt ? new Date(app.publishAt).toISOString().slice(0,16) : "",
          pinned: app.pinned?.toString() || "",
        })

        setDownloads(
          app.downloads.map(b => ({
            name: b.name,
            link: b.link
          }))
        )

        setBlocks(
          app.blocks.map(b => ({
            type: b.type,
            data:
              b.data && typeof b.data === "object" && b.data !== null
                ? Object.fromEntries(
                    Object.entries(b.data).map(([k,v]) => [k, String(v ?? "")])
                  )
                : {},
          }))
        )
      } catch {
        toast("Failed to load app")
      } finally {
        setLoading(false)
      }

      
    }

    load()
  }, [appId])

  function addBlock(type: BlockType) {
    const base: Record<string, string> =
      type === "TEXT"
        ? { text: "" }
        : type === "IMAGE"
        ? { src: "https://avatars.githubusercontent.com/u/191682297?v=4", alt: "", href: "" }
        : type === "VIDEO"
        ? { src: "https://avatars.githubusercontent.com/u/191682297?v=4", poster: "" }
        : type === "CODE"
        ? { code: "", language: "", file: "", hideLanguage: "false", showLineNumbers: "true" }
        : type === "CANVAS"
        ? { code: "", mode: "2d", height: "400" }
        : type === "BUTTON"
        ? { link: "", text: "", variant: "", direction: "center", fit: ""}
        : {link: "https://www.youtube.com/embed/XbGs_qK2PQA", height: "400"}

    setBlocks(prev => [...prev, { type, data: base }])
  }

  function removeBlock(index: number) {
    setBlocks(prev => prev.filter((_, i) => i !== index))
  }

  function moveBlock(index: number, direction: "up" | "down") {
    setBlocks(prev => {
      const newArr = [...prev]
      const target = direction === "up" ? index - 1 : index + 1
      if (target < 0 || target >= prev.length) return prev
      const temp = newArr[index]
      newArr[index] = newArr[target]
      newArr[target] = temp
      return newArr
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const readyBlocks = blocks.map(b => ({
        ...b,
        data: Object.fromEntries(
          Object.entries(b.data).map(([k, v]) => [k, v?.trim() ?? ""])
        ),
      }))

      await updateApp(appId, {
        title: form.title.trim(),
        description: form.description.trim(),
        banner: form.banner.trim() || undefined,
        slug: form.slug.trim(),
        icon: form.icon,
        github: form.github,
        version: form.version,
        downloads: downloads,
        tags: form.tags
          .split(",")
          .map(t => t.trim())
          .filter(Boolean),
        publishAt: new Date(form.publishAt),
        pinned: form.pinned ? Number(form.pinned) : null,
        blocks: readyBlocks,
      })

      toast("app updated", { description: "The app has been successfully updated." })
      router.push(`/projects/${form.slug}`)
    } catch {
      toast("Failed to update app", {
        description: "Something went wrong.",
        action: { label: "Retry", onClick: () => handleSubmit(e) },
      })
    }
  }

  if (loading) return <p className="p-4">Loading...</p>

  return (
    <div className="flex justify-between gap-6 text-xl">
      {/* FORM SIDE */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
        {Object.entries(form).map(([key, value]) => (
          key !== "description" ? (
            <input
              key={key}
              type={key === "publishAt" ? "datetime-local" : "text"}
              placeholder={key}
              value={value}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="border p-2 rounded"
              required={["title", "description", "slug"].includes(key)}
            />
          ) : (
            <textarea
              key={key}
              placeholder={key}
              value={value}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="border p-2 rounded"
              required
            />
          )
        ))}


                <div className="border p-2 rounded">
          <p className="font-semibold mb-2">Downloads</p>
          {downloads.map((d, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                className="border p-1 rounded w-32"
                placeholder="OS name"
                value={d.name}
                onChange={e => {
                  const arr = [...downloads]
                  arr[i].name = e.target.value
                  setDownloads(arr)
                }}
              />
              <input
                className="border p-1 rounded flex-1"
                placeholder="Download link"
                value={d.link}
                onChange={e => {
                  const arr = [...downloads]
                  arr[i].link = e.target.value
                  setDownloads(arr)
                }}
              />
              <button type="button" onClick={() => setDownloads(downloads.filter((_,x)=>x!==i))}>
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setDownloads([...downloads, { name: "", link: "" }])}
            className="border px-2 py-1 w-full"
          >
            + Add Download
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {(["TEXT","IMAGE","VIDEO","CODE","CANVAS","BUTTON","EMBED"] as BlockType[]).map(t => (
            <button key={t} type="button" onClick={() => addBlock(t)} className="border p-1 rounded">
              + {t}
            </button>
          ))}
        </div>

        {blocks.map((b, i) => (
          <div key={i} className="border p-2 rounded relative">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold">{b.type}</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => moveBlock(i,"up")} className="text-xs border px-1 rounded">↑</button>
                <button type="button" onClick={() => moveBlock(i,"down")} className="text-xs border px-1 rounded">↓</button>
                <button type="button" onClick={() => removeBlock(i)} className="text-red-600 text-sm">✕</button>
              </div>
            </div>

            {Object.entries(b.data).map(([k,v]) => {
              const isMultiline = (k==="text" && b.type==="TEXT") || (k==="code")
              const isNumberField = k==="height"
              const isModeField = k==="mode" && b.type==="CANVAS"

              const commonProps = {
                placeholder: k,
                value: v,
                onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                  const newBlocks = [...blocks]
                  newBlocks[i] = { ...newBlocks[i], data: { ...newBlocks[i].data, [k]: e.target.value } }
                  setBlocks(newBlocks)
                },
                className: "border p-1 rounded mb-1 w-full",
              }

              if (isModeField) return <select key={k} {...commonProps}><option value="2d">2d</option><option value="3d">3d</option></select>
              if (isNumberField) return <input key={k} {...commonProps} type="number" min={50} step={1} />
              return isMultiline ? <textarea key={k} {...commonProps} rows={5} /> : <input key={k} {...commonProps} type="text" />
            })}
          </div>
        ))}

        <button type="submit" className="bg-white text-black py-2 rounded">Update app</button>
      </form>

      {/* PREVIEW SIDE */}
      <div className="w-3xl max-w-3xl border rounded p-4 overflow-y-auto min-h-screen">
        {form.banner && <Image height={400} width={1000} src={form.banner} alt="Banner" className="w-full rounded mb-4 object-cover" />}

        <div className="flex gap-4 mb-3">
        {form.icon && (
          <Image 
          width={100}
          height={100}
          src={form.icon}
          alt="icon"
          className="w-25 h-25"
           />
        )}
        
        <div>
        <h1 className="text-3xl font-bold ">{form.title || "Untitled"}</h1>
        <p className="mb-2 text-zinc-600 whitespace-pre-line">{form.description}</p>
        </div>
        </div>
        <AppDownloadSection downloads={downloads} github={form.github} />
        {(form.tags
          .split(",")
          .map(t => t.trim())
          .filter(Boolean)
        ).length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {form.tags
              .split(",")
              .map(t => t.trim())
              .filter(Boolean)
              .map((t, i) => (
                <span key={i} className="px-2 py-0.5 text-sm  bg-zinc-900">
                  {t}
                </span>
              ))}
          </div>
        )}

        {form.github && (
          <div className="text-zinc-600 flex justify-between w-full max-w-3xl">
            <div className="truncate">
              source: <a className="hover:underline" href={form.github ||""}>{form.github}</a>
            </div>
            {form.version && (
              <p className="min-w-25 truncate ml-6 pl-6 border-l">{form.version}</p>
            )}
            </div>
        )}
          {form.version && !form.github && (
              <p className="min-w-25 truncate text-right text-zinc-600">{form.version}</p>
          )}

        {blocks.map((b,i) => {
          switch(b.type){
            case "TEXT": return <TextBlock key={i} {...b.data} text={b.data?.text ?? ""} />
            case "IMAGE": return <ImageBlock key={i} {...b.data} src={b.data?.src ?? ""} />
            case "VIDEO": return <VideoBlock key={i} {...b.data} src={b.data?.src ?? ""} />
            case "CODE": return <CodeBlock key={i} {...b.data} code={b.data?.code ?? ""} language={b.data?.language ?? ""} file={b.data.file} hideLanguage={b.data.hideLanguage === "false"?false:true} showLineNumbers={b.data.showLineNumbers === "true"?true:false} />
            case "CANVAS": return <CanvasRunner key={i} code={String(b.data?.code ?? "")} mode={String(b.data?.mode ?? "2d")==="3d"?"3d":"2d"} height={Number(b.data?.height ?? 400) || 400} />
            case "BUTTON": return <BlogButton key={i} link={b.data.link || ""} variant={b.data.variant} text={b.data.text} direction={b.data.direction || "center"} fit={b.data.fit==="true"} />
            case "EMBED": return <BlogEmbed key={i} link={b.data.link} height={b.data.height} />
            default: return null
          }
        })}
      </div>
    </div>
  )
}
