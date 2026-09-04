"use client";

import { motion } from "framer-motion";
import { Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  submessage?: string;
  className?: string;
}

const diagnosticMessages = [
  "DISSECTING CHAIR ERGONOMICS...",
  "CALCULATING MAXIMUM POSTERIOR COMFORT...",
  "CONSULTING THE ANCIENT BUTT SCROLLS...",
  "RUNNING OVERENGINEERED SQUAT DIAGNOSTICS...",
  "INTERROGATING THIS FURNITURE PIECE BY PIECE...",
  "SEARCHING FOR SIGNS OF HUMAN OCCUPANCY...",
  "CROSS-REFERENCING CUSHION INTEGRITY...",
  "PROCESSING SEATING VERDICT...",
];

export function LoadingState({
  message,
  submessage,
  className,
}: LoadingStateProps) {
  const displayMessage =
    message ||
    diagnosticMessages[
      Math.floor(Math.random() * diagnosticMessages.length)
    ];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 space-y-5 sm:space-y-6 relative select-none",
        className
      )}
    >
      {/* Target Reticle / Scanning Crosshairs */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Outer Rotating Radar Ring */}
        <motion.div
          className="absolute inset-0 border-3 border-dashed border-irikk-black rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        {/* Counter-Rotating Inner Ring */}
        <motion.div
          className="absolute inset-2 border-2 border-irikk-red rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Center Crosshair */}
        <Crosshair size={32} strokeWidth={2.5} className="text-irikk-black" />
      </div>

      {/* Terminal / Typewriter Status Box */}
      <div className="text-center space-y-2 max-w-sm">
        <div className="inline-block zine-tape font-mono text-[10px] uppercase tracking-widest mb-1">
          DIAGNOSTIC_PROTOCOL_RUNNING
        </div>

        <motion.p
          className="font-display font-extrabold text-lg md:text-xl text-irikk-black uppercase tracking-tight leading-tight"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {displayMessage}
        </motion.p>

        {submessage && (
          <p className="font-mono text-xs text-irikk-near-black/70 leading-relaxed font-medium">
            {submessage}
          </p>
        )}
      </div>

      {/* Industrial Block Progress Ticker */}
      <div className="flex gap-2 font-mono text-[10px] text-irikk-black">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-3.5 h-3.5 bg-irikk-red border-2 border-irikk-black"
            animate={{
              scale: [1, 1.25, 1],
              backgroundColor: ["#E62B1E", "#0F0F0F", "#E62B1E"],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.18,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
