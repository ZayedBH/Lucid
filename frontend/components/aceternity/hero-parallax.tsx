"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

export type ParallaxProduct = {
  title: string;
  link: string;
  thumbnail: string;
};

/**
 * Hero Parallax (adapted from Aceternity UI) — rows of product shots on a
 * tilted plane that straighten out and slide past each other on scroll.
 */
export function HeroParallax({
  products,
  header,
  className = "",
}: {
  products: ParallaxProduct[];
  header?: React.ReactNode;
  className?: string;
}) {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 700]),
    springConfig,
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -700]),
    springConfig,
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig,
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig,
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [12, 0]),
    springConfig,
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-500, 200]),
    springConfig,
  );

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-[210vh] flex-col self-auto overflow-hidden py-24 antialiased [perspective:1000px] [transform-style:preserve-3d]",
        className,
      )}
    >
      {header}
      <motion.div
        style={{ rotateX, rotateZ, translateY, opacity }}
        className=""
      >
        <motion.div className="mb-12 flex flex-row-reverse space-x-reverse space-x-10">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row space-x-10">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function ProductCard({
  product,
  translate,
}: {
  product: ParallaxProduct;
  translate: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -16 }}
      className="group/product relative h-72 w-[26rem] shrink-0 sm:h-80 sm:w-[30rem]"
    >
      <Link
        href={product.link}
        className="block overflow-hidden rounded-2xl border border-line"
      >
        <Image
          src={product.thumbnail || "/placeholder.svg"}
          height={600}
          width={960}
          className="absolute inset-0 h-full w-full object-cover object-left-top"
          alt={product.title}
        />
      </Link>
      <div className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl bg-paper opacity-0 transition-opacity duration-300 group-hover/product:opacity-70" />
      <p className="pointer-events-none absolute bottom-4 left-4 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-ink opacity-0 transition-opacity duration-300 group-hover/product:opacity-100">
        {product.title}
      </p>
    </motion.div>
  );
}
