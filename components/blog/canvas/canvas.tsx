// components/blog/canvas/canvas.tsx
"use client"
import { useRef, useEffect } from "react"

interface Props {
  code: string
  mode?: "2d" | "3d"
  width?: number
  height?: number | string
}

export default function CanvasRunner({ code, mode = "2d", width = 768, height = 400 }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const doc = iframeRef.current?.contentDocument
    if (!doc) return

    const html = `<!DOCTYPE html>
<html>
<head>
<style>*{margin:0;padding:0;background:#09090b;}</style>
</head>
<body>
<canvas id="c" width="${width}" height="${height}" style="width:100%;height:auto;"></canvas>
<script>
(function() {
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('${mode === "3d" ? "webgl" : "2d"}');
  try { (new Function('ctx', 'canvas', ${JSON.stringify(code)}))(ctx, canvas); }
  catch(e) { console.error(e); }
})();
<\/script>
</body>
</html>`

    doc.open()
    doc.write(html)
    doc.close()
  }, [code, mode, width, height])

  return (
    <div className="w-full max-w-3xl mx-auto my-4">
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts"
        style={{ width: "100%", height: Number(height), border: "1px solid #27272a", display: "block" }}
        title="canvas"
      />
    </div>
  )
}