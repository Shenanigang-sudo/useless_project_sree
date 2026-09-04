"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface IconButtonProps {
  icon: ReactNode;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const variantStyles: Record<string, string> = {
  primary:
    "bg-irikk-red text-irikk-white border-2 border-irikk-black shadow-[2px_2px_0px_#1A1A1A]",
  secondary:
    "bg-irikk-white text-irikk-black border-2 border-irikk-black shadow-[2px_2px_0px_#1A1A1A]",
  ghost: "bg-transparent text-irikk-black border-2 border-transparent hover:border-irikk-black",
};

const sizeStyles: Record<string, string> = {
  sm: "p-2",
  md: "p-3",
  lg: "p-4",
};

export function IconButton({
  icon,
  label,
  variant = "secondary",
  size = "md",
  className,
  onClick,
  disabled,
}: IconButtonProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        "rounded-lg cursor-pointer transition-all duration-100 inline-flex items-center justify-center",
        "hover:shadow-[1px_1px_0px_#1A1A1A] hover:translate-x-[1px] hover:translate-y-[1px]",
        "active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
        variantStyles[variant],
        sizeStyles[size],
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </motion.button>
  );
}
