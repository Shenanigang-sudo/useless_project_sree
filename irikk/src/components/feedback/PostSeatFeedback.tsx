"use client";

import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle2, RotateCcw, Send, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PostSeatFeedbackProps {
  seatType?: string;
  sourceContext?: "single_seat" | "classroom";
}

interface QuestionDef {
  id: number;
  question: string;
  microcopy: Record<number, string>;
}

const QUESTIONS: QuestionDef[] = [
  {
    id: 1,
    question: "How does your butt feel after sitting here?",
    microcopy: {
      1: "My ass has filed a formal complaint.",
      2: "Slight numbness detected in lower quadrant.",
      3: "Passable for approximately 15 minutes.",
      4: "Ergonomically sound specimen.",
      5: "This chair understands me on a spiritual level.",
    },
  },
  {
    id: 2,
    question: "How likely are you to voluntarily sit here again?",
    microcopy: {
      1: "Never again. I would rather stand on one leg.",
      2: "Only under extreme social duress.",
      3: "If forced by unavoidable circumstances.",
      4: "Reasonable candidate for future perches.",
      5: "I am legally claiming this seat forever.",
    },
  },
  {
    id: 3,
    question: "How peaceful was your seating experience?",
    microcopy: {
      1: "Absolute acoustic & biological chaos.",
      2: "Moderate sensory assault from surroundings.",
      3: "Tolerable level of ambient disruption.",
      4: "Quiet, respectable micro-sanctuary.",
      5: "Inner zen & complete transcendent peace achieved.",
    },
  },
  {
    id: 4,
    question: "How easy was it to get in and out without disturbing anyone?",
    microcopy: {
      1: "Six people had to stand up, trip, and sigh loudly.",
      2: "Awkward knee gymnastics & backpack collisions.",
      3: "Standard sideways apologetic shuffle.",
      4: "Graceful, low-friction extraction.",
      5: "Smooth criminal. Zero eye contact required.",
    },
  },
  {
    id: 5,
    question: "How accurate was IRIKK's verdict?",
    microcopy: {
      1: "Who programmed this? Total optical hallucination.",
      2: "Questionable telemetry at best.",
      3: "Roughly half-accurate assessment.",
      4: "Impressively perceptive computer vision.",
      5: "IRIKK knows my ass better than my physician.",
    },
  },
];

const OVERALL_MICROCOPY: Record<number, string> = {
  1: "Defective furniture hazard.",
  2: "Uninspired mediocre perch.",
  3: "Acceptable everyday chair.",
  4: "Superior comfort specimen.",
  5: "God-tier throne of glory.",
};

