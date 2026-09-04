"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { ReactNode } from "react";

interface ResultCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: "red" | "black" | "white";
  icon?: ReactNode;
  score?: number;
  scoreLabel?: string;
  children?: ReactNode;
  pros?: string[];
  cons?: string[];
  className?: string;
  index?: number;
}

export function ResultCard({
  title,
  subtitle,
  badge,
  badgeVariant = "red",
  icon,
  score,
  scoreLabel,
  children,
  pros,
  cons,
  className,
  index = 0,
}: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: index * 0.1,
      }}
    >
      <Card className={cn("relative", className)} padding="lg">
        {badge && (
          <div className="absolute -top-3 left-4">
            <Badge variant={badgeVariant} rotate={-2}>
              {badge}
            </Badge>
          </div>
        )}

        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3 pt-1">
            {icon && (
              <div className="flex-shrink-0 text-irikk-red">{icon}</div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-lg md:text-xl text-irikk-black uppercase tracking-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="font-body text-sm text-irikk-near-black/70 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Score */}
          {score !== undefined && (
            <div className="space-y-2">
              <ProgressBar
                value={score}
                label={scoreLabel || "Score"}
                showPercentage
              />
            </div>
          )}

          {/* Pros / Cons */}
          {(pros || cons) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {pros && pros.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-display text-xs font-bold uppercase tracking-wide text-irikk-black">
                    Pros
                  </span>
                  <ul className="space-y-1">
                    {pros.map((pro, i) => (
                      <li
                        key={i}
                        className="font-body text-sm text-irikk-near-black flex items-start gap-1.5"
                      >
                        <span className="text-irikk-red font-bold mt-0.5">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {cons && cons.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-display text-xs font-bold uppercase tracking-wide text-irikk-black">
                    Cons
                  </span>
                  <ul className="space-y-1">
                    {cons.map((con, i) => (
                      <li
                        key={i}
                        className="font-body text-sm text-irikk-near-black flex items-start gap-1.5"
                      >
                        <span className="text-irikk-gray-dark font-bold mt-0.5">−</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Custom content */}
          {children}
        </div>
      </Card>
    </motion.div>
  );
}
