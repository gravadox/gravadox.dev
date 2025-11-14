import Image from "next/image";

interface BlogImageProps{
    src: string
    alt?: string
    href?: string
}
export default function BlogImage({src,alt, href}:BlogImageProps){
    return(
        <a href={href || undefined} className="w-full my-4">
            <Image
                src={src}
                alt={alt || "image"}
                width={1000}
                height={1000}
                className="w-full"
             />
        </a>
    )
}