"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Lamp section header (adapted from Aceternity UI "Lamp Effect").
 * Recolored via --accent-rgb so it inherits each tab's theme.
 */
export function LampHeader({
  children,
  className = "",
  compact = false,
}: {
  children: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative z-0 flex w-full flex-col items-center justify-center overflow-hidden",
        compact ? "min-h-[24rem]" : "min-h-[34rem]",
        className,
      )}
    >
      <div
        className={cn(
          "relative isolate z-0 flex w-full flex-1 scale-y-125 items-center justify-center",
        )}
      >
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage:
              "conic-gradient(from 70deg at center top, rgba(var(--accent-rgb),0.65), transparent, transparent)",
          }}
          className="absolute inset-auto right-1/2 h-56 w-[30rem] overflow-visible [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute bottom-0 left-0 z-20 h-40 w-full bg-paper [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute bottom-0 left-0 z-20 h-full w-40 bg-paper [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage:
              "conic-gradient(from 290deg at center top, transparent, transparent, rgba(var(--accent-rgb),0.65))",
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem]"
        >
          <div className="absolute bottom-0 right-0 z-20 h-full w-40 bg-paper [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute bottom-0 right-0 z-20 h-40 w-full bg-paper [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-paper blur-2xl" />
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />
        <div
          className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full opacity-50 blur-3xl"
          style={{ background: "rgba(var(--accent-rgb),0.5)" }}
        />
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-24 rounded-full blur-2xl"
          style={{ background: "rgba(var(--accent-rgb),0.4)" }}
        />
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-28"
          style={{ background: "var(--color-accent-soft)" }}
        />
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-paper" />
      </div>

      <div
        className={cn(
          "relative z-50 flex flex-col items-center px-5 text-center",
          compact ? "-translate-y-48" : "-translate-y-56",
        )}
      >
        {children}
      </div>
    </div>
  );
}
