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
}: FeatureCardProps) {
  const router = useRouter();

  return (
    <motion.div
      className={cn(
        "brutal-card rounded-xl p-6 md:p-8 cursor-pointer relative overflow-hidden group",
        "transition-all duration-100",
        "hover:shadow-[2px_2px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px]",
        "active:shadow-none active:translate-x-[4px] active:translate-y-[4px]",
        accentBorder === "left" && "border-l-[6px] border-l-irikk-red",
        accentBorder === "top" && "border-t-[6px] border-t-irikk-red",
        className
      )}
      onClick={() => router.push(href)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: 0.2 + index * 0.15,
      }}
      whileHover={{ rotate: -0.5 }}
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
      {badge && (
        <div className="absolute -top-1 -right-1 md:top-2 md:right-2">
          <Badge variant="red" rotate={badgeRotate || 3}>
            {badge}
          </Badge>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="text-irikk-red">{icon}</div>

        <div className="space-y-2">
          <h3 className="font-display font-bold text-xl md:text-2xl text-irikk-black uppercase tracking-tight leading-tight">
            {title}
          </h3>
          <p className="font-body text-sm md:text-base text-irikk-near-black/70 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2 font-display font-bold text-sm uppercase tracking-wide text-irikk-red group-hover:gap-3 transition-all duration-200">
          {cta}
          <ArrowRight
            size={18}
            strokeWidth={3}
            className="group-hover:translate-x-1 transition-transform duration-200"
          />
        </div>
      </div>
    </motion.div>
  );
}