export function PostSeatFeedback({
  seatType = "chair",
  sourceContext = "single_seat",
}: PostSeatFeedbackProps) {
  const componentId = useId();
  const [ratings, setRatings] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [hoveredRatings, setHoveredRatings] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [overallRating, setOverallRating] = useState<number>(0);
  const [hoveredOverall, setHoveredOverall] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionTime, setSubmissionTime] = useState<string>("");

  const answeredCount = Object.values(ratings).filter((r) => r > 0).length;
  const isComplete = answeredCount === 5;

  const handleRate = (questionId: number, value: number) => {
    setRatings((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleHover = (questionId: number, value: number) => {
    setHoveredRatings((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    if (!isComplete) return;

    const payload = {
      timestamp: new Date().toISOString(),
      sourceContext,
      seatType,
      ratings,
      overallRating: overallRating > 0 ? overallRating : undefined,
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`irikk_feedback_${Date.now()}`, JSON.stringify(payload));
        localStorage.setItem("irikk_latest_feedback", JSON.stringify(payload));
      } catch (e) {
        console.warn("Could not save to localStorage", e);
      }
    }

    setSubmissionTime(new Date().toLocaleTimeString());
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      aria-labelledby={`feedback-heading-${componentId}`}
      className="my-6 sm:my-8"
    >
      <div className="brutal-card p-4 sm:p-6 md:p-7 border-l-[8px] border-l-irikk-black bg-irikk-white relative overflow-hidden">
        {/* Registration Marks */}
        <span className="absolute top-1.5 left-2 font-mono text-[9px] text-irikk-near-black/30 select-none">
          + FORM_109-C
        </span>
        <span className="absolute top-1.5 right-2 font-mono text-[9px] text-irikk-near-black/30 select-none">
          SEC_AUDIT +
        </span>

        {/* Top classified strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4 pt-2">
          <span className="zine-tape text-[9px] sm:text-[10px] uppercase font-bold tracking-widest -rotate-1">
            POST-SEAT FORENSIC AUDIT
          </span>
          <span className="font-mono text-[10px] sm:text-xs font-bold bg-irikk-black text-irikk-white px-2 py-0.5 uppercase tracking-wider shadow-[2px_2px_0px_#E62B1E]">
            {isSubmitted ? "STATUS: ARCHIVED" : `PROGRESS: ${answeredCount}/5 ANSWERED`}
          </span>
        </div>

        {/* Section Header */}
        <div className="border-b-2 border-dashed border-irikk-black/30 pb-3 mb-4 sm:mb-5">
          <h2
            id={`feedback-heading-${componentId}`}
            className="font-display font-black text-xl sm:text-2xl md:text-3xl text-irikk-black uppercase tracking-tight leading-tight"
          >
            THE SEAT HAS BEEN TESTED.
          </h2>
          <p className="font-body text-xs sm:text-sm text-irikk-near-black/75 mt-1 leading-relaxed">
            IRIKK demands post-occupancy ground truth. Did our AI vision algorithm match
            your biological experience, or did we completely hallucinate?
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* The 5 Mandatory Questions */}
              <div className="space-y-5">
                {QUESTIONS.map((q, idx) => {
                  const currentRating = ratings[q.id] || 0;
                  const hovered = hoveredRatings[q.id] || 0;
                  const activeDisplayVal = hovered > 0 ? hovered : currentRating;

                  return (
                    <div
                      key={q.id}
                      className="p-3.5 sm:p-4 bg-irikk-paper border-2 border-irikk-black shadow-[3px_3px_0px_#0F0F0F] transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <span className="font-mono text-xs font-black bg-irikk-black text-irikk-white px-1.5 py-0.5 flex-shrink-0 mt-0.5">
                            0{idx + 1}
                          </span>
                          <p className="font-display font-bold text-sm sm:text-base text-irikk-black leading-snug">
                            {q.question}
                          </p>
                        </div>
                        {currentRating > 0 && (
                          <span className="font-mono text-[10px] font-bold text-green-800 bg-green-100 border border-green-700 px-1.5 py-0.2 rounded-none flex-shrink-0">
                            {currentRating}/5 ★
                          </span>
                        )}
                      </div>

                      {/* 1-5 Star Selection Buttons */}
                      <div className="flex items-center gap-1 sm:gap-2 mt-3 pt-1 border-t border-irikk-black/10">
                        {[1, 2, 3, 4, 5].map((starValue) => {
                          const isFilled =
                            hovered > 0
                              ? starValue <= hovered
                              : starValue <= currentRating;

                          return (
                            <button
                              key={starValue}
                              type="button"
                              onClick={() => handleRate(q.id, starValue)}
                              onMouseEnter={() => handleHover(q.id, starValue)}
                              onMouseLeave={() => handleHover(q.id, 0)}
                              aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""} out of 5 for question ${q.id}`}
                              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center p-1.5 rounded-none border-2 border-transparent hover:border-irikk-black hover:bg-white active:scale-95 transition-transform cursor-pointer touch-manipulation focus:outline-none focus:border-irikk-black"
                            >
                              <Star
                                size={24}
                                strokeWidth={2.5}
                                className={`transition-colors ${
                                  isFilled
                                    ? "fill-irikk-red text-irikk-black drop-shadow-[1px_1px_0px_#0F0F0F]"
                                    : "fill-transparent text-irikk-near-black/30"
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>

                      {/* Humorous Dynamic Microcopy */}
                      <div className="min-h-[22px] mt-1.5">
                        <AnimatePresence mode="wait">
                          {activeDisplayVal > 0 ? (
                            <motion.p
                              key={activeDisplayVal}
                              initial={{ opacity: 0, y: 2 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -2 }}
                              transition={{ duration: 0.15 }}
                              className="font-mono text-xs text-irikk-red font-bold leading-tight"
                            >
                              &ldquo;{q.microcopy[activeDisplayVal]}&rdquo;
                            </motion.p>
                          ) : (
                            <p className="font-mono text-[11px] text-irikk-near-black/40 italic">
                              Tap a star to register butt verdict...
                            </p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Optional Overall Rating */}
              <div className="p-3.5 sm:p-4 bg-irikk-white border-2 border-dashed border-irikk-black/40 relative">
                <span className="absolute -top-2.5 right-4 font-mono text-[9px] uppercase font-bold bg-irikk-paper px-2 py-0.5 border border-irikk-black/40 text-irikk-near-black/70">
                  OPTIONAL SUMMARY
                </span>
                <p className="font-display font-bold text-sm sm:text-base text-irikk-black">
                  Okay, but overall... how was the seat?
                </p>
                <div className="flex items-center gap-1 sm:gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((val) => {
                    const isFilled =
                      hoveredOverall > 0
                        ? val <= hoveredOverall
                        : val <= overallRating;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setOverallRating(val)}
                        onMouseEnter={() => setHoveredOverall(val)}
                        onMouseLeave={() => setHoveredOverall(0)}
                        aria-label={`Overall rating ${val} out of 5`}
                        className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center p-1.5 border-2 border-transparent hover:border-irikk-black hover:bg-irikk-paper active:scale-95 transition-transform cursor-pointer touch-manipulation focus:outline-none focus:border-irikk-black"
                      >
                        <Star
                          size={24}
                          strokeWidth={2.5}
                          className={`transition-colors ${
                            isFilled
                              ? "fill-irikk-black text-irikk-black drop-shadow-[1px_1px_0px_#E62B1E]"
                              : "fill-transparent text-irikk-near-black/30"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="min-h-[18px] mt-1">
                  {(hoveredOverall > 0 || overallRating > 0) && (
                    <p className="font-mono text-xs font-bold text-irikk-black">
                      &ldquo;
                      {
                        OVERALL_MICROCOPY[
                          hoveredOverall > 0 ? hoveredOverall : overallRating
                        ]
                      }
                      &rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Submission Button */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!isComplete}
                  onClick={handleSubmit}
                  icon={<Send size={18} strokeWidth={3} />}
                >
                  {isComplete
                    ? "SUBMIT FEEDBACK"
                    : `ANSWER ALL QUESTIONS (${answeredCount}/5)`}
                </Button>
                <p className="text-center font-mono text-[10px] text-irikk-near-black/50 uppercase tracking-wider mt-2.5">
                  [ DATA REMAINS STRICTLY LOCAL. NO DATA SENT TO BIG SEAT CORP ]
                </p>
              </div>
            </motion.div>
          ) : (
            /* Submitted Confirmation State */
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-4 text-center space-y-4"
            >
              {/* Rubber Stamp */}
              <div className="py-2">
                <span className="stamp-badge stamp-black inline-block text-xl sm:text-2xl tracking-wider rotate-[-2deg]">
                  [ FEEDBACK RECEIVED ]
                </span>
              </div>

              <div className="p-4 bg-irikk-paper border-2 border-irikk-black shadow-[3px_3px_0px_#0F0F0F] max-w-md mx-auto text-left space-y-3">
                <div className="flex items-center gap-2 text-irikk-red font-display font-black text-base uppercase">
                  <ShieldCheck size={20} strokeWidth={3} />
                  <span>BIOMETRIC EVIDENCE ARCHIVED</span>
                </div>
                <p className="font-body text-sm text-irikk-near-black leading-relaxed font-medium">
                  Your butt has officially contributed to science. IRIKK&apos;s neural network
                  has ingested your feedback and will overthink the next chair with
                  even greater precision.
                </p>
                <div className="pt-2 border-t border-irikk-black/20 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-irikk-near-black/60 block text-[10px]">TIME LOGGED:</span>
                    <span className="font-bold text-irikk-black">{submissionTime}</span>
                  </div>
                  <div>
                    <span className="text-irikk-near-black/60 block text-[10px]">AVERAGE VERDICT:</span>
                    <span className="font-bold text-irikk-red">
                      {(
                        Object.values(ratings).reduce((a, b) => a + b, 0) / 5
                      ).toFixed(1)}
                      /5.0 ★
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleReset}
                  icon={<RotateCcw size={16} strokeWidth={3} />}
                >
                  REVISE AUDIT RESPONSE
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
