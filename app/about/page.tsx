"use client";
import { useState, useEffect } from "react";
import Typer from "@/components/typing/typer";
import Link from "next/link";
import Nav from "../nav";
import { useAppTranslation } from "@/components/lang/useAppTranslation";

export default function Hero() {
  const links = ["Github", "Discord", "Youtube", "X", "Instagram"];
  const hrefs = [
    "https://github.com/gravadox",
    "https://discord.gg/fvtjNmE3Uw",
    "https://youtube.com/@gravadox",
    "https://x.com/gravadox",
    "https://instagram.com/gravadoxx",
  ];
  const {t} = useAppTranslation()
  const lang = t("common.lang")
  const [text] = useState(lang === "EN"? process.env.NEXT_PUBLIC_ABOUT_EN: process.env.NEXT_PUBLIC_ABOUT_DE);
  const [step, setStep] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [margin, setMargin] = useState(false);

  useEffect(() => {
    if (step === 1) setTimeout(() => setActiveIndex(0), 200);
  }, [step]);

  useEffect(() => {
    const handleResize = () => setMargin(innerWidth < 700);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <Nav />
      <div style={{ minHeight: "188px" }} className={`p-4 ${margin ? "pt-24" : "pt-40"}`}>
        <div className="min-h-[258] pr-4 min-w-64 w-full flex flex-col justify-center items-center">
          <div className="lg:w-xl md:w-lg">
            <p>
              <Typer
                text={text ?? ""}
                speed={15}
                start={step === 0}
                onFinish={() => setStep(1)}
              />
            </p>

            {step >= 1 && (
              <div className="flex flex-col secondary-plus">
                <div className="flex items-center gap-4 min-h-6">
                  {links.map((link, i) => (
                    <Link key={link} href={hrefs[i]}>
                      <Typer
                        text={link}
                        start={i === activeIndex}
                        speed={10}
                        onFinish={() => setActiveIndex(i + 1)}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
