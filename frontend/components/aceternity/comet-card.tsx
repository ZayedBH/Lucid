"use client";

import { ReactNode, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Comet Card (adapted from Aceternity UI) — 3D perspective tilt card
 * with a themed glare that follows the pointer.
 */
export function CometCard({
  children,
  className = "",
  rotateDepth = 10,
  translateDepth = 12,
}: {
  children: ReactNode;
  className?: string;
  rotateDepth?: number;
  translateDepth?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`${rotateDepth}deg`, `-${rotateDepth}deg`],
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`-${rotateDepth}deg`, `${rotateDepth}deg`],
  );
  const translateX = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`-${translateDepth}px`, `${translateDepth}px`],
  );
  const translateY = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`${translateDepth}px`, `-${translateDepth}px`],
  );

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [10, 90]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [10, 90]);
  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(var(--accent-rgb),0.14) 0%, rgba(var(--accent-rgb),0) 60%)`,
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className={cn("[perspective:1200px]", className)}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          translateX,
          translateY,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full will-change-transform"
      >
        {children}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 rounded-[1.25rem]"
          style={{ background: glareBackground }}
          aria-hidden="true"
        />
      </motion.div>
    </div>
  );
}
