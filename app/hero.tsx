"use client";
import { useState, useEffect } from "react";
import Typer from "@/components/typing/typer";
import Link from "next/link";
import { useAppTranslation } from "@/components/lang/useAppTranslation";

export default function Hero() {
  const {t} = useAppTranslation()
  const links = ["Github", "Discord", "Youtube", "X", "Instagram"];
  const hrefs = [
    "https://github.com/gravadox",
    "https://discord.gg/fvtjNmE3Uw",
    "https://youtube.com/@gravadox",
    "https://x.com/gravadox",
    "https://instagram.com/gravadoxx",
  ];

  const [step, setStep] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [margin, setMargin] = useState(false);

  useEffect(() => {
    if (step === 2) setTimeout(() => setActiveIndex(0), 200);
  }, [step]);

  useEffect(() => {
    if (activeIndex === links.length && step === 2)
      setTimeout(() => setStep(3), 500);
  }, [activeIndex, step]);

  useEffect(() => {
    const handleResize = () => setMargin(innerWidth < 700);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <div
        style={{ minHeight: "188px" }}
        className={`${margin ? "pt-24" : "pt-40"} min-h-[258] pr-4`}
      >
        <div className="min-w-64">
          <p>
            <Typer
              text={t("hero.title")}
              speed={25}
              start={step === 0}
              onFinish={() => setStep(1)}
            />
          </p>

          {step >= 1 && (
            <div className="secondary">
              <Typer
                speed={10}
                start={step === 1}
                text={t("hero.description")}
                onFinish={() => setStep(2)}
              />
            </div>
          )}

          {step >= 2 && (
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

              {step >= 3 && (
                <Link className="secondary-plus"
                href="mailto:contact@gravadox.dev"
                >
                  <Typer
                    text={"contact@gravadox.dev"}
                    speed={15}
                    start={step === 3}
                  />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
