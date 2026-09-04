"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

const paddingStyles: Record<string, string> = {
  sm: "p-4",
  md: "p-5 md:p-6",
  lg: "p-6 md:p-8",
};

export function Card({
  children,
  className,
  onClick,
  hover = false,
  padding = "md",
}: CardProps) {
  const isClickable = !!onClick;

  return (
    <motion.div
      className={cn(
        "brutal-card rounded-xl",
        paddingStyles[padding],
        isClickable && "cursor-pointer",
        hover &&
          "transition-all duration-100 hover:shadow-[2px_2px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px]",
        className
      )}
      onClick={onClick}
      whileHover={
        hover
          ? { rotate: -0.5 }
          : undefined
      }
      whileTap={isClickable ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.div>
  );
}
