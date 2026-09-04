"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ChipProps {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
  className?: string;
}

export function Chip({
  children,
  selected = false,
  onClick,
  icon,
  className,
}: ChipProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-3.5 py-2.5 min-h-[42px] border-2 border-irikk-black font-display font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-100 cursor-pointer select-none rounded-none touch-manipulation",
        selected
          ? "bg-irikk-red text-irikk-white shadow-[3px_3px_0px_#0F0F0F] -rotate-1"
          : "bg-irikk-white text-irikk-black shadow-[2px_2px_0px_#0F0F0F] hover:bg-irikk-paper hover:translate-x-[1px] hover:translate-y-[1px]",
        className
      )}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      aria-pressed={selected}
    >
      {icon && <span className="text-sm">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
}
