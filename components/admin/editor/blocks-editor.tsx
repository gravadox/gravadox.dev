"use client"

import { useState, useRef, useEffect } from "react"
import { BlockType } from "@prisma/client"
import type { BlockInput } from "@/actions/admin"
import TextBlock from "@/components/blog/text/text"
import ImageBlock from "@/components/blog/image/blogImage"
import VideoBlock from "@/components/blog/video/videoPlayer"
import CodeBlock from "@/components/blog/code/codeBlock"
import CanvasRunner from "@/components/blog/canvas/canvas"
import BlogButton from "@/components/blog/button/button"
import BlogEmbed from "@/components/blog/embed/blogEmbed"
import { GripVertical, Trash2 } from "lucide-react"

// ---- Types ----

export type EditorBlock = BlockInput & { _id: string }

export function makeId(): string {
  return Math.random().toString(36).slice(2, 9)
}

export function defaultBlockData(type: BlockType): Record<string, string> {
  switch (type) {
    case "TEXT":   return { text: "" }
    case "IMAGE":  return { src: "", alt: "", href: "" }
    case "VIDEO":  return { src: "", poster: "" }
    case "CODE":   return { code: "", language: "javascript", file: "", hideLanguage: "false", showLineNumbers: "true" }
    case "CANVAS": return { code: "", mode: "2d", height: "400" }
    case "BUTTON": return { link: "", text: "", variant: "outline", direction: "center", fit: "false" }
    case "EMBED":  return { link: "", height: "400" }
  }
}

// ---- Slash menu options ----

const BLOCK_OPTIONS = [
  { type: "TEXT"   as BlockType, label: "Text",   icon: "T",   description: "Markdown text" },
  { type: "IMAGE"  as BlockType, label: "Image",  icon: "🖼",  description: "Image from URL" },
  { type: "VIDEO"  as BlockType, label: "Video",  icon: "▶",   description: "Video player" },
  { type: "CODE"   as BlockType, label: "Code",   icon: "</>", description: "Syntax highlighted code" },
  { type: "EMBED"  as BlockType, label: "Embed",  icon: "⊞",   description: "YouTube, Vimeo…" },
  { type: "BUTTON" as BlockType, label: "Button", icon: "□",   description: "Styled button link" },
  { type: "CANVAS" as BlockType, label: "Canvas", icon: "◼",   description: "2D/3D canvas runner" },
]

// ---- Shared micro-styles ----

const fieldCls = "w-full bg-transparent border-b border-zinc-700 focus:border-zinc-400 outline-none py-0.5 text-sm transition-colors"
const labelCls = "text-xs text-zinc-500 mb-0.5 block"
const panelCls = "mt-2 p-3 bg-zinc-900/60 rounded space-y-2 border border-zinc-800"

// ---- Block editor props ----

interface BEProps {
  data: Record<string, string>
  onChange: (data: Record<string, string>) => void
  autoFocus?: boolean
}

// ---- TEXT ----

function TextEditor({ data, onChange, autoFocus }: BEProps) {
  const [editing, setEditing] = useState(autoFocus || !data.text)

  const resize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto"
    el.style.height = el.scrollHeight + "px"
  }

  if (editing) {
    return (
      <textarea
        autoFocus
        value={data.text}
        onChange={e => { onChange({ ...data, text: e.target.value }); resize(e.target) }}
        onKeyDown={e => { if (e.key === "Escape") setEditing(false) }}
        onBlur={() => setEditing(false)}
        onFocus={e => resize(e.target)}
        placeholder="Type markdown… (Esc to preview)"
        className="w-full bg-transparent outline-none resize-none leading-relaxed min-h-[1.5rem] font-mono text-sm"
        rows={1}
      />
    )
  }

  return (
    <div onClick={() => setEditing(true)} className="cursor-text min-h-[1.5rem]">
      {data.text
        ? <TextBlock text={data.text} />
        : <p className="text-zinc-600 italic text-sm">Empty text. Click to edit.</p>}
    </div>
  )
}

// ---- IMAGE ----

