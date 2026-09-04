"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number; // 0-100
  label: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeConfig: Record<
  string,
  { text: string; container: string; badgeText: string }
> = {
  sm: { text: "text-3xl", container: "w-18 h-18", badgeText: "text-[9px]" },
  md: { text: "text-5xl", container: "w-28 h-28", badgeText: "text-[10px]" },
  lg: { text: "text-7xl", container: "w-36 h-36", badgeText: "text-xs" },
};

export function ScoreDisplay({
  score,
  label,
  size = "md",
  className,
}: ScoreDisplayProps) {
  const config = sizeConfig[size];

  return (
    <div className={cn("flex flex-col items-center gap-2 select-none", className)}>
      {/* Official Laboratory Stamped Gauge */}
      <motion.div
        className={cn(
          "relative flex flex-col items-center justify-center border-4 border-irikk-black bg-irikk-white shadow-[5px_5px_0px_#0F0F0F]",
          config.container
        )}
        initial={{ scale: 0, rotate: -8 }}
        animate={{ scale: 1, rotate: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.15 }}
      >
        {/* Stamp Sub-header */}
        <span className="font-mono text-[9px] uppercase tracking-widest text-irikk-gray-dark border-b border-irikk-gray pb-0.5 mb-0.5">
          RATING_IDX
        </span>

        {/* Large Metric Number */}
        <motion.span
          className={cn(
            "font-display font-extrabold tracking-tight leading-none",
            config.text,
            score >= 75 ? "text-irikk-red" : "text-irikk-black"
          )}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.25 }}
        >
          {score}
        </motion.span>

        <span className="font-mono text-[9px] uppercase text-irikk-near-black/70 mt-0.5">
          / 100 PTS
        </span>

        {/* Decorative corner tick */}
        <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-irikk-red" />
      </motion.div>

      {/* Label Sticker */}
      <div className="mt-1">
        <span className="zine-tape font-mono font-bold uppercase tracking-widest">
          {label}
        </span>
      </div>
    </div>
  );
}
