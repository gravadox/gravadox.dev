"use client";
import { useEffect, useRef } from "react";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let width = 0;
    let height = 0;
    let columns: number;
    let drops: number[];
    const fontSize = 14;
    const chars = "アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    function init() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;

      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(1);
    }

    function draw() {
      ctx.fillStyle = "rgba(21, 22, 24, 0.5)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#747A8C";
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, x) => {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, x * fontSize, y * fontSize);

        if (y * fontSize > height && Math.random() > 0.975) {
          drops[x] = 0;
        }
        drops[x]++;
      });
    }

    init();
    const interval = setInterval(draw, 33);

    const observer = new ResizeObserver(() => {
      init();
    });
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
