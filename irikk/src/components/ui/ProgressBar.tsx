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
        <div className="flex items-center justify-between font-mono text-xs text-irikk-black">
          {label && (
            <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-irikk-red font-bold">›</span>
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="font-bold tabular-nums">
              [{Math.round(clampedValue)}%]
            </span>
          )}
        </div>
      )}

      {/* Industrial Segmented Mechanical Gauge */}
      <div
        className="h-4 bg-irikk-paper border-2 border-irikk-black shadow-[2px_2px_0px_#0F0F0F] relative overflow-hidden"
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || "Progress"}
      >
        {/* Solid Red Fill */}
        <div
          className="h-full bg-irikk-red transition-all duration-500 ease-out border-r-2 border-irikk-black"
          style={{ width: `${clampedValue}%` }}
        />

        {/* Subtle Mechanical Tick Marks */}
        <div className="absolute inset-0 pointer-events-none flex justify-between px-1">
          <div className="w-[1px] h-full bg-irikk-black/20" />
          <div className="w-[1px] h-full bg-irikk-black/20" />
          <div className="w-[1px] h-full bg-irikk-black/20" />
        </div>
      </div>
    </div>
  );
}
