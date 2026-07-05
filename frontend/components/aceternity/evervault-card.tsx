"use client";

import { ReactNode, useState } from "react";
import { motion, useMotionValue, useMotionTemplate } from "motion/react";
import { cn } from "@/lib/utils";

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function randomString(length: number) {
  let result = "";
  for (let i = 0; i < length; i++)
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  return result;
}

/**
 * Evervault Card (adapted from Aceternity UI) — encrypted-text hover
 * reveal with a themed gradient following the pointer. Wraps arbitrary
 * children instead of the original fixed circle.
 */
export function EvervaultCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [randomStr, setRandomStr] = useState(() => randomString(1500));

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
    setRandomStr(randomString(1500));
  }

  const maskImage = useMotionTemplate`radial-gradient(220px at ${mouseX}px ${mouseY}px, white, transparent)`;

  return (
    <div
      onMouseMove={onMouseMove}
      className={cn(
        "card group/evervault relative overflow-hidden",
        className,
      )}
    >
      {/* Encrypted text layer */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <motion.div
          className="absolute inset-0 opacity-0 mix-blend-overlay backdrop-blur-[1px] transition-opacity duration-500 group-hover/evervault:opacity-100"
          style={{
            maskImage,
            WebkitMaskImage: maskImage,
            background: `rgba(var(--accent-rgb),0.55)`,
          }}
        />
        <motion.div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/evervault:opacity-100"
          style={{ maskImage, WebkitMaskImage: maskImage }}
        >
          <p className="h-full whitespace-pre-wrap break-words p-4 font-mono text-xs font-bold leading-5 text-accent/80">
            {randomStr}
          </p>
        </motion.div>
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
