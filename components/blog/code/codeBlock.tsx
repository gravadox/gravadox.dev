"use client"

import { Highlight } from "prism-react-renderer"
import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { monochromeDark } from "./codeBlockTheme"

interface CodeBlockProps {
  language: string
  code: string
  file?: string
  showLineNumbers?: boolean
  hideLanguage?: boolean
  className?: string
}

export default function CodeBlock({ language, code, showLineNumbers = true, hideLanguage=false, file, className = "" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)


  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative w-full overflow-x-hidden my-4">
    <div className={`overflow-hidden  border-border bg-zinc-950 overflow-x-auto ${className} p-2`}>
      <div className="flex items-center justify-between px-4 bg-zinc-950 py-1 w-full">
        {!hideLanguage &&
        <span className="text-sm font-mono text-muted-foreground">{language}</span>
        }
        {file && 
        <span className="text-sm font-mono text-muted-foreground">{file}</span>
        }
        <Button variant="ghost" size="sm" onClick={handleCopy} className={`px-2 ${(hideLanguage && !file)? "absolute right-1 top-3":""} bg-zinc-950`}>
          {copied ? <Check className="h-2 w-2" /> : <Copy className="h-2 w-2" />}
        </Button>
      </div>
      <Highlight theme={monochromeDark} code={code.trim()} language={language}>
        {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${highlightClassName} bg-zinc-950 pb-2 pr-8 w-fit`}
            style={{
              margin: 0,
              fontSize: "0.875rem",
              fontFamily: "var(--font-mono)",
            }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {showLineNumbers && (
                  <span className="inline-block w-10 select-none text-muted-foreground/50 text-center mr-2">{i + 1}</span>
                )}
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
    </div>
  )
}
