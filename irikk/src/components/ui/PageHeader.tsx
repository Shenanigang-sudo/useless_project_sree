"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeRotate?: number;
  showBack?: boolean;
  backHref?: string;
  action?: ReactNode;
  className?: string;
  formCode?: string;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  badgeRotate = -1.5,
  showBack = true,
  backHref,
  action,
  className,
  formCode = "IRK-SPEC-09",
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <motion.header
      className={cn("mb-8 pb-4 border-b-3 border-irikk-black", className)}
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between font-mono text-[10px] text-irikk-near-black/70 mb-3 uppercase tracking-wider">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] bg-irikk-white border-2 border-irikk-black shadow-[2px_2px_0px_#0F0F0F] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-bold text-irikk-black cursor-pointer transition-all touch-manipulation select-none"
              aria-label="Return"
            >
              <ArrowLeft size={14} strokeWidth={3} />
              <span>RETURN</span>
            </button>
          )}
          <span className="hidden xs:inline">DOC_REF // {formCode}</span>
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className="space-y-2 pt-1">
        {badge && (
          <div className="mb-2">
            <Badge variant="red" rotate={badgeRotate}>
              {badge}
            </Badge>
          </div>
        )}
        <h1 className="font-display font-extrabold text-irikk-black uppercase tracking-tight text-2xl sm:text-4xl md:text-5xl leading-[0.95] break-words">
          {title}
        </h1>
        {subtitle && (
          <p className="font-body text-irikk-near-black/80 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg mt-1 font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </motion.header>
  );
}
