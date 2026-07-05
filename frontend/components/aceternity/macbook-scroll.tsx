"use client";

import { ReactNode, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Macbook Scroll (adapted from Aceternity UI, simplified) — a laptop whose
 * lid opens and whose screen image scales up out of the chassis as you
 * scroll. Keyboard is stylized CSS rather than the full key map.
 */
export function MacbookScroll({
  src,
  title,
  className = "",
}: {
  src: string;
  title?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scaleX = useTransform(scrollYProgress, [0, 0.3], [1.2, 1.6]);
  const scaleY = useTransform(scrollYProgress, [0, 0.3], [0.6, 1.6]);
  const translate = useTransform(scrollYProgress, [0, 0.6], [0, 620]);
  const rotate = useTransform(scrollYProgress, [0.05, 0.12, 0.3], [-28, -28, 0]);
  const textTransform = useTransform(scrollYProgress, [0, 0.3], [0, 80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div
      ref={ref}
      className={cn(
        "flex min-h-[130vh] shrink-0 scale-[0.42] transform flex-col items-center justify-start py-0 sm:scale-60 md:scale-100 md:py-24",
        className,
      )}
    >
      <motion.h2
        style={{ translateY: textTransform, opacity: textOpacity }}
        className="mb-16 text-center font-display text-3xl font-medium tracking-tight text-ink sm:text-5xl text-balance"
      >
        {title}
      </motion.h2>

      {/* Lid */}
      <div className="relative [perspective:800px]" style={{ perspective: "800px" }}>
        <div
          style={{
            transform: "perspective(800px) rotateX(-25deg) translateZ(0px)",
            transformOrigin: "bottom",
            transformStyle: "preserve-3d",
          }}
          className="relative h-[12rem] w-[32rem] rounded-2xl bg-[#0b0b0d] p-2"
        >
          <span className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center text-faint">
            <LucidGlyph />
          </span>
        </div>
        <motion.div
          style={{
            scaleX,
            scaleY,
            rotateX: rotate,
            translateY: translate,
            transformStyle: "preserve-3d",
            transformOrigin: "top",
          }}
          className="absolute inset-0 h-96 w-[32rem] rounded-2xl bg-[#010101] p-2"
        >
          <div className="absolute inset-0 rounded-lg bg-[#272729]" />
          <Image
            src={src || "/placeholder.svg"}
            alt="Lucid dashboard on a laptop screen"
            fill
            className="absolute inset-0 h-full w-full rounded-lg object-cover object-left-top"
          />
        </motion.div>
      </div>

      {/* Base */}
      <div className="relative -z-10 h-[22rem] w-[32rem] overflow-hidden rounded-2xl bg-[#0f0f11]">
        {/* above keyboard bar */}
        <div className="relative h-10 w-full">
          <div className="absolute inset-x-0 mx-auto h-4 w-[80%] bg-[#050505]" />
        </div>
        <div className="relative flex">
          <div className="mx-auto h-full w-[10%] overflow-hidden" />
          <div className="mx-auto h-full w-[80%]">
            <Keypad />
          </div>
          <div className="mx-auto h-full w-[10%] overflow-hidden" />
        </div>
        {/* trackpad */}
        <div
          className="mx-auto my-2 h-24 w-[40%] rounded-xl"
          style={{
            boxShadow: "0px 0px 1px 1px #00000020 inset",
            background: "#1a1a1c",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 mx-auto h-2 w-20 rounded-tl-3xl rounded-tr-3xl bg-gradient-to-t from-[#272729] to-[#050505]" />
      </div>
    </div>
  );
}

function Keypad() {
  return (
    <div className="mx-1 grid h-full grid-cols-14 gap-[3px] rounded-md p-1">
      {Array.from({ length: 70 }).map((_, i) => (
        <div
          key={i}
          className="rounded-[3.5px] bg-[#0A090D] p-[2px]"
          style={{
            height: "1.4rem",
            boxShadow:
              "0px -0.5px 2px 0 #0D0D0F inset, -0.5px 0px 2px 0 #0D0D0F inset",
          }}
        />
      ))}
    </div>
  );
}

function LucidGlyph() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
      <circle
        cx="16"
        cy="16"
        r="13"
        stroke="var(--color-accent)"
        strokeWidth="1.4"
        opacity="0.5"
      />
      <circle cx="16" cy="16" r="6" fill="var(--color-accent)" opacity="0.7" />
    </svg>
  );
}
