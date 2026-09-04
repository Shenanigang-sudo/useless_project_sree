"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "red" | "black" | "white";
  className?: string;
  rotate?: number;
}

const variantStyles: Record<string, string> = {
  red: "bg-irikk-red text-irikk-white",
  black: "bg-irikk-black text-irikk-white",
  white: "bg-irikk-white text-irikk-black",
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
        "brutal-badge",
        variantStyles[variant],
        className
      )}
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
    >
      {children}
    </span>
  );
}
