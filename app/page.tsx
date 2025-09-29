"use client";
import { useState } from "react";
import Typer from "@/components/typing/typer";
import Nav from "./nav";
import Link from "next/link";

export default function Home() {
  const links = ["Github", "Discord", "Youtube", "X", "Instagram"];
  const hrefs = ["https://github.com/gravadox","https://discord.com","https://youtube.com/@gravadox", "https://x.com/gravadox", "https://instagram.com/gravadoxx"]
  const [activeIndex, setActiveIndex] = useState(-1);

  // start the first after page render
  useState(() => {
    setTimeout(() => setActiveIndex(0), 600);
  });

  return (
    <div className="min-h-screen w-full">
      <Nav />
      <div className="w-full flex items-end p-16 gap-12">
        <div className="min-w-64">
          <h1 className="text-5xl min-h-24 mb-8">
            <Typer text={"welcome,\ni'm graham"} speed={25} />
          </h1>

          <div className="flex items-center gap-4 min-h-6 secondary">
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
        <div className="min-h-18 secondary pl-4 border-l">
          <Typer speed={10} text={"Software & web developer,\nThis is where I share my projects, experiments, and thoughts.\nfind more about me in the ABOUT page"} />
        </div>
      </div>
    </div>
  );
}
