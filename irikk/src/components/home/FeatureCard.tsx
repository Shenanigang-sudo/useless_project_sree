"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  cta: string;
  href: string;
  badge?: string;
  badgeRotate?: number;
  accentBorder?: "left" | "top";
  className?: string;
  index?: number;
  specCode?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  cta,
  href,
  badge,
  badgeRotate,
  accentBorder = "left",
  className,
  index = 0,
  specCode = "SPEC_01",
}: FeatureCardProps) {
  const router = useRouter();

  return (
    <motion.div
      className={cn(
        "brutal-card p-5 sm:p-6 md:p-8 cursor-pointer relative overflow-hidden group select-none touch-manipulation",
        "transition-all duration-100",
        "hover:shadow-[3px_3px_0px_#0F0F0F] hover:translate-x-[3px] hover:translate-y-[3px]",
        "active:shadow-none active:translate-x-[4px] active:translate-y-[4px]",
        accentBorder === "left" && "border-l-[8px] border-l-irikk-red",
        accentBorder === "top" && "border-t-[8px] border-t-irikk-red",
        className
      )}
      onClick={() => router.push(href)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: 0.15 + index * 0.12,
      }}
      whileTap={{ scale: 0.98 }}
      role="link"
      tabIndex={0}
      aria-label={`${title} — ${description}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(href);
        }
      }}
    >
      {/* Top Zine Tape Tab */}
      <div className="absolute -top-3 left-4 sm:left-6 z-10">
        <span className="zine-tape">{specCode}</span>
      </div>

      {badge && (
        <div className="absolute top-3 right-3">
          <Badge variant="stamp" rotate={badgeRotate || (index === 0 ? 3 : -3)}>
            {badge}
          </Badge>
        </div>
      )}

      <div className="flex flex-col gap-3.5 sm:gap-4 pt-2">
        <div className="w-11 h-11 sm:w-12 sm:h-12 bg-irikk-paper border-2 border-irikk-black flex items-center justify-center text-irikk-red shadow-[2px_2px_0px_#0F0F0F]">
          {icon}
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <h3 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl text-irikk-black uppercase tracking-tight leading-[0.95]">
            {title}
          </h3>
          <p className="font-body text-xs sm:text-sm md:text-base text-irikk-near-black/80 leading-relaxed font-medium">
            {description}
          </p>
        </div>

        {/* Industrial CTA Button Strip */}
        <div className="pt-1 sm:pt-2">
          <span className="inline-flex items-center gap-2 font-display font-extrabold text-xs sm:text-sm uppercase tracking-wider px-3.5 py-2.5 min-h-[42px] bg-irikk-black text-irikk-white border border-irikk-black group-hover:bg-irikk-red transition-colors duration-150">
            <span>{cta}</span>
            <ArrowRight
              size={16}
              strokeWidth={3}
              className="group-hover:translate-x-1 transition-transform duration-150"
            />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
