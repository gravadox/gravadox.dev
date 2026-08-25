"use client"
import LanguageSwitcher from "@/components/lang/languageSwitcher";
import { useAppTranslation } from "@/components/lang/useAppTranslation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Nav(){
    const {t} = useAppTranslation()
    const [drown, setDrown] = useState(false)

        const handleScroll = (
            e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, 
            targetId: string
            ): void => {
            e.preventDefault();
            if(window.location.pathname != "/"){window.location.href = `/#${targetId}`; return}
            const targetElement = document.getElementById(targetId);
    
            if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
            }
  };
      useEffect(() => {
        const handleResize = () => {
        setDrown(innerWidth < 1100? true : false)
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);
    return(
        <div className="w-full bg-black p-2">
        <div className="w-full flex items-center justify-between px-2 py-4">
            {!drown && 
            <div className="w-full flex items-center gap-6 justify-start">
                <Link href="/projects">{t("nav.projects")}</Link>
                <Link href="/blog">{t("nav.blog")}</Link>
                <Link href="/#products" onClick={(e)=>{handleScroll(e,"products")}}>{t("nav.products")}</Link>
                <Link href="/about">{t("nav.about")}</Link>
                <Link href="/contact">{t("nav.contact")}</Link>
            </div>
            }

            <Link href="/" className={`w-full flex ${!drown?"justify-center":"justify-start"}`}>Gravadox</Link>
            <div className="w-full flex justify-end"><LanguageSwitcher /></div>
        </div>
                {drown && 
            <div className="w-full flex items-center gap-6 justify-between px-2">
                <Link href="/projects">{t("nav.projects")}</Link>
                <Link href="/blog">{t("nav.blog")}</Link>
                <Link href="/#products">{t("nav.products")}</Link>
                <Link href="/about">{t("nav.about")}</Link>
                <Link href="/contact">{t("nav.contact")}</Link>
            </div>
        }

        </div>

    )
}