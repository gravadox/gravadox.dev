import { notFound } from "next/navigation"
import TextBlock from "@/components/blog/text/text"
import ImageBlock from "@/components/blog/image/blogImage"
import VideoBlock from "@/components/blog/video/videoPlayer"
import CodeBlock from "@/components/blog/code/codeBlock"
import CanvasRunner from "@/components/blog/canvas/canvas"
import BlogButton from "@/components/blog/button/button"
import BlogEmbed from "@/components/blog/embed/blogEmbed"
import { ButtonData, CanvasData, CodeData, EmbedData, ImageData, Post, TextData, VideoData } from "@/types"
import Image from "next/image"

export default async function BlogArticle({post}: {post: Post}) {

  if (!post) return notFound()

  return (
    <div className="max-w-3xl overflow-hidden mx-auto py-12 px-4">
      <div className="">
        {post.banner && (
          <Image
            width={1000}
            height={600}
            src={post.banner}
            alt="Banner"
            className="w-full rounded mb-6 object-cover"
          />
        )}
      </div>


      <h1 className="text-4xl font-bold ">{post.title}</h1>
      <p className="text-lg text-zinc-600 max-w-3xl whitespace-pre-line mb-1 line-clamp-2 truncate"  title={post.description || ""}>
        {post.description}
      </p>

      {post.tags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-8">
          {post.tags.map((tag, i) => (
            <span key={i} className="px-2 py-0.5 text-sm bg-zinc-900">
              {tag}
            </span>
          ))}
        </div>
      )}

{post.blocks.map((b, i) => {
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
