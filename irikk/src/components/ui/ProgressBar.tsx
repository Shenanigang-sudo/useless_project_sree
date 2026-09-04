"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  label?: string;
  showPercentage?: boolean;
}

export function ProgressBar({
  value,
  className,
  label,
  showPercentage = true,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("space-y-1.5", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="font-display text-xs font-bold uppercase tracking-wide text-irikk-black">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="font-display text-xs font-bold text-irikk-black">
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}
      <div
        className="h-4 bg-irikk-gray border-2 border-irikk-black rounded-sm overflow-hidden"
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || "Progress"}
      >
        <div
          className="h-full bg-irikk-red transition-all duration-500 ease-out"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
