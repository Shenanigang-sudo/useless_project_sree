"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Armchair,
  CheckCircle,
  XCircle,
  ShoppingBag,
  HelpCircle,
  Eye,
  Sparkles,
  AlertTriangle,
  AlertCircle,
  Volume2,
  ArrowRight,
  ShieldAlert,
  FileCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { ScoreDisplay } from "@/components/ui/ScoreDisplay";
import { ResultCard } from "@/components/results/ResultCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PostSeatFeedback } from "@/components/feedback/PostSeatFeedback";
import type { SingleSeatAnalysis } from "@/lib/ai/schemas";

export default function SeatResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<SingleSeatAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const rawStored = sessionStorage.getItem("irikk_seat_result");
      if (rawStored) {
        try {
          const parsed = JSON.parse(rawStored) as SingleSeatAnalysis;
          setResult(parsed);
        } catch {
          setResult(null);
        }
      }
      setIsLoading(false);
    }
  }, []);

  // 1. Loading State while reading session
  if (isLoading) {
    return (
      <main className="page-wrapper">
        <div className="max-w-lg mx-auto px-5 pt-16 pb-20 md:max-w-xl text-center space-y-4">
          <div className="inline-block p-4 border-3 border-irikk-black bg-irikk-white shadow-[4px_4px_0px_#0F0F0F] rotate-1">
            <p className="font-mono text-xs uppercase tracking-widest text-irikk-red font-bold">
              [ DECRYPTING TELEMETRY ]
            </p>
            <p className="font-display font-black text-2xl uppercase tracking-tight text-irikk-black mt-1">
              RETRIEVING VERDICT DOSSIER...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // 2. Empty State — if navigated directly without an analysis
  if (!result) {
    return (
      <main className="page-wrapper">
        <div className="max-w-lg mx-auto px-5 pt-6 pb-20 md:max-w-xl">
          <PageHeader
            title="SEATING VERDICT"
            subtitle="Forensic chair inspection dossier."
            badge="REPORT #00"
            badgeRotate={2}
            backHref="/seat"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="brutal-card p-8 bg-irikk-white text-center space-y-5 relative"
          >
            <span className="absolute -top-3 left-6 font-mono text-[10px] bg-irikk-black text-irikk-white px-2 py-0.5 uppercase tracking-widest font-bold">
              DOSSIER_STATUS: VOID
            </span>
            <div className="w-16 h-16 mx-auto bg-irikk-paper border-3 border-irikk-black flex items-center justify-center shadow-[3px_3px_0px_#0F0F0F] rotate-[-2deg]">
              <AlertCircle size={32} strokeWidth={3} className="text-irikk-red" />
            </div>
            <div>
              <h2 className="font-display font-black text-2xl uppercase tracking-tight text-irikk-black">
                NO SPECIMEN ON RECORD
              </h2>
              <p className="font-body text-sm text-irikk-near-black/75 max-w-sm mx-auto mt-2 leading-relaxed">
                No active seat inspection was found in this session. Take or upload a photo of a chair to execute Gemini Vision forensic scan.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push("/seat")}
                icon={<Armchair size={20} strokeWidth={3} />}
              >
                CHECK A SEAT NOW
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  // 3. Dynamic Occupancy Status Visual Config
  const statusMeta = {
    available: {
      stampText: "VERIFIED VACANT",
      stampVariant: "stamp-black" as const,
      stampRotate: -2,
      subtitle: "Zero biological occupants or claiming artifacts identified in frame.",
      summaryLabel: "APPROVED FOR IMMEDIATE OCCUPANCY",
      borderColor: "border-l-irikk-black",
      badgeColor: "bg-[#E6F4EA] text-green-900",
      icon: <CheckCircle size={26} strokeWidth={3} className="text-green-700" />,
      hazardText: "CLEARANCE: GRANTED",
    },
    occupied: {
      stampText: "SQUAT HAZARD: OCCUPIED",
      stampVariant: "stamp-red" as const,
      stampRotate: 3,
      subtitle: "A person is currently occupying or actively utilizing this seat.",
      summaryLabel: "DO NOT ATTEMPT TO SIT — BIO-OCCUPANT IN SITU",
      borderColor: "border-l-irikk-red",
      badgeColor: "bg-red-100 text-irikk-red",
      icon: <XCircle size={26} strokeWidth={3} className="text-irikk-red" />,
      hazardText: "DANGER: HIGH FRICTION SITTING HAZARD",
    },
    claimed: {
      stampText: "TERRITORY CLAIMED",
      stampVariant: "stamp-black" as const,
      stampRotate: -3,
      subtitle: "Seat is unoccupied but staked with personal artifacts or bags.",
      summaryLabel: "CONTEST AT YOUR OWN SOCIAL DISCRETION",
      borderColor: "border-l-amber-600",
      badgeColor: "bg-amber-100 text-amber-900",
      icon: <ShoppingBag size={26} strokeWidth={3} className="text-amber-700" />,
      hazardText: "CAUTION: ARTIFACT ENTANGLEMENT DETECTED",
    },
    uncertain: {
      stampText: "AMBIGUOUS SPECIMEN",
      stampVariant: "stamp-black" as const,
      stampRotate: 1,
      subtitle: "Insufficient optical telemetry or obscured angle for verification.",
      summaryLabel: "PROCEED WITH CAUTION // PHYSICAL RECON ADVISED",
      borderColor: "border-l-irikk-black",
      badgeColor: "bg-gray-200 text-irikk-black",
      icon: <HelpCircle size={26} strokeWidth={3} className="text-irikk-black" />,
      hazardText: "INSUFFICIENT RESOLUTION",
    },
  }[result.status];

  return (
    <main className="page-wrapper">
      <div className="max-w-lg mx-auto px-4 sm:px-5 pt-4 sm:pt-6 pb-20 md:max-w-xl">
        <PageHeader
          title="SEATING VERDICT"
          subtitle="Forensic chair inspection dossier."
          badge="REPORT #IRK-84"
          badgeRotate={-2}
          backHref="/seat"
        />

        <div className="space-y-6">
          {/* Main Verdict Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div
              className={`brutal-card p-4 sm:p-6 border-l-[8px] ${statusMeta.borderColor} relative bg-irikk-white`}
            >
              {/* Registration marks */}
              <span className="absolute top-1.5 left-2 font-mono text-[9px] text-irikk-near-black/40 select-none">
                + REG_X
              </span>
              <span className="absolute top-1.5 right-2 font-mono text-[9px] text-irikk-near-black/40 select-none">
                REG_Y +
              </span>

              {/* Tape Stamp on Top */}
              <div className="flex flex-wrap justify-between items-center gap-2 mb-4 pt-2">
                <span className="zine-tape text-[9px] sm:text-[10px] uppercase font-bold tracking-widest -rotate-2">
                  {statusMeta.hazardText}
                </span>
                <span className="font-mono text-[11px] sm:text-xs font-bold bg-irikk-black text-irikk-white px-2 py-0.5 uppercase tracking-wider rotate-1 shadow-[2px_2px_0px_#E62B1E]">
                  {result.confidence}% OPTICAL CONFIDENCE
                </span>
              </div>

              {/* Huge Rubber Stamp Verdict */}
              <div className="py-2 text-center my-3 border-y-2 border-dashed border-irikk-black/30">
                <span
                  className={`stamp-badge inline-block text-base sm:text-xl md:text-2xl tracking-wider break-words max-w-full ${
                    result.status === "occupied" ? "stamp-red" : "stamp-black"
                  }`}
                  style={{ transform: `rotate(${statusMeta.stampRotate}deg)` }}
                >
                  [ {statusMeta.stampText} ]
                </span>
                <p className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-irikk-red mt-2">
                  {statusMeta.summaryLabel}
                </p>
              </div>

              {/* Specimen Telemetry Table */}
              <div className="my-4 p-3 bg-irikk-paper border-2 border-irikk-black space-y-2">
                <div className="flex items-center justify-between border-b border-irikk-black/20 pb-1.5 text-xs font-mono">
                  <span className="text-irikk-near-black/60 uppercase">SPECIMEN CLASSIFICATION:</span>
                  <span className="font-bold text-irikk-black uppercase tracking-wider">
                    {result.seatType || "UNSPECIFIED FURNITURE"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-irikk-near-black/60 uppercase">OPTICAL SENSOR:</span>
                  <span className="font-bold text-irikk-black uppercase tracking-wider">
                    GEMINI FLASH 3.6 VISION
                  </span>
                </div>
              </div>

              {/* Inspector Description */}
              <div className="pt-1">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-irikk-black/60 block mb-1">
                  FIELD AGENT OBSERVATION LOG:
                </span>
                <p className="font-body text-sm text-irikk-near-black leading-relaxed font-medium">
                  {result.description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Comfort Rating / Laboratory Stamp */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 25 }}
            className="flex justify-center"
          >
            <ScoreDisplay
              score={result.factors.comfort}
              label="ERGONOMIC COMFORT INDEX"
              size="lg"
            />
          </motion.div>

          {/* Factor Breakdown */}
          <ResultCard
            title="FORENSIC FACTOR BREAKDOWN"
            subtitle="Hardware and physical telemetry estimated strictly from optical scan."
            icon={<Eye size={22} strokeWidth={3} />}
            badge="TELEMETRY"
            index={1}
          >
            <div className="space-y-3 pt-2">
              <ProgressBar
                value={result.factors.comfort}
                label="Cushion & Ergonomics"
              />
              <ProgressBar
                value={result.factors.crowding}
                label="Biological Proximity (Crowding)"
              />
              <ProgressBar
                value={result.factors.sunExposure}
                label="Thermal / Sun Glare Exposure"
              />
              <ProgressBar
                value={result.factors.legroom}
                label="Legroom & Extension Clearance"
              />
              <ProgressBar
                value={result.factors.privacy}
                label="Social Inconspicuity (Privacy)"
              />
              <ProgressBar
                value={result.factors.accessibility}
                label="Rapid Egress / Aisle Access"
              />

              {/* Noise Level */}
              <div className="flex items-center justify-between pt-3 border-t-2 border-irikk-black/20">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-irikk-black flex items-center gap-1.5">
                  <Volume2 size={16} strokeWidth={2.5} className="text-irikk-red" />
                  ACOUSTIC AMBIENCE
                </span>
                <span className="font-mono text-xs font-bold bg-irikk-black text-irikk-white px-2.5 py-1 uppercase tracking-widest rotate-[-1deg]">
                  {result.factors.noise.toUpperCase()} NOISE
                </span>
              </div>
            </div>
          </ResultCard>

          {/* Key Observations */}
          {result.observations && result.observations.length > 0 && (
            <ResultCard
              title="PRIMARY INDICATORS"
              subtitle="Distinct physical cues verified by optical sensor."
              icon={<Sparkles size={22} strokeWidth={3} />}
              badge="INDICATORS"
              badgeVariant="red"
              index={2}
            >
              <ul className="space-y-2 pt-1 font-mono text-xs">
                {result.observations.map((obs, idx) => (
                  <li
                    key={idx}
                    className="text-irikk-near-black flex items-start gap-2 bg-irikk-paper p-2 border border-irikk-black/20"
                  >
                    <span className="text-irikk-red font-black flex-shrink-0 text-sm">
                      [+]
                    </span>
                    <span className="font-body text-sm leading-snug">{obs}</span>
                  </li>
                ))}
              </ul>
            </ResultCard>
          )}

          {/* Concerns / Downsides */}
          {result.concerns && result.concerns.length > 0 && (
            <ResultCard
              title="CRITICAL THREATS & COMPLAINTS"
              subtitle="Potential hazards or posture liabilities discovered during scan."
              icon={<AlertTriangle size={22} strokeWidth={3} />}
              badge="WARNINGS"
              badgeVariant="black"
              index={3}
            >
              <ul className="space-y-2 pt-1 font-mono text-xs">
                {result.concerns.map((concern, idx) => (
                  <li
                    key={idx}
                    className="text-irikk-near-black flex items-start gap-2 bg-red-50/70 p-2 border border-irikk-red/30"
                  >
                    <span className="text-irikk-red font-black flex-shrink-0 text-sm">
                      [!]
                    </span>
                    <span className="font-body text-sm leading-snug">{concern}</span>
                  </li>
                ))}
              </ul>
            </ResultCard>
          )}

          {/* Post-Seat Forensic Investigation */}
          <PostSeatFeedback
            seatType={result.seatType}
            sourceContext="single_seat"
          />

          {/* Actions */}
          <motion.div
            className="space-y-3 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 25 }}
          >
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => {
                if (typeof window !== "undefined") {
                  sessionStorage.removeItem("irikk_seat_result");
                }
                router.push("/seat");
              }}
              icon={<Armchair size={20} strokeWidth={3} />}
            >
              CHECK ANOTHER SPECIMEN
            </Button>
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => router.push("/")}
              iconRight={<ArrowRight size={18} strokeWidth={3} />}
            >
              RETURN TO DISPATCH
            </Button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
