"use client"
import Link from "next/link";
import { useAppTranslation } from "../lang/useAppTranslation";

const PRODUCTS:Product[] = [
    {name: "TEx", description: "TEx is a keyboard abbreviation app to replace the copy & paste headaches. \n Define short triggers that expand into text, emojis, links, or passwords.", url: "/tex"},
]

export type Product = {
    name: string;
    url: string;
    description?: string;
}
export default function Products(){
    const {t} = useAppTranslation()
    const handleMouseOver = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
        console.log("fuck")
        const title = e.currentTarget.querySelector("p");
        if(title) title.style.textDecoration = "underline"
    }
    const handleMouseOut = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
        const title = e.currentTarget.querySelector("p");
        if(title) title.style.textDecoration = "none"
    }

    return(
        <div id="products" className="p-20">
        <h3 className="text-xl mb-4">{t("nav.products")}</h3>
        {PRODUCTS.map((p,k)=>(
            <div onMouseOut={(e)=>{handleMouseOut(e)}} onMouseOver={(e)=>{handleMouseOver(e)}} key={k}>
            <Link href={p.url} className="flex flex-col hover:cursor-pointer">
                <p className="hover:underline">{p.name}</p>
                <p className="text-zinc-500 mb-2">{p.description}</p>
            </Link>
            </div>
        ))}
        <hr className="bg-zinc-950"></hr>
        </div>
    )
}