
export default function BlogEmbed({link, height}:{link: string; height: number | string;}){
    return(
        <iframe height={height} className="w-full bg-zinc-950 my-4" src={link}>
        </iframe>
    )
}

