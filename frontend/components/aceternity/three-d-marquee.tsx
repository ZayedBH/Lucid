"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * 3D Marquee (adapted from Aceternity UI) — a tilted isometric plane of
 * tiles where alternating columns drift up / down forever. Accepts
 * arbitrary tile nodes instead of images.
 */
export function ThreeDMarquee({
  tiles,
  className = "",
  cols = 4,
}: {
  tiles: ReactNode[];
  className?: string;
  cols?: number;
}) {
  const perCol = Math.ceil(tiles.length / cols);
  const columns = Array.from({ length: cols }, (_, i) => {
    const col = tiles.slice(i * perCol, (i + 1) * perCol);
    // duplicate so short columns still fill vertically
    return [...col, ...col];
  });

  return (
    <div
      className={cn(
        "relative mx-auto block h-[24rem] overflow-hidden rounded-3xl sm:h-[32rem]",
        className,
      )}
    >
      <div className="flex size-full items-center justify-center">
        <div className="size-[1720px] shrink-0 scale-[0.45] sm:scale-[0.55] lg:scale-[0.7]">
          <div
            style={{
              transform: "rotateX(55deg) rotateY(0deg) rotateZ(-45deg)",
            }}
            className="relative left-1/2 top-1/2 grid size-full origin-center -translate-x-1/2 -translate-y-1/2 grid-cols-4 gap-6 transform-3d"
          >
            {columns.map((col, colIndex) => (
              <motion.div
                key={colIndex}
                animate={{ y: colIndex % 2 === 0 ? [0, 120, 0] : [0, -120, 0] }}
                transition={{
                  duration: colIndex % 2 === 0 ? 12 : 16,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="flex flex-col items-start gap-6"
              >
                <GridLineVertical className="-left-3" offset="60px" />
                {col.map((tile, i) => (
                  <div className="relative w-full" key={i}>
                    <GridLineHorizontal className="-top-3" offset="16px" />
                    <motion.div
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-full"
                    >
                      {tile}
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Fades so the plane melts into the canvas */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--color-paper)_95%)]" />
    </div>
  );
}

function GridLineHorizontal({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) {
  return (
    <div
      style={
        {
          "--height": "1px",
          "--width": "5px",
          "--fade-stop": "90%",
          "--offset": offset || "150px",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,rgba(var(--accent-rgb),0.18),rgba(var(--accent-rgb),0.18)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--color-paper)_var(--fade-stop),transparent),linear-gradient(to_right,var(--color-paper)_var(--fade-stop),transparent),linear-gradient(black,black)]",
        "z-30",
        className,
      )}
      aria-hidden="true"
    />
  );
}

function GridLineVertical({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) {
  return (
    <div
      style={
        {
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,rgba(var(--accent-rgb),0.18),rgba(var(--accent-rgb),0.18)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--color-paper)_var(--fade-stop),transparent),linear-gradient(to_bottom,var(--color-paper)_var(--fade-stop),transparent),linear-gradient(black,black)]",
        "z-30",
        className,
      )}
      aria-hidden="true"
    />
  );
}
