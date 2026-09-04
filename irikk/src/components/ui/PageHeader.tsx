"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
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
}

export function PageHeader({
  title,
  subtitle,
  badge,
  badgeRotate,
  showBack = true,
  backHref,
  action,
  className,
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
      className={cn("space-y-3 mb-6", className)}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="flex items-center justify-between">
        {showBack && (
          <IconButton
            icon={<ArrowLeft size={20} strokeWidth={3} />}
            label="Go back"
            variant="ghost"
            size="sm"
            onClick={handleBack}
          />
        )}
        {action && <div>{action}</div>}
      </div>

      <div className="space-y-2">
        {badge && (
          <Badge variant="red" rotate={badgeRotate}>
            {badge}
          </Badge>
        )}
        <h1 className="font-display font-bold text-irikk-black uppercase tracking-tight text-3xl md:text-4xl leading-none">
          {title}
        </h1>
        {subtitle && (
          <p className="font-body text-irikk-near-black/70 text-base leading-relaxed max-w-md">
            {subtitle}
          </p>
        )}
      </div>
    </motion.header>
  );
}
