"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Google Gemini Effect (adapted from Aceternity UI) — scroll-driven SVG
 * paths that draw themselves as you scroll. Recolored to the tab accent
 * with varying opacities instead of the original multicolor set.
 */
export function GeminiEffect({
  title,
  description,
  className = "",
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const p1 = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const p2 = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const p3 = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const p4 = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const p5 = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  return (
    <div
      ref={ref}
      className={cn("relative h-[240vh] w-full", className)}
    >
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-x-0 top-[24%] z-10 flex flex-col items-center px-6 text-center sm:top-[22%]">
          {title && (
            <h2 className="font-display text-4xl font-medium tracking-tight text-ink sm:text-6xl text-balance">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-muted text-pretty">
              {description}
            </p>
          )}
        </div>
        <SVGPaths paths={[p1, p2, p3, p4, p5]} />
      </div>
    </div>
  );
}

const PATH_DS = [
  "M0 663C145.5 663 191 666.265 269 647C326.5 632 339.5 621 397.5 566C439 531.5 455.5 529.5 490 523C509.664 519.294 521 519.5 541.5 524C571.5 530.5 582 536.5 595 545.5C624 566 741 674 858.5 674C979.5 674 1001.5 675.5 1058 655.5C1121.5 632.5 1142.23 620.316 1185.5 585C1265.5 520 1327 483 1399 483C1467 483 1497 507 1552 539C1592.86 562.774 1616.5 570.5 1668.5 578C1706 583.409 1745.5 580.5 1440 580.5H1920",
  "M0 587.5C147 587.5 277 587.5 310 573.5C348 557.5 392.5 507.5 437 507.5C481.5 507.5 511 546.5 547 573.5C584.5 601.5 632.5 613.5 686.5 613.5C743 613.5 761.5 604.5 793.5 588.5C836 567.235 852.5 552.5 927.5 529.5C982.5 512.5 1007 510.5 1063 510.5C1116 510.5 1149.5 518.5 1190 537.5C1234.5 558.5 1260 577.5 1315 587.5C1370 597.5 1420 590.5 1920 590.5",
  "M0 514C147.5 514.333 294.5 513.735 380.5 513.735C405.976 514.94 422.849 515.228 436.37 515.123C477.503 514.803 518.631 506.605 559.508 505.626C567.762 505.428 576.412 505.68 585.5 506.5C618 509.5 630.5 512.5 665 515.5C743.5 522 785 523 830.5 523C875.5 523 926.5 519.5 1337.5 514.5C1520.5 512.276 1720.5 514 1920 514",
  "M0 438.5C150.5 438.5 261 438.318 323.5 456.5C351 464.5 387.517 484.001 423.5 494.5C447.371 501.465 472 503.735 487 507.735C503.786 512.212 504.5 516.808 523 518.735C547 521.235 564.814 519.235 584.5 518.735C671.5 516.235 683 510.735 726.5 502.735C766.5 495.379 800.5 488.235 833.5 484.235C880.5 478.535 908 481.402 936 484.235C972.5 487.935 1022.5 500.235 1069 509.235C1102.5 515.718 1120.5 516.235 1149 516.235C1183.5 516.235 1207 512.735 1240 502.735C1270 493.645 1288.5 481.235 1310.5 470.235C1342.5 454.235 1362.5 444.235 1400.5 442.235C1440 440.156 1489.5 442 1920 442",
  "M0 364C145.5 364 158 363.5 235 364C304.5 364.5 375 366 461 379.5C503.5 386.171 545 395.5 585.5 405.5C623 414.76 656.5 423.5 700 430C740.5 436.052 809 442 846 442C882.5 442 917.5 439.5 967.5 432.5C1030 423.75 1085 411 1152.5 397C1223 382.5 1281 372 1355.5 366C1413.5 361.328 1489 361 1920 364",
];

function SVGPaths({ paths }: { paths: MotionValue<number>[] }) {
  const opacities = [0.9, 0.7, 0.55, 0.4, 0.3];
  return (
    <svg
      width="100%"
      viewBox="0 0 1440 890"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute -top-40 w-full sm:-top-60"
      aria-hidden="true"
    >
      {PATH_DS.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="var(--color-accent)"
          strokeOpacity={opacities[i]}
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          style={{ pathLength: paths[i] }}
          transition={{ duration: 10 }}
        />
      ))}
      {/* Static ghost paths underneath */}
      {PATH_DS.map((d, i) => (
        <path
          key={`ghost-${i}`}
          d={d}
          stroke="var(--color-accent)"
          strokeOpacity="0.06"
          strokeWidth="2"
          fill="none"
        />
      ))}
      <defs>
        <filter id="blurMe">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
        </filter>
      </defs>
    </svg>
  );
}
