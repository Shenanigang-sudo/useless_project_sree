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
  badgeVariant?: "red" | "black" | "white" | "stamp" | "tape";
  icon?: ReactNode;
  score?: number;
  scoreLabel?: string;
  children?: ReactNode;
  pros?: string[];
  cons?: string[];
  className?: string;
  index?: number;
  sectionCode?: string;
}

export function ResultCard({
  title,
  subtitle,
  badge,
  badgeVariant = "stamp",
  icon,
  score,
  scoreLabel,
  children,
  pros,
  cons,
  className,
  index = 0,
  sectionCode,
}: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: index * 0.08,
      }}
    >
      <Card className={cn("relative p-4 sm:p-5 md:p-6", className)} padding="sm" registrationMarks>
        {/* Top Zine Badge */}
        {badge && (
          <div className="absolute -top-3 left-4 z-10">
            <Badge variant={badgeVariant} rotate={index % 2 === 0 ? -1.5 : 1.5}>
              {badge}
            </Badge>
          </div>
        )}

        {/* Top Right Dossier Meta */}
        {sectionCode && (
          <span className="absolute top-2 right-3 font-mono text-[9px] text-irikk-gray-dark uppercase tracking-widest">
            {sectionCode}
          </span>
        )}

        <div className="space-y-4 pt-1">
          {/* Header */}
          <div className="flex items-start gap-3">
            {icon && (
              <div className="w-9 h-9 bg-irikk-paper border-2 border-irikk-black flex items-center justify-center text-irikk-red flex-shrink-0 shadow-[2px_2px_0px_#0F0F0F] mt-0.5">
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-extrabold text-lg md:text-xl text-irikk-black uppercase tracking-tight leading-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="font-body text-xs sm:text-sm text-irikk-near-black/75 mt-1 font-medium leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Score Gauge */}
          {score !== undefined && (
            <div className="space-y-2 pt-1">
              <ProgressBar
                value={score}
                label={scoreLabel || "Score"}
                showPercentage
              />
            </div>
          )}

          {/* Pros / Cons Dossier Section */}
          {(pros || cons) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t-2 border-dashed border-irikk-gray">
              {pros && pros.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-irikk-black flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-600 inline-block" />
                    POSITIVE_INDICATORS
                  </span>
                  <ul className="space-y-1.5">
                    {pros.map((pro, i) => (
                      <li
                        key={i}
                        className="font-body text-xs sm:text-sm text-irikk-near-black flex items-start gap-2 leading-snug font-medium"
                      >
                        <span className="text-irikk-red font-extrabold text-sm flex-shrink-0 leading-none mt-0.5">
                          +
                        </span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {cons && cons.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-irikk-black flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-irikk-red inline-block" />
                    RISK_FACTORS
                  </span>
                  <ul className="space-y-1.5">
                    {cons.map((con, i) => (
                      <li
                        key={i}
                        className="font-body text-xs sm:text-sm text-irikk-near-black flex items-start gap-2 leading-snug font-medium"
                      >
                        <span className="text-irikk-black font-extrabold text-sm flex-shrink-0 leading-none mt-0.5">
                          −
                        </span>
                        <span>{con}</span>
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
