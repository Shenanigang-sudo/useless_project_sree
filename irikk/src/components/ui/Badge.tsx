"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "red" | "black" | "white" | "stamp" | "tape";
  className?: string;
  rotate?: number;
}

const variantStyles: Record<string, string> = {
  red: "bg-irikk-red text-irikk-white border-2 border-irikk-black shadow-[2px_2px_0px_#0F0F0F]",
  black: "bg-irikk-black text-irikk-white border-2 border-irikk-black shadow-[2px_2px_0px_#0F0F0F]",
  white: "bg-irikk-white text-irikk-black border-2 border-irikk-black shadow-[2px_2px_0px_#0F0F0F]",
  stamp: "stamp-red bg-white/90 text-irikk-red border-2 border-dashed border-irikk-red",
  tape: "zine-tape",
};

export function Badge({
  children,
  variant = "red",
  className,
  rotate = 0,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "font-mono font-bold uppercase tracking-wider text-[11px] px-2.5 py-0.5 inline-flex items-center gap-1.5 select-none transition-transform",
        variantStyles[variant],
        className
      )}
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
    >
      {children}
    </span>
  );
}
