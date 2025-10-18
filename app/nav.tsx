"use client"
import LanguageSwitcher from "@/components/lang/languageSwitcher";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Nav(){
    const [drown, setDrown] = useState(false)
      useEffect(() => {
        const handleResize = () => {
        setDrown(innerWidth < 1100? true : false)
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);
    return(
        <>
        <div className="w-full flex items-center justify-between p-4">
            {!drown && 
            <div className="w-full flex items-center gap-6 justify-start">
                <Link href="/cv">CURRICULUM VITAE</Link>
                <Link href="projects">PROJECTS</Link>
                <Link href="blog">BLOG</Link>
                <Link href="about">ABOUT</Link>
                <Link href="contact">CONTACT</Link>
            </div>
            }

            <Link href="/" className={`w-full flex ${!drown?"justify-center":"justify-start"}`}>Gravadox</Link>
            <div className="w-full flex justify-end"><LanguageSwitcher /></div>
        </div>
                {drown && 
            <div className="w-full flex items-center gap-6 justify-between px-4">
                <Link href="/cv">CURRICULUM VITAE</Link>
                <Link href="projects">PROJECTS</Link>
                <Link href="blog">BLOG</Link>
                <Link href="about">ABOUT</Link>
                <Link href="contact">CONTACT</Link>
            </div>
        }

        </>

    )
}