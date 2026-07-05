"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Canvas Reveal (inspired by Aceternity's Canvas Reveal Effect, rebuilt on
 * plain 2D canvas so utility pages don't pay the three.js cost).
 * On hover, a field of accent dots animates in radially — memories surfacing.
 */
export function CanvasRevealCard({
  children,
  className = "",
  dotSize = 2.4,
  gap = 14,
}: {
  children: ReactNode;
  className?: string;
  dotSize?: number;
  gap?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState(false);
  const raf = useRef(0);
  const progress = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Dot = { x: number; y: number; d: number; r: number };
    let dots: Dot[] = [];

    const accent = () =>
      getComputedStyle(document.body).getPropertyValue("--accent-rgb").trim() ||
      "255, 125, 60";

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const maxD = Math.hypot(cx, cy);
      dots = [];
      for (let x = gap / 2; x < rect.width; x += gap) {
        for (let y = gap / 2; y < rect.height; y += gap) {
          dots.push({
            x,
            y,
            d: Math.hypot(x - cx, y - cy) / maxD,
            r: 0.5 + Math.random() * 0.5,
          });
        }
      }
    };

    const draw = () => {
      const target = hovered ? 1 : 0;
      progress.current += (target - progress.current) * 0.07;
      if (Math.abs(target - progress.current) < 0.004) {
        progress.current = target;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (progress.current > 0.004) {
        const rgb = accent();
        for (const dot of dots) {
          // dots appear from center outward as progress grows
          const local = Math.max(
            0,
            Math.min(1, (progress.current - dot.d * 0.8) / 0.2),
          );
          if (local <= 0) continue;
          ctx.globalAlpha = local * 0.5 * dot.r;
          ctx.fillStyle = `rgb(${rgb})`;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dotSize * dot.r * local, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      raf.current = requestAnimationFrame(draw);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
    };
  }, [hovered, dotSize, gap]);

  return (
    <div
      ref={wrapRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn("card relative overflow-hidden", className)}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 [mask-image:radial-gradient(ellipse_at_center,white_30%,transparent_75%)]"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
