"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  submessage?: string;
  className?: string;
}

const loadingMessages = [
  "Analyzing every pixel...",
  "Judging the cushion quality...",
  "Measuring lumbar support...",
  "Consulting the seat gods...",
  "Running the vibe check...",
  "Calculating sitting potential...",
  "Evaluating armrest energy...",
  "Overthinking this thoroughly...",
];

export function LoadingState({
  message,
  submessage,
  className,
}: LoadingStateProps) {
  const displayMessage =
    message || loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 space-y-6",
        className
      )}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 size={40} strokeWidth={3} className="text-irikk-red" />
      </motion.div>

      <div className="text-center space-y-2">
        <motion.p
          className="font-display font-bold text-lg text-irikk-black uppercase tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {displayMessage}
        </motion.p>
        {submessage && (
          <p className="font-body text-sm text-irikk-gray-dark">
            {submessage}
          </p>
        )}
      </div>

      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-irikk-red border-2 border-irikk-black rounded-sm"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
