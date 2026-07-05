"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export type ThemeName =
  | "landing"
  | "today"
  | "todos"
  | "archive"
  | "ego"
  | "drift"
  | "twin"
  | "agent"
  | "graph"
  | "people"
  | "timeline"
  | "sources";

/**
 * Sets a per-tab accent theme by putting `data-theme` on <body>.
 * All accent CSS variables (--color-accent, --accent-rgb, ...) are
 * scoped in globals.css, so cards / buttons / nav re-tint automatically.
 */
export function PageTheme({ name }: { name: ThemeName }) {
  useEffect(() => {
    const body = document.body;
    const prev = body.getAttribute("data-theme");
    body.setAttribute("data-theme", name);
    return () => {
      if (prev) body.setAttribute("data-theme", prev);
      else body.removeAttribute("data-theme");
    };
  }, [name]);

  return null;
}

const ROUTE_THEMES: Record<string, ThemeName> = {
  "/": "landing",
  "/today": "today",
  "/todos": "todos",
  "/archive": "archive",
  "/ego": "ego",
  "/drift": "drift",
  "/twin": "twin",
  "/agent": "agent",
  "/graph": "graph",
  "/relationships": "people",
  "/timeline": "timeline",
  "/connectors": "sources",
};

/** Rendered once in the root layout — themes every route automatically. */
export function RouteTheme() {
  const pathname = usePathname();

  useEffect(() => {
    const seg = "/" + (pathname?.split("/")[1] ?? "");
    const theme = ROUTE_THEMES[seg] ?? "landing";
    if (theme === "landing") document.body.removeAttribute("data-theme");
    else document.body.setAttribute("data-theme", theme);
  }, [pathname]);

  return null;
}
