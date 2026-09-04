"use client";

import { motion } from "framer-motion";
import { Chip } from "@/components/ui/Chip";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { PurposeOption, SeatPurpose, ClassroomPurpose } from "@/types";

interface PurposeSelectorProps {
  purposes: PurposeOption[];
  selected: SeatPurpose | ClassroomPurpose | null;
  onSelect: (id: SeatPurpose | ClassroomPurpose) => void;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export function PurposeSelector({
  purposes,
  selected,
  onSelect,
  className,
}: PurposeSelectorProps) {
  return (
    <div className={className}>
      <SectionHeading
        subtitle="What are you trying to do?"
        className="mb-4"
      >
        WHAT&apos;S THE MISSION?
      </SectionHeading>

      <motion.div
        className="flex flex-wrap gap-2.5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {purposes.map((purpose) => (
          <motion.div key={purpose.id} variants={itemVariants}>
            <Chip
              selected={selected === purpose.id}
              onClick={() => onSelect(purpose.id)}
              icon={<span>{purpose.emoji}</span>}
            >
              {purpose.label}
            </Chip>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
