"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  children: ReactNode;
  subtitle?: string;
  badge?: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4";
}

export function SectionHeading({
  children,
  subtitle,
  badge,
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {badge && <div className="mb-3">{badge}</div>}
      <Tag className="font-display font-bold text-irikk-black uppercase tracking-tight text-2xl md:text-3xl leading-tight">
        {children}
      </Tag>
      {subtitle && (
        <p className="font-body text-irikk-near-black/70 text-base md:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
