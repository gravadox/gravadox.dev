"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createApp } from "@/actions/admin"
import type { DownloadInput } from "@/actions/admin"
import { toast } from "sonner"
import Image from "next/image"
import { ChevronDown, ChevronRight, Plus, X } from "lucide-react"
import AppDownloadSection from "@/components/app/downloadButton"
import { BlocksEditor, EditorBlock } from "@/components/admin/editor/blocks-editor"

export default function CreateApp() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [title,        setTitle]        = useState("")
  const [description,  setDescription]  = useState("")
  const [banner,       setBanner]       = useState("")
  const [icon,         setIcon]         = useState("")
  const [github,       setGithub]       = useState("")
  const [version,      setVersion]      = useState("")
  const [slug,         setSlug]         = useState("")
  const [tags,         setTags]         = useState("")
  const [publishAt,    setPublishAt]    = useState(new Date().toISOString().slice(0, 16))
  const [pinned,       setPinned]       = useState("")
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [editBanner,   setEditBanner]   = useState(false)
  const [editIcon,     setEditIcon]     = useState(false)
  const [downloads,    setDownloads]    = useState<DownloadInput[]>([])
  const [blocks,       setBlocks]       = useState<EditorBlock[]>([])

  const parsedTags = tags.split(",").map(t => t.trim()).filter(Boolean)

  const addDownload    = () => setDownloads(d => [...d, { name: "", link: "" }])
  const removeDownload = (i: number) => setDownloads(d => d.filter((_, x) => x !== i))
  const updateDownload = (i: number, field: "name" | "link", val: string) =>
    setDownloads(d => d.map((item, x) => x === i ? { ...item, [field]: val } : item))

  async function handleSave() {
    if (!title.trim() || !slug.trim()) {
      toast("Title and slug are required")
      setSettingsOpen(true)
      return
    }
    setSaving(true)
    try {
      await createApp({
        title:       title.trim(),
        description: description.trim(),
        banner:      banner.trim() || undefined,
        icon:        icon.trim()   || undefined,
        github:      github.trim() || undefined,
        version:     version.trim() || undefined,
        downloads,
        slug:        slug.trim(),
        tags:        parsedTags,
        publishAt:   new Date(publishAt),
        pinned:      pinned ? Number(pinned) : null,
        blocks:      blocks.map(({ _id, ...b }) => b),
      })
      toast("App created")
      router.push(`/projects/${slug.trim()}`)
    } catch {
      toast("Failed to create app")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 relative">

      {/* Save button */}
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
      <div className="w-full mb-6">
        {banner ? (
          <div onClick={() => setEditBanner(o => !o)} className="cursor-pointer relative aspect-[10/4] overflow-hidden w-full rounded">
            <Image src={banner} alt="Banner" width={1000} height={400} className="w-full object-cover" />
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

      {/* Icon + Title row */}
      <div className="flex gap-4 mb-4 items-start">
        {/* Icon — tap/click to toggle URL panel */}
        <div className="relative flex-shrink-0">
          {icon ? (
            <div onClick={() => setEditIcon(o => !o)} className="cursor-pointer">
              <Image src={icon} alt="Icon" width={96} height={96} className="w-24 h-24 rounded object-cover" />
            </div>
          ) : (
            <div
              onClick={() => setEditIcon(true)}
              className="w-24 h-24 rounded flex items-center justify-center border border-dashed border-zinc-700 text-zinc-600 text-xs cursor-pointer hover:border-zinc-500 transition-colors text-center"
            >
              + Icon
            </div>
          )}
          {editIcon && (
            <div className="absolute left-0 top-full mt-1 z-50 bg-zinc-950 border border-zinc-800 rounded p-2 w-64 flex gap-2">
              <input
                autoFocus
                value={icon}
                onChange={e => setIcon(e.target.value)}
                placeholder="Icon image URL"
                className="flex-1 bg-transparent border-b border-zinc-600 outline-none text-xs py-0.5"
              />
              <button type="button" onClick={() => setEditIcon(false)} className="text-xs text-zinc-500 hover:text-white flex-shrink-0">Done</button>
            </div>
          )}
        </div>

        {/* Title + Description */}
        <div className="flex-1 min-w-0">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="App name"
            className="w-full text-3xl font-bold bg-transparent outline-none mb-1 placeholder-zinc-700"
          />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add a description…"
            className="w-full text-zinc-500 bg-transparent outline-none resize-none text-base"
            rows={2}
          />
        </div>
      </div>

      {/* Downloads */}
      <div className="mb-4">
        <AppDownloadSection downloads={downloads} github={github} />
        <div className="mt-2 space-y-1">
          {downloads.map((d, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={d.name}
                onChange={e => updateDownload(i, "name", e.target.value)}
                placeholder="OS / platform"
                className="bg-zinc-800 px-2 py-0.5 text-sm rounded outline-none w-28"
              />
              <input
                value={d.link}
                onChange={e => updateDownload(i, "link", e.target.value)}
                placeholder="Download URL"
                className="flex-1 bg-zinc-800 px-2 py-0.5 text-sm rounded outline-none"
              />
              <button type="button" onClick={() => removeDownload(i)} className="text-zinc-600 hover:text-red-400">
                <X size={14} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addDownload}
            className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 mt-1"
          >
            <Plus size={12} /> Add download
          </button>
        </div>
      </div>

      {/* GitHub + Version */}
      {(github || version) && (
        <div className="text-zinc-600 flex justify-between w-full mb-4">
          {github && (
            <div className="truncate text-sm">
              source: <a className="hover:underline" href={github}>{github}</a>
            </div>
          )}
          {version && (
            <p className="text-sm ml-6 pl-6 border-l border-zinc-700">{version}</p>
          )}
        </div>
      )}

      {/* Tags */}
      <div className="mb-6">
        {parsedTags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-2">
            {parsedTags.map((t, i) => (
              <span key={i} className="px-2 py-0.5 text-sm bg-zinc-900 text-zinc-400">{t}</span>
            ))}
          </div>
        )}
        <input
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="Tags: macos, rust… (comma separated)"
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
              <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="my-app-slug" className="w-full bg-transparent border-b border-zinc-700 outline-none text-sm py-0.5" />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-0.5">GitHub URL</label>
              <input value={github} onChange={e => setGithub(e.target.value)} placeholder="https://github.com/…" className="w-full bg-transparent border-b border-zinc-700 outline-none text-sm py-0.5" />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-0.5">Version</label>
              <input value={version} onChange={e => setVersion(e.target.value)} placeholder="v1.0.0" className="w-full bg-transparent border-b border-zinc-700 outline-none text-sm py-0.5" />
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
