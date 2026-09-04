"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  children: ReactNode;
  subtitle?: string;
  badge?: ReactNode;
  className?: string;
  sectionNumber?: string;
  as?: "h1" | "h2" | "h3" | "h4";
}

export function SectionHeading({
  children,
  subtitle,
  badge,
  className,
  sectionNumber,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {sectionNumber && (
        <span className="font-mono text-[10px] text-irikk-red font-bold uppercase tracking-widest block">
          // SECTION {sectionNumber}
        </span>
      )}
      {badge && <div className="mb-2">{badge}</div>}
      <Tag className="font-display font-extrabold text-irikk-black uppercase tracking-tight text-xl sm:text-2xl md:text-3xl leading-[0.95]">
        {children}
      </Tag>
      {subtitle && (
        <p className="font-body text-irikk-near-black/75 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
}
