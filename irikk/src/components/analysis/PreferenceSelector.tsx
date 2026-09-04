"use client";

import { motion } from "framer-motion";
import { Chip } from "@/components/ui/Chip";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Preference, PreferenceOption } from "@/types";

interface PreferenceSelectorProps {
  preferences: PreferenceOption[];
  selected: Preference[];
  onToggle: (id: Preference) => void;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export function PreferenceSelector({
  preferences,
  selected,
  onToggle,
  className,
}: PreferenceSelectorProps) {
  return (
    <div className={className}>
      <SectionHeading
        subtitle="Pick as many as you want. We won't judge."
        className="mb-4"
      >
        YOUR DEMANDS
      </SectionHeading>

      <motion.div
        className="flex flex-wrap gap-2.5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {preferences.map((pref) => (
          <motion.div key={pref.id} variants={itemVariants}>
            <Chip
              selected={selected.includes(pref.id)}
              onClick={() => onToggle(pref.id)}
            >
              {pref.label}
            </Chip>
          </motion.div>
        ))}
      </motion.div>

      {selected.length > 0 && (
        <motion.p
          className="mt-3 font-body text-xs text-irikk-gray-dark"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {selected.length} preference{selected.length !== 1 ? "s" : ""} selected
        </motion.p>
      )}
    </div>
  );
}
