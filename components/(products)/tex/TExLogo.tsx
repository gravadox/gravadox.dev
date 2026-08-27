"use client";

import { useEffect, useRef } from "react";

type Dot = {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

function buildTMask(size?: number): number[][] {
  const cols = 20;
  const rows = 24;
  const mask: number[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(0)
  );

  for (let r = 0; r < 3; r++) {
    for (let c = 1; c < cols - 1; c++) mask[r][c] = 1;
  }

  const stemStart = 8;
  const stemEnd = 12;
  for (let r = 3; r < rows; r++) {
    let start = stemStart;
    let end = stemEnd;
    if (r === 3) {
      start -= 2;
      end += 2;
    } else if (r === 4) {
      start -= 1;
      end += 1;
    }
    for (let c = start; c < end; c++) mask[r][c] = 1;
  }

  return mask;
}

interface Options{
    size?: number;
    padding?: number;
    repel_radius?: number;
    repel_strength?: number;
    friction?: number;
    spring?: number;
}

export default function TExLogo({size, padding, repel_radius, repel_strength, friction, spring}: Options  ) {

  const REPEL_STRENGTH = repel_strength || 55;
  const SPRING = spring || 0.08;
  const FRICTION = friction || 0.82;
  const CANVAS_SIZE = size || 170;
  const PADDING = padding || 30; 
  const REPEL_RADIUS = repel_radius || 50;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotsRef = useRef<Dot[]>([]);
  const dotRadiusRef = useRef(3);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mask = buildTMask(size);
    const rows = mask.length;
    const cols = mask[0].length;

    const available = CANVAS_SIZE - PADDING * 2;
    const SPACING = Math.min(available / cols, available / rows);

    const DOT_RADIUS = SPACING / 4;
    dotRadiusRef.current = DOT_RADIUS;
    const glyphW = cols * SPACING;
    const glyphH = rows * SPACING;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const w = CANVAS_SIZE;
      const h = CANVAS_SIZE;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const offsetX = (w - glyphW) / 2;
      const offsetY = (h - glyphH) / 2;

      const dots: Dot[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (!mask[r][c]) continue;
          const x = offsetX + c * SPACING + SPACING / 2;
          const y = offsetY + r * SPACING + SPACING / 2;
          dots.push({ homeX: x, homeY: y, x, y, vx: 0, vy: 0 });
        }
      }
      dotsRef.current = dots;
    }

    resize();
    window.addEventListener("resize", resize);

    function setPointer(clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect();
      pointerRef.current.x = clientX - rect.left;
      pointerRef.current.y = clientY - rect.top;
      pointerRef.current.active = true;
    }

    function onPointerMove(e: PointerEvent) {
      setPointer(e.clientX, e.clientY);
    }
    function onPointerLeave() {
      pointerRef.current.active = false;
    }

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    function tick() {
      const w = canvas!.width / dpr;
      const h = canvas!.height / dpr;
      ctx!.clearRect(0, 0, w, h);

      const p = pointerRef.current;

      for (const dot of dotsRef.current) {
        let targetX = dot.homeX;
        let targetY = dot.homeY;

        if (p.active) {
          const dx = dot.x - p.x;
          const dy = dot.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          if (dist < REPEL_RADIUS) {
            const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
            targetX = dot.homeX + (dx / dist) * force;
            targetY = dot.homeY + (dy / dist) * force;
          }
        }

        dot.vx = (dot.vx + (targetX - dot.x) * SPRING) * FRICTION;
        dot.vy = (dot.vy + (targetY - dot.y) * SPRING) * FRICTION;
        dot.x += dot.vx;
        dot.y += dot.vy;

        ctx!.beginPath();
        ctx!.arc(dot.x, dot.y, dotRadiusRef.current, 0, Math.PI * 2);
        ctx!.fillStyle = "#ffffff";
        ctx!.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div
      className="relative"
      style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}