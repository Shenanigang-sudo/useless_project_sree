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
  tapeText?: string;
  registrationMarks?: boolean;
}

const paddingStyles: Record<string, string> = {
  sm: "p-3.5",
  md: "p-5 md:p-6",
  lg: "p-6 md:p-8",
};

export function Card({
  children,
  className,
  onClick,
  hover = false,
  padding = "md",
  tapeText,
  registrationMarks = false,
}: CardProps) {
  const isClickable = !!onClick;

  return (
    <motion.div
      className={cn(
        "brutal-card rounded-none relative",
        paddingStyles[padding],
        isClickable && "cursor-pointer",
        hover &&
          "transition-all duration-100 hover:shadow-[3px_3px_0px_#0F0F0F] hover:translate-x-[2px] hover:translate-y-[2px]",
        className
      )}
      onClick={onClick}
      whileHover={
        hover
          ? { rotate: -0.5 }
          : undefined
      }
      whileTap={isClickable ? { scale: 0.99 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Optional Tape Strip at Top */}
      {tapeText && (
        <div className="absolute -top-3.5 left-6 z-10">
          <span className="zine-tape rotate-[-1.5deg]">{tapeText}</span>
        </div>
      )}

      {/* Technical Registration Marks */}
      {registrationMarks && (
        <>
          <span className="absolute top-1 left-1 text-[9px] font-mono text-irikk-gray-dark select-none leading-none">
            +
          </span>
          <span className="absolute top-1 right-1 text-[9px] font-mono text-irikk-gray-dark select-none leading-none">
            +
          </span>
          <span className="absolute bottom-1 left-1 text-[9px] font-mono text-irikk-gray-dark select-none leading-none">
            +
          </span>
          <span className="absolute bottom-1 right-1 text-[9px] font-mono text-irikk-gray-dark select-none leading-none">
            +
          </span>
        </>
      )}

      {children}
    </motion.div>
  );
}
