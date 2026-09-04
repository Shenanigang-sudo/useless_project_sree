"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "tape";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
}

const variantStyles: Record<string, string> = {
  primary:
    "bg-irikk-red text-irikk-white border-3 border-irikk-black shadow-[4px_4px_0px_#0F0F0F] hover:shadow-[2px_2px_0px_#0F0F0F] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]",
  secondary:
    "bg-irikk-white text-irikk-black border-3 border-irikk-black shadow-[4px_4px_0px_#0F0F0F] hover:shadow-[2px_2px_0px_#0F0F0F] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]",
  ghost:
    "bg-transparent text-irikk-black border-2 border-dashed border-irikk-black hover:bg-irikk-black hover:text-irikk-white transition-colors",
  danger:
    "bg-irikk-black text-irikk-white border-3 border-irikk-black shadow-[4px_4px_0px_#E62B1E] hover:shadow-[2px_2px_0px_#E62B1E] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]",
  tape:
    "bg-irikk-tape text-irikk-black border-2 border-dashed border-irikk-black shadow-[3px_3px_0px_#0F0F0F] hover:translate-x-[1px] hover:translate-y-[1px]",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3.5 py-1.5 text-xs font-mono tracking-wider min-h-[38px]",
  md: "px-4 sm:px-5 py-2.5 text-sm font-display tracking-wide min-h-[44px]",
  lg: "px-6 sm:px-7 py-3 sm:py-3.5 text-sm sm:text-base md:text-lg font-display tracking-wider min-h-[48px]",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  iconRight,
  className,
  disabled,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        "font-extrabold uppercase tracking-wide cursor-pointer transition-all duration-100 inline-flex items-center justify-center gap-2.5 rounded-none select-none touch-manipulation",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </motion.button>
  );
}
