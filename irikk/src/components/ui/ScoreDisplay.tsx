"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number; // 0-100
  label: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeConfig: Record<string, { text: string; container: string }> = {
  sm: { text: "text-3xl", container: "w-16 h-16" },
  md: { text: "text-5xl", container: "w-24 h-24" },
  lg: { text: "text-7xl", container: "w-32 h-32" },
};

function getScoreColor(score: number): string {
  if (score >= 80) return "text-irikk-red";
  if (score >= 60) return "text-irikk-black";
  if (score >= 40) return "text-irikk-near-black";
  return "text-irikk-gray-dark";
}

export function ScoreDisplay({
  score,
  label,
  size = "md",
  className,
}: ScoreDisplayProps) {
  const config = sizeConfig[size];

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <motion.div
        className={cn(
          "flex items-center justify-center border-3 border-irikk-black rounded-xl bg-irikk-white shadow-[4px_4px_0px_#1A1A1A]",
          config.container
        )}
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
      >
        <motion.span
          className={cn(
            "font-display font-bold",
            config.text,
            getScoreColor(score)
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {score}
        </motion.span>
      </motion.div>
      <span className="font-display text-xs font-bold uppercase tracking-widest text-irikk-near-black">
        {label}
      </span>
    </div>
  );
}
