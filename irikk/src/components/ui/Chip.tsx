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
        "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-irikk-black font-body font-medium text-sm transition-all duration-100 cursor-pointer",
        selected
          ? "bg-irikk-red text-irikk-white shadow-[2px_2px_0px_#1A1A1A]"
          : "bg-irikk-white text-irikk-black shadow-[2px_2px_0px_#1A1A1A] hover:bg-irikk-off-white",
        className
      )}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      aria-pressed={selected}
    >
      {icon && <span className="text-base">{icon}</span>}
      {children}
    </motion.button>
  );
}
