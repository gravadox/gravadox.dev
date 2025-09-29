"use client"
import LanguageSwitcher from "@/components/lang/languageSwitcher";
import Link from "next/link";

export default function Nav(){
    return(
        <div className="w-full flex items-center justify-between p-4">
            <div className="w-full flex items-center gap-6 justify-start">
                <Link href="/cv">CURRICULUM VITAE</Link>
                <Link href="projects">PROJECTS</Link>
                <Link href="blog">BLOG</Link>
                <Link href="about">ABOUT</Link>
                <Link href="contact">CONTACT</Link>
            </div>

            <Link href="/" className="w-full flex justify-center">Gravadox</Link>
            <div className="w-full flex justify-end"><LanguageSwitcher /></div>
        </div>
    )
}