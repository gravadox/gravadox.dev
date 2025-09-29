"use client";

import { useEffect, useState } from "react";

interface TypingProps {
  text: string;
  speed?: number;
  start?: boolean; // whether typing should start
  onFinish?: () => void; // callback when done
}

export default function Typer({ text, speed = 50, start = true, onFinish }: TypingProps) {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);
  const [typing, setTyping] = useState(start);

  useEffect(() => {
    if (!start) return;

    if (index >= text.length) {
      setTyping(false);
      onFinish?.();
      return;
    }

    const timer = setTimeout(() => {
      setDisplayed((prev) => prev + text[index]);
      setIndex(index + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [index, text, speed, start, onFinish]);

  return (
    <span style={{ whiteSpace: "pre-line" }}>
      {displayed}
      {typing && <span className="caret">|</span>}
      <style jsx>{`
        .caret {
          display: inline-block;
          margin-left: 2px;
          width: 1ch;
          animation: blink 1s step-start infinite;
        }
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
}
