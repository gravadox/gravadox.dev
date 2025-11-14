"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createPost } from "@/actions/admin"
import type { BlockInput } from "@/actions/admin"
import { BlockType } from "@prisma/client"
import { toast } from "sonner"

import TextBlock from "@/components/blog/text/text"
import ImageBlock from "@/components/blog/image/blogImage"
import VideoBlock from "@/components/blog/video/videoPlayer"
import CodeBlock from "@/components/blog/code/codeBlock"
import CanvasRunner from "@/components/blog/canvas/canvas"
import BlogButton from "@/components/blog/button/button"
import BlogEmbed from "@/components/blog/embed/blogEmbed"
import Image from "next/image"

export default function CreatePost() {
  const router = useRouter()

  const [form, setForm] = useState({
    title: "",
    description: "",
    banner: "",
    slug: "",
    tags: "",
    publishAt: new Date().toISOString().slice(0,16),
    pinned: "",
  })

  const [blocks, setBlocks] = useState<BlockInput[]>([])

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

    await createPost({
      title: form.title.trim(),
      description: form.description.trim(),
      banner: form.banner.trim() || undefined,
      slug: form.slug.trim(),
      tags: form.tags
        .split(",")
        .map(t => t.trim())
        .filter(Boolean),
      publishAt: new Date(form.publishAt),
      pinned: form.pinned ? Number(form.pinned) : null,
      blocks: readyBlocks,
    })

    toast("Post created", {
      description: "The post has been successfully saved.",
    })
    router.push(`/blog/${form.slug}`)
  } catch {
    toast("Failed to create post", {
      description: "Something went wrong.",
      action: {
        label: "Retry",
        onClick: () => handleSubmit(e),
      },
    })
  }
}


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

        <div className="flex gap-2 flex-wrap">
          {(["TEXT", "IMAGE", "VIDEO", "CODE", "CANVAS", "BUTTON", "EMBED"] as BlockType[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => addBlock(t)}
              className="border p-1 rounded"
            >
              + {t}
            </button>
          ))}
        </div>

        {blocks.map((b, i) => (
          <div key={i} className="border p-2 rounded relative">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold">{b.type}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => moveBlock(i, "up")}
                  className="text-xs border px-1 rounded"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(i, "down")}
                  className="text-xs border px-1 rounded"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeBlock(i)}
                  className="text-red-600 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            {Object.entries(b.data).map(([k, v]) => {
              const isMultiline = (k === "text" && b.type === "TEXT") || (k === "code")
              // make numeric inputs for height
              const isNumberField = k === "height"
              const isModeField = k === "mode" && b.type === "CANVAS"

              const commonProps = {
                placeholder: k,
                value: v,
                onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                  const newBlocks = [...blocks]
                  newBlocks[i] = {
                    ...newBlocks[i],
                    data: { ...newBlocks[i].data, [k]: e.target.value },
                  }
                  setBlocks(newBlocks)
                },
                className: "border p-1 rounded mb-1 w-full",
              }

              if (isModeField) {
                return (
                  <select key={k} {...commonProps}>
                    <option value="2d">2d</option>
                    <option value="3d">3d</option>
                  </select>
                )
              }

              if (isNumberField) {
                return (
                  <input
                    key={k}
                    {...(commonProps)}
                    type="number"
                    min={50}
                    step={1}
                  />
                )
              }

              return isMultiline ? (
                <textarea key={k} {...(commonProps)} rows={5} />
              ) : (
                <input key={k} {...(commonProps)} type="text" />
              )
            })}
            
        </div>
        ))}

        <button type="submit" className="bg-white text-black py-2 rounded">
          Create Post
        </button>
      </form>

      {/* PREVIEW SIDE */}
      <div className="w-3xl max-w-3xl border rounded p-4 overflow-y-auto min-h-screen">
        {form.banner && (
          <Image
            width={1000}
            height={600}
            src={form.banner}
            alt="Banner"
            className="w-full rounded mb-4 object-cover"
          />
        )}

        <h1 className="text-3xl font-bold mb-2">{form.title || "Untitled"}</h1>
        <p className="text-zinc-600 whitespace-pre-line mb-1">{form.description}</p>

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

        {blocks.map((b, i) => {
          switch (b.type) {
            case "TEXT":
              return <TextBlock key={i} {...b.data} text={b.data?.text ?? ""} />
            case "IMAGE":
              return <ImageBlock key={i} {...b.data} src={b.data?.src ?? "https://avatars.githubusercontent.com/u/191682297?v=4"} />
            case "VIDEO":
              return <VideoBlock key={i} {...b.data} src={b.data?.src ?? "https://avatars.githubusercontent.com/u/191682297?v=4"} />
            case "CODE":
              return <CodeBlock key={i} {...b.data} code={b.data?.code ?? ""} language={b.data?.language ?? ""} file={b.data.file} hideLanguage={b.data.hideLanguage === "false"? false: true} showLineNumbers={b.data.showLineNumbers === "true"? true:false} />
            case "CANVAS":
              return <CanvasRunner  key={i}  code={String(b.data?.code ?? "")}  mode={String(b.data?.mode ?? "2d") === "3d" ? "3d" : "2d"}  height={Number(b.data?.height ?? 400) || 400}/>
            case "BUTTON":
              return <BlogButton key={i} link={b.data.link || ""} variant={b.data.variant} text={b.data.text} direction={b.data.direction || "center"} fit={b.data.fit==="true"} />
            case "EMBED":
              return <BlogEmbed key={i} link={b.data.link} height={b.data.height} />
              default:
              return null
          }
        })}
      </div>
    </div>
  )
}