function ImageEditor({ data, onChange, autoFocus }: BEProps) {
  const [open, setOpen] = useState(autoFocus || !data.src)

  return (
    <div>
      {data.src && <ImageBlock src={data.src} alt={data.alt} href={data.href} />}
      {open ? (
        <div className={panelCls}>
          <div>
            <label className={labelCls}>Image URL</label>
            <input autoFocus type="url" value={data.src} onChange={e => onChange({ ...data, src: e.target.value })} placeholder="https://…" className={fieldCls} />
          </div>
          <div>
            <label className={labelCls}>Alt text</label>
            <input value={data.alt || ""} onChange={e => onChange({ ...data, alt: e.target.value })} placeholder="Description" className={fieldCls} />
          </div>
          <div>
            <label className={labelCls}>Link URL (optional)</label>
            <input type="url" value={data.href || ""} onChange={e => onChange({ ...data, href: e.target.value })} placeholder="https://…" className={fieldCls} />
          </div>
          <button type="button" onClick={() => setOpen(false)} className="text-xs text-zinc-500 hover:text-white">Done</button>
        </div>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="text-xs text-zinc-600 hover:text-zinc-400 mt-1">Edit image ↑</button>
      )}
    </div>
  )
}

// ---- VIDEO ----

function VideoEditor({ data, onChange, autoFocus }: BEProps) {
  const [open, setOpen] = useState(autoFocus || !data.src)

  return (
    <div>
      {data.src && <VideoBlock src={data.src} poster={data.poster} />}
      {open ? (
        <div className={panelCls}>
          <div>
            <label className={labelCls}>Video URL</label>
            <input autoFocus type="url" value={data.src} onChange={e => onChange({ ...data, src: e.target.value })} placeholder="https://…" className={fieldCls} />
          </div>
          <div>
            <label className={labelCls}>Poster image URL (optional)</label>
            <input type="url" value={data.poster || ""} onChange={e => onChange({ ...data, poster: e.target.value })} placeholder="https://…" className={fieldCls} />
          </div>
          <button type="button" onClick={() => setOpen(false)} className="text-xs text-zinc-500 hover:text-white">Done</button>
        </div>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="text-xs text-zinc-600 hover:text-zinc-400 mt-1">Edit video ↑</button>
      )}
    </div>
  )
}

// ---- CODE ----

function CodeEditor({ data, onChange, autoFocus }: BEProps) {
  const [editing, setEditing] = useState(autoFocus || !data.code)
  const hideLang  = data.hideLanguage  === "true"
  const showLines = data.showLineNumbers !== "false"

  return (
    <div>
      {!editing && data.code && (
        <div className="cursor-pointer" onClick={() => setEditing(true)}>
          <CodeBlock
            code={data.code}
            language={data.language || "text"}
            file={data.file}
            hideLanguage={hideLang}
            showLineNumbers={showLines}
          />
        </div>
      )}
      {editing && (
        <div className={panelCls}>
          <textarea
            autoFocus
            value={data.code}
            onChange={e => {
              e.target.style.height = "auto"
              e.target.style.height = e.target.scrollHeight + "px"
              onChange({ ...data, code: e.target.value })
            }}
            placeholder="// code here…"
            className="w-full bg-zinc-950 font-mono text-sm p-3 outline-none resize-none min-h-28 rounded"
            rows={6}
            spellCheck={false}
          />
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className={labelCls}>Language</label>
              <input
                value={data.language || ""}
                onChange={e => onChange({ ...data, language: e.target.value })}
                placeholder="javascript, tsx…"
                className="bg-zinc-800 px-2 py-0.5 text-sm rounded outline-none w-32"
              />
            </div>
            <div>
              <label className={labelCls}>File name</label>
              <input
                value={data.file || ""}
                onChange={e => onChange({ ...data, file: e.target.value })}
                placeholder="main.ts"
                className="bg-zinc-800 px-2 py-0.5 text-sm rounded outline-none w-28"
              />
            </div>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="checkbox" checked={showLines} onChange={e => onChange({ ...data, showLineNumbers: e.target.checked ? "true" : "false" })} />
              Line numbers
            </label>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="checkbox" checked={hideLang} onChange={e => onChange({ ...data, hideLanguage: e.target.checked ? "true" : "false" })} />
              Hide language
            </label>
          </div>
          {data.code && (
            <button type="button" onClick={() => setEditing(false)} className="text-xs text-zinc-500 hover:text-white">Preview ↑</button>
          )}
        </div>
      )}
      {!editing && !data.code && (
        <p className="text-zinc-600 italic text-sm cursor-pointer py-2" onClick={() => setEditing(true)}>
          Empty code block. Click to edit.
        </p>
      )}
    </div>
  )
}

