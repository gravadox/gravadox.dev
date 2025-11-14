import { BlockType } from "./lib/generated/prisma/enums"
import { JsonValue } from "./lib/generated/prisma/internal/prismaNamespace"

export interface TextData { text: string }
export interface ImageData { src: string }
export interface VideoData { src: string }
export interface CodeData {
  code: string
  language: string
  file?: string
  hideLanguage?: string
  showLineNumbers?: string
}
export interface CanvasData {
  code: string
  mode?: string
  height?: string | number
}
export interface ButtonData {
  link: string
  text: string
  variant?: string
  direction?: string
  fit?: string
}
export interface EmbedData {
  link: string
  height?: string | number
}

export interface Block {
        id: string;
        createdAt: Date;
        type: BlockType;
        data: JsonValue;
        postId: string | null;
        appId: string | null;
    
}
export interface Post{
    id: string;
    title: string;
    description: string | null;
    banner: string | null;
    slug: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    publishAt: Date | null;
    pinned: number | null;
    blocks: Block[]
}

export interface DownloadInput {
  name: string
  link: string
}

export interface App{
    id: string;
    title: string;
    description: string | null;
    banner: string | null;
    version?: string | null
    slug: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    publishAt: Date | null;
    pinned: number | null;
    blocks: Block[]
    downloads: DownloadInput[]
    github?: string | null
    icon?: string | null
}