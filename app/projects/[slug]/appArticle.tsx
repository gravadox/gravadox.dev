
import TextBlock from "@/components/blog/text/text"
import ImageBlock from "@/components/blog/image/blogImage"
import VideoBlock from "@/components/blog/video/videoPlayer"
import CodeBlock from "@/components/blog/code/codeBlock"
import CanvasRunner from "@/components/blog/canvas/canvas"
import BlogButton from "@/components/blog/button/button"
import BlogEmbed from "@/components/blog/embed/blogEmbed"
import AppDownloadSection from "@/components/app/downloadButton"
import { App } from "@/types"
import Image from "next/image"

interface TextData { text: string }
interface ImageData { src: string }
interface VideoData { src: string }
interface CodeData {
  code: string
  language: string
  file?: string
  hideLanguage?: string
  showLineNumbers?: string
}
interface CanvasData {
  code: string
  mode?: string
  height?: string | number
}
interface ButtonData {
  link: string
  text: string
  variant?: string
  direction?: string
  fit?: string
}
interface EmbedData {
  link: string
  height?: string | number
}


export default async function AppArticle({app}:{app:App}) {
  
  return (
    <div className="max-w-3xl overflow-hidden mx-auto p-4">
      <div className="aspect-[10/4] overflow-hidden w-full mb-4">
        {app.banner && (
          <Image height={400} width={1000} src={app.banner} alt="Banner" className="w-full object-cover" />
        )}
      </div>
      <div className="flex gap-4 mb-4">
        {app.icon && (
          <Image height={100} width={100} src={app.icon} alt="Icon" className="w-24 h-24 rounded" />
        )}
        <div className="w-full">
          <h1 className="text-3xl font-bold">{app.title}</h1>
          <p className="text-zinc-600 text-sm sm:text-lg w-full whitespace-pre-line line-clamp-2 truncate" title={app.description || ""}>{app.description}</p>
        </div>
      </div>

      <AppDownloadSection downloads={app.downloads} github={app.github } />

      {app.tags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {app.tags.map((t, i) => (
            <span key={i} className="px-2 py-0.5 text-sm bg-zinc-900 text-zinc-400">
              {t}
            </span>
          ))}
        </div>
      )}

        {app.github && (
          <div className="text-zinc-600 flex justify-between w-full max-w-3xl">
            <div className="truncate">
              source: <a className="hover:underline" href={app.github ||""}>{app.github}</a>
            </div>
            {app.version && (
              <p className="min-w-25 truncate ml-6 pl-6 border-l">{app.version}</p>
            )}
            </div>
        )}
          {app.version && !app.github && (
              <p className="min-w-25 truncate text-right text-zinc-600">{app.version}</p>
          )}

{app.blocks.map((b, i) => {
  switch (b.type) {
    case "TEXT": {
      const data = b.data as unknown as TextData
      return <TextBlock key={i} text={data.text ?? ""} />
    }
    case "IMAGE": {
      const data = b.data as unknown as ImageData
      return <ImageBlock key={i} src={data.src ?? ""} />
    }
    case "VIDEO": {
      const data = b.data as unknown as VideoData
      return <VideoBlock key={i} src={data.src ?? ""} />
    }
    case "CODE": {
      const data = b.data as unknown as CodeData
      return (
        <CodeBlock
          key={i}
          code={data.code ?? ""}
          language={data.language ?? ""}
          file={data.file}
          hideLanguage={data.hideLanguage === "true"}
          showLineNumbers={data.showLineNumbers === "true"}
        />
      )
    }
    case "CANVAS": {
      const data = b.data as unknown as CanvasData
      return (
        <CanvasRunner
          key={i}
          code={data.code ?? ""}
          mode={data.mode === "3d" ? "3d" : "2d"}
          height={Number(data.height ?? 400)}
        />
      )
    }
    case "BUTTON": {
      const data = b.data as unknown as ButtonData
      return (
        <BlogButton
          key={i}
          link={data.link ?? ""}
          text={data.text ?? ""}
          variant={data.variant || ""}
          direction={data.direction}
          fit={data.fit === "true"}
        />
      )
    }
    case "EMBED": {
      const data = b.data as unknown as EmbedData
      return <BlogEmbed key={i} link={data.link ?? ""} height={data.height || "400"} />
    }
    default:
      return null
  }
})}


    </div>
  )
}
