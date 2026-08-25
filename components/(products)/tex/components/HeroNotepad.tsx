'use client'

import { useRef, useState } from 'react'

const expansions: Record<string, string> = {
  '--sunglasses': '😎',
  '--shrug': '¯\\_(ツ)_/¯',
  '--heart': '♥',
  '--sig': 'oh no i know a dirty word',
  '--gmail': 'contact@tex.app',
  '--pr': 'pull-request-merge',
}

const defaultContent = [
  'Type --sunglasses anywhere...',
  'Expands into 😎',
  'Type --shrug',
  'Expands into ¯\\_(ツ)_/¯',
  'Type --heart and press space',
  ''
].join('\n')

function expandTrailingToken(value: string) {
  const match = value.match(/(^|\s)(--[^\s]*)(\s)$/)

  if (!match) {
    return value
  }

  const token = match[2].toLowerCase()
  const expansion = expansions[token]

  if (!expansion) {
    return value
  }

  const trailing = match[3]
  return `${value.slice(0, value.length - match[2].length - trailing.length)}${expansion}${trailing}`
}

export function HeroNotepad() {
  const [content, setContent] = useState(defaultContent)
  const [focused, setFocused] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)

  const lineCount = content.split('\n').length

  function handleChange(value: string) {
    setContent(expandTrailingToken(value))
  }

  function handleScroll() {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  return (
    <div className={`notepad" aria-label="Interactive TEx abbreviation notepad border-2 ${focused? "border-zinc-700": "border-zinc-800"}`}>
      <div className="notepad-bar">
        <span className="dot red" />
        <span className="dot amber" />
        <span className="dot green" />
        <span className="notepad-title">Notepad</span>
      </div>

      <div className="flex gap-4">
        <div className="notepad-gutter min-w-4 flex items-center flex-col text-[#ffffff6b]" ref={gutterRef} aria-hidden="true">
          {Array.from({ length: lineCount }, (_, index) => (
            <div className="notepad-line-number" key={index}>
              {index + 1}
            </div>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          className="w-full outline-none resize-none"
          aria-label="Type abbreviation commands"
          value={content}
          onChange={(event) => handleChange(event.target.value)}
          onScroll={handleScroll}
          spellCheck="false"
          autoComplete="off"
          autoFocus
          onFocus={()=>setFocused(true)}
          onBlur={()=>{setFocused(false)}}
        />
      </div>
    </div>
  )
}