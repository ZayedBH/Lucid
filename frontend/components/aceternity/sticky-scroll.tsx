"use client";

import { ReactNode, useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { cn } from "@/lib/utils";

export type StickyScrollItem = {
  title: string;
  description: ReactNode;
  content: ReactNode;
};

/**
 * Sticky Scroll Reveal (adapted from Aceternity UI) — text sections scroll
 * on the left while a sticky panel on the right cross-fades between
 * visuals. Stacks vertically on mobile.
 */
export function StickyScroll({
  items,
  className = "",
}: {
  items: StickyScrollItem[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.35", "end 0.6"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const breakpoints = items.map((_, i) => i / items.length);
    const closest = breakpoints.reduce((acc, bp, i) => {
      return Math.abs(latest - bp) < Math.abs(latest - breakpoints[acc])
        ? i
        : acc;
    }, 0);
    setActive(closest);
  });

  return (
    <div ref={ref} className={cn("relative flex gap-10", className)}>
      {/* Scrolling text */}
      <div className="w-full lg:w-1/2">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex min-h-[24rem] flex-col justify-center py-10 lg:min-h-[28rem]"
          >
            <motion.h3
              animate={{ opacity: active === i ? 1 : 0.25 }}
              transition={{ duration: 0.4 }}
              className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl"
            >
              {item.title}
            </motion.h3>
            <motion.div
              animate={{ opacity: active === i ? 1 : 0.25 }}
              transition={{ duration: 0.4 }}
              className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-muted"
            >
              {item.description}
            </motion.div>
            {/* Mobile inline visual */}
            <div className="mt-8 lg:hidden">{item.content}</div>
          </div>
        ))}
      </div>

      {/* Sticky visual (desktop) */}
      <div className="hidden w-1/2 lg:block">
        <div className="sticky top-28 flex h-[28rem] items-center">
          <div className="relative h-full w-full">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  opacity: active === i ? 1 : 0,
                  scale: active === i ? 1 : 0.96,
                }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className={cn(
                  "absolute inset-0",
                  active === i ? "z-10" : "pointer-events-none z-0",
                )}
              >
                {item.content}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
