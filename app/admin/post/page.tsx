"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createPost } from "@/actions/admin"
import { toast } from "sonner"
import Image from "next/image"
import { ChevronDown, ChevronRight } from "lucide-react"
import { BlocksEditor, EditorBlock } from "@/components/admin/editor/blocks-editor"

export default function CreatePost() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [title,       setTitle]       = useState("")
  const [description, setDescription] = useState("")
  const [banner,      setBanner]      = useState("")
  const [slug,        setSlug]        = useState("")
  const [tags,        setTags]        = useState("")
  const [publishAt,   setPublishAt]   = useState(new Date().toISOString().slice(0, 16))
  const [pinned,      setPinned]      = useState("")
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [editBanner,   setEditBanner]  = useState(false)
  const [blocks, setBlocks] = useState<EditorBlock[]>([])

  const parsedTags = tags.split(",").map(t => t.trim()).filter(Boolean)

  async function handleSave() {
    if (!title.trim() || !slug.trim()) {
      toast("Title and slug are required")
      setSettingsOpen(true)
      return
    }
    setSaving(true)
    try {
      await createPost({
        title:       title.trim(),
        description: description.trim(),
        banner:      banner.trim() || undefined,
        slug:        slug.trim(),
        tags:        parsedTags,
        publishAt:   new Date(publishAt),
        pinned:      pinned ? Number(pinned) : null,
        blocks:      blocks.map(({ _id, ...b }) => b),
      })
      toast("Post created")
      router.push(`/blog/${slug.trim()}`)
    } catch {
      toast("Failed to create post")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 relative">

      {/* Save button — sticky top-right */}
      <div className="sticky top-4 flex justify-end z-50 mb-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-white text-black px-5 py-1.5 rounded text-sm font-medium disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {/* Banner — tap/click to toggle URL panel */}
      <div className="w-full mb-8">
        {banner ? (
          <div onClick={() => setEditBanner(o => !o)} className="cursor-pointer relative">
            <Image src={banner} alt="Banner" width={1000} height={400} className="w-full rounded object-cover max-h-72" />
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
              {editBanner ? "close ↑" : "edit ↓"}
            </span>
          </div>
        ) : (
          <div
            onClick={() => setEditBanner(true)}
            className="w-full h-28 rounded flex items-center justify-center border border-dashed border-zinc-700 text-zinc-600 text-sm cursor-pointer hover:border-zinc-500 transition-colors"
          >
            + Add banner image
          </div>
        )}
        {editBanner && (
          <div className="mt-2 p-3 bg-zinc-900/60 rounded border border-zinc-800 flex gap-2">
            <input
              autoFocus
              value={banner}
              onChange={e => setBanner(e.target.value)}
              placeholder="Banner image URL"
              className="flex-1 bg-transparent border-b border-zinc-600 outline-none text-sm py-0.5"
            />
            <button type="button" onClick={() => setEditBanner(false)} className="text-xs text-zinc-500 hover:text-white flex-shrink-0">Done</button>
          </div>
        )}
      </div>

      {/* Title */}
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Untitled"
        className="w-full text-4xl font-bold bg-transparent outline-none mb-2 placeholder-zinc-700"
      />

      {/* Description */}
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Add a description…"
        className="w-full text-zinc-500 bg-transparent outline-none resize-none mb-3 text-lg"
        rows={2}
      />

      {/* Tags */}
      <div className="mb-6">
        {parsedTags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-2">
            {parsedTags.map((t, i) => (
              <span key={i} className="px-2 py-0.5 text-sm bg-zinc-900">{t}</span>
            ))}
          </div>
        )}
        <input
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="Tags: typescript, react… (comma separated)"
          className="w-full text-sm text-zinc-600 bg-transparent outline-none border-b border-transparent focus:border-zinc-700 py-0.5 transition-colors"
        />
      </div>

      {/* Settings collapsible */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => setSettingsOpen(o => !o)}
          className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 mb-2"
        >
          {settingsOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          Settings
        </button>
        {settingsOpen && (
          <div className="p-3 bg-zinc-900/40 rounded border border-zinc-800 space-y-3">
            <div>
              <label className="text-xs text-zinc-500 block mb-0.5">Slug</label>
              <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="my-post-slug" className="w-full bg-transparent border-b border-zinc-700 outline-none text-sm py-0.5" />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-0.5">Publish date</label>
              <input type="datetime-local" value={publishAt} onChange={e => setPublishAt(e.target.value)} className="bg-zinc-800 px-2 py-1 text-sm rounded outline-none" />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-0.5">Pin order (empty = not pinned)</label>
              <input type="number" value={pinned} onChange={e => setPinned(e.target.value)} placeholder="1, 2, 3…" className="bg-zinc-800 px-2 py-1 text-sm rounded outline-none w-24" />
            </div>
          </div>
        )}
      </div>

      <hr className="border-zinc-800 mb-6" />

      {/* Block editor */}
      <BlocksEditor blocks={blocks} setBlocks={setBlocks} />
    </div>
  )
}
