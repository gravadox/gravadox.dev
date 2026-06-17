import { Button } from "@/components/ui/button";

interface ButtonProps{
    link: string;
    text: string;
    variant: string;
    direction?: string
    fit?: boolean
}

function safeHref(link: string): string {
  if (link.startsWith("/")) return link
  try {
    const url = new URL(link)
    if (url.protocol !== "http:" && url.protocol !== "https:") return "#"
    return link
  } catch {
    return "#"
  }
}

export default function BlogButton({link,text,variant, direction ="center", fit}: ButtonProps){
    return(
        <a target="_blank" rel="noopener noreferrer" href={safeHref(link)} className="my-4">
             <Button variant={variant as "default" | "link" | "destructive" | "outline" | "secondary" | "ghost" | "transparent" || "outline"} className={`w-full ${variant === "link"? `justify-start w-fit` : ""} justify-${direction} ${fit? "w-fit": "w-full"}`} >
                {text}
            </Button>
         </a>
    )
}