// ---- EMBED ----

function EmbedEditor({ data, onChange, autoFocus }: BEProps) {
  const [open, setOpen] = useState(autoFocus || !data.link)

  return (
    <div>
      {data.link && <BlogEmbed link={data.link} height={data.height || "400"} />}
      {open ? (
        <div className={panelCls}>
          <div>
            <label className={labelCls}>Embed URL</label>
            <input autoFocus type="url" value={data.link} onChange={e => onChange({ ...data, link: e.target.value })} placeholder="https://www.youtube.com/embed/…" className={fieldCls} />
          </div>
          <div>
            <label className={labelCls}>Height (px)</label>
            <input type="number" min={50} value={data.height || "400"} onChange={e => onChange({ ...data, height: e.target.value })} className="bg-zinc-800 px-2 py-0.5 text-sm rounded outline-none w-24" />
          </div>
          <button type="button" onClick={() => setOpen(false)} className="text-xs text-zinc-500 hover:text-white">Done</button>
        </div>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="text-xs text-zinc-600 hover:text-zinc-400 mt-1">Edit embed ↑</button>
      )}
    </div>
  )
}

// ---- BUTTON ----

function ButtonEditor({ data, onChange, autoFocus }: BEProps) {
  const [open, setOpen] = useState(autoFocus || !data.text)
  const isFit = data.fit === "true"

  return (
    <div>
      {data.text && (
        <BlogButton
          link={data.link || "#"}
          text={data.text}
          variant={data.variant || "outline"}
          direction={data.direction || "center"}
          fit={isFit}
        />
      )}
      {open ? (
        <div className={panelCls}>
          <div>
            <label className={labelCls}>Button text</label>
            <input autoFocus value={data.text || ""} onChange={e => onChange({ ...data, text: e.target.value })} placeholder="Download" className={fieldCls} />
          </div>
          <div>
            <label className={labelCls}>Link URL</label>
            <input type="url" value={data.link || ""} onChange={e => onChange({ ...data, link: e.target.value })} placeholder="https://…" className={fieldCls} />
          </div>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className={labelCls}>Variant</label>
              <select value={data.variant || "outline"} onChange={e => onChange({ ...data, variant: e.target.value })} className="bg-zinc-800 px-2 py-1 text-sm rounded outline-none">
                {["outline","default","secondary","ghost","link"].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Alignment</label>
              <select value={data.direction || "center"} onChange={e => onChange({ ...data, direction: e.target.value })} className="bg-zinc-800 px-2 py-1 text-sm rounded outline-none">
                <option value="start">Left</option>
                <option value="center">Center</option>
                <option value="end">Right</option>
              </select>
            </div>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="checkbox" checked={isFit} onChange={e => onChange({ ...data, fit: e.target.checked ? "true" : "false" })} />
              Fit width
            </label>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="text-xs text-zinc-500 hover:text-white">Done</button>
        </div>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="text-xs text-zinc-600 hover:text-zinc-400 mt-1">Edit button ↑</button>
      )}
    </div>
  )
}

// ---- CANVAS ----

function CanvasEditor({ data, onChange, autoFocus }: BEProps) {
  const [editing, setEditing] = useState(autoFocus || !data.code)

  return (
    <div>
      {!editing && data.code && (
        <div className="cursor-pointer" onClick={() => setEditing(true)}>
          <CanvasRunner
            code={data.code}
            mode={data.mode === "3d" ? "3d" : "2d"}
            height={Number(data.height || 400)}
          />
        </div>
      )}
      {editing && (
        <div className={panelCls}>
          <textarea
            autoFocus
            value={data.code}
            onChange={e => {
              e.target.style.height = "auto"
              e.target.style.height = e.target.scrollHeight + "px"
              onChange({ ...data, code: e.target.value })
            }}
            placeholder="// canvas code…"
            className="w-full bg-zinc-950 font-mono text-sm p-3 outline-none resize-none min-h-28 rounded"
            rows={6}
            spellCheck={false}
          />
          <div className="flex gap-4 items-end flex-wrap">
            <div>
              <label className={labelCls}>Mode</label>
              <select value={data.mode || "2d"} onChange={e => onChange({ ...data, mode: e.target.value })} className="bg-zinc-800 px-2 py-1 text-sm rounded outline-none">
                <option value="2d">2D</option>
                <option value="3d">3D</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Height (px)</label>
              <input type="number" min={50} value={data.height || "400"} onChange={e => onChange({ ...data, height: e.target.value })} className="bg-zinc-800 px-2 py-0.5 text-sm rounded outline-none w-24" />
            </div>
          </div>
          {data.code && (
            <button type="button" onClick={() => setEditing(false)} className="text-xs text-zinc-500 hover:text-white">Preview ↑</button>
          )}
        </div>
      )}
      {!editing && !data.code && (
        <p className="text-zinc-600 italic text-sm cursor-pointer py-2" onClick={() => setEditing(true)}>
          Empty canvas. Click to edit.
        </p>
      )}
    </div>
  )
}

// ---- Main BlocksEditor ----

interface BlocksEditorProps {
  blocks: EditorBlock[]
  setBlocks: (blocks: EditorBlock[]) => void
}

export function BlocksEditor({ blocks, setBlocks }: BlocksEditorProps) {
  const [menuFor,   setMenuFor]   = useState<string | null>(null)
  const [dragId,    setDragId]    = useState<string | null>(null)
  const [dropId,    setDropId]    = useState<string | null>(null)
  const [focusId,   setFocusId]   = useState<string | null>(null)
  const [slashVal,  setSlashVal]  = useState("")
  const [slashOpen, setSlashOpen] = useState(false)
  const [slashQ,    setSlashQ]    = useState("")
  const [slashIdx,  setSlashIdx]  = useState(0)
  const slashRef     = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragIdRef    = useRef<string | null>(null)
  const dropIdRef    = useRef<string | null>(null)
  const blocksRef    = useRef(blocks)

  useEffect(() => { blocksRef.current = blocks }, [blocks])

  // Non-passive touchmove so we can call preventDefault and prevent scroll while dragging
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onMove = (e: TouchEvent) => {
      if (!dragIdRef.current) return
      e.preventDefault()
      const touch = e.touches[0]
      const hit   = document.elementFromPoint(touch.clientX, touch.clientY)
      const row   = hit?.closest('[data-block-id]') as HTMLElement | null
      const id    = row?.dataset.blockId ?? null
      if (id && id !== dragIdRef.current) {
        dropIdRef.current = id
        setDropId(id)
      }
    }
    el.addEventListener('touchmove', onMove, { passive: false })
    return () => el.removeEventListener('touchmove', onMove)
  }, [])

  const handleTouchEnd = () => {
    const from = dragIdRef.current
    const to   = dropIdRef.current
    if (from && to && from !== to) {
      const arr = [...blocksRef.current]
      const fi  = arr.findIndex(b => b._id === from)
      const ti  = arr.findIndex(b => b._id === to)
      if (fi !== -1 && ti !== -1) {
        const [item] = arr.splice(fi, 1)
        arr.splice(ti, 0, item)
        setBlocks(arr)
      }
    }
    dragIdRef.current = null
    dropIdRef.current = null
    setDragId(null)
    setDropId(null)
  }

  const insert = (type: BlockType) => {
    const id = makeId()
    setBlocks([...blocks, { _id: id, type, data: defaultBlockData(type) }])
    setFocusId(id)
    setSlashVal("")
    setSlashOpen(false)
  }

  const update = (id: string, data: Record<string, string>) =>
    setBlocks(blocks.map(b => b._id === id ? { ...b, data } : b))

  const remove = (id: string) => {
    setBlocks(blocks.filter(b => b._id !== id))
    setMenuFor(null)
  }

  const filtered = BLOCK_OPTIONS.filter(o =>
    !slashQ ||
    o.label.toLowerCase().startsWith(slashQ.toLowerCase()) ||
    o.type.toLowerCase().startsWith(slashQ.toLowerCase())
  )

  const handleSlashKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!slashOpen) return
    if (e.key === "ArrowDown")  { e.preventDefault(); setSlashIdx(i => Math.min(i + 1, filtered.length - 1)) }
    else if (e.key === "ArrowUp")    { e.preventDefault(); setSlashIdx(i => Math.max(i - 1, 0)) }
    else if (e.key === "Enter") { e.preventDefault(); const c = filtered[slashIdx]; if (c) insert(c.type) }
    else if (e.key === "Escape") { setSlashOpen(false); setSlashVal("") }
  }

  const renderBlock = (block: EditorBlock) => {
    const props: BEProps = {
      data: block.data,
      onChange: d => update(block._id, d),
      autoFocus: focusId === block._id,
    }
    switch (block.type) {
      case "TEXT":   return <TextEditor   {...props} />
      case "IMAGE":  return <ImageEditor  {...props} />
      case "VIDEO":  return <VideoEditor  {...props} />
      case "CODE":   return <CodeEditor   {...props} />
      case "EMBED":  return <EmbedEditor  {...props} />
      case "BUTTON": return <ButtonEditor {...props} />
      case "CANVAS": return <CanvasEditor {...props} />
    }
  }

  return (
    <div ref={containerRef} className="relative" onTouchEnd={handleTouchEnd}>

      {/* Click-away overlay for block menu */}
      {menuFor && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuFor(null)} />
      )}

      {blocks.map(block => (
        <div
          key={block._id}
          data-block-id={block._id}
          className={`group relative flex items-start gap-1 my-1 transition-opacity ${dragId === block._id ? "opacity-30" : ""}`}
          onDragOver={e => { e.preventDefault(); setDropId(block._id) }}
          onDrop={e => {
            e.preventDefault()
            if (!dragId || dragId === block._id) { setDragId(null); return }
            const arr  = [...blocks]
            const from = arr.findIndex(b => b._id === dragId)
            const to   = arr.findIndex(b => b._id === block._id)
            if (from === -1 || to === -1) return
            const [item] = arr.splice(from, 1)
            arr.splice(to, 0, item)
            setBlocks(arr)
            setDragId(null)
            setDropId(null)
          }}
        >
          {/* Drop line */}
          {dropId === block._id && dragId !== block._id && (
            <div className="absolute -top-px left-0 right-0 h-0.5 bg-blue-500 rounded pointer-events-none z-10" />
          )}

          {/* Drag handle */}
          <div className="relative flex-shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity mt-1">
            <button
              type="button"
              draggable
              onDragStart={() => { dragIdRef.current = block._id; setDragId(block._id) }}
              onDragEnd={() => { dragIdRef.current = null; dropIdRef.current = null; setDragId(null); setDropId(null) }}
              onTouchStart={() => { dragIdRef.current = block._id; setDragId(block._id) }}
              onClick={() => setMenuFor(p => p === block._id ? null : block._id)}
              className="text-zinc-600 hover:text-zinc-300 cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-zinc-800 relative z-50 touch-none"
              title="Drag to reorder · click for options"
            >
              <GripVertical size={16} />
            </button>

            {menuFor === block._id && (
              <div className="absolute left-0 top-7 z-50 bg-zinc-900 border border-zinc-700 rounded shadow-xl py-1 w-36">
                <button
                  type="button"
                  onClick={() => remove(block._id)}
                  className="w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-zinc-800 flex items-center gap-2"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">{renderBlock(block)}</div>
        </div>
      ))}

      {/* Slash command input */}
      <div className="relative mt-2 ml-6">
        <input
          ref={slashRef}
          value={slashVal}
          onChange={e => {
            const v = e.target.value
            setSlashVal(v)
            if (v.startsWith("/")) { setSlashOpen(true); setSlashQ(v.slice(1)); setSlashIdx(0) }
            else setSlashOpen(false)
          }}
          onKeyDown={handleSlashKey}
          onBlur={() => setTimeout(() => setSlashOpen(false), 120)}
          placeholder="Type / to insert a block…"
          className="w-full bg-transparent text-zinc-600 outline-none py-2 text-sm"
        />

        {slashOpen && filtered.length > 0 && (
          <div className="absolute left-0 top-full z-50 bg-zinc-900 border border-zinc-700 rounded shadow-xl w-72">
            {filtered.map((opt, i) => (
              <button
                key={opt.type}
                type="button"
                className={`w-full text-left px-3 py-2 flex items-center gap-3 ${i === slashIdx ? "bg-zinc-700" : "hover:bg-zinc-800"}`}
                onMouseDown={() => insert(opt.type)}
              >
                <span className="w-6 text-center text-sm">{opt.icon}</span>
                <div>
                  <div className="text-sm font-medium">{opt.label}</div>
                  <div className="text-xs text-zinc-500">{opt.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
