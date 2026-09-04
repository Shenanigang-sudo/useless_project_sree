"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  School,
  Trophy,
  MapPin,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  Eye,
  Sparkles,
  Users,
  Sun,
  Maximize2,
  Shield,
  Footprints,
  Crosshair,
  FileCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { ScoreDisplay } from "@/components/ui/ScoreDisplay";
import { ResultCard } from "@/components/results/ResultCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PostSeatFeedback } from "@/components/feedback/PostSeatFeedback";
import type { ClassroomAnalysis } from "@/lib/ai/schemas";

export default function ClassroomResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<ClassroomAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const rawStored = sessionStorage.getItem("irikk_classroom_result");
      if (rawStored) {
        try {
          const parsed = JSON.parse(rawStored) as ClassroomAnalysis;
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
          <div className="inline-block p-4 border-3 border-irikk-black bg-irikk-white shadow-[4px_4px_0px_#0F0F0F] -rotate-1">
            <p className="font-mono text-xs uppercase tracking-widest text-irikk-red font-bold">
              [ DECRYPTING ROOM TELEMETRY ]
            </p>
            <p className="font-display font-black text-2xl uppercase tracking-tight text-irikk-black mt-1">
              COMPILING TACTICAL DEBRIEF...
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
            title="ROOM DEBRIEF"
            subtitle="Tactical lecture hall reconnaissance dossier."
            badge="REPORT #00"
            badgeRotate={2}
            backHref="/classroom"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="brutal-card p-8 bg-irikk-white text-center space-y-5 relative"
          >
            <span className="absolute -top-3 left-6 font-mono text-[10px] bg-irikk-black text-irikk-white px-2 py-0.5 uppercase tracking-widest font-bold">
              DOSSIER_STATUS: EMPTY
            </span>
            <div className="w-16 h-16 mx-auto bg-irikk-paper border-3 border-irikk-black flex items-center justify-center shadow-[3px_3px_0px_#0F0F0F] rotate-[-2deg]">
              <AlertCircle size={32} strokeWidth={3} className="text-irikk-red" />
            </div>
            <div>
              <h2 className="font-display font-black text-2xl uppercase tracking-tight text-irikk-black">
                NO SECTOR SCAN RECORDED
              </h2>
              <p className="font-body text-sm text-irikk-near-black/75 max-w-sm mx-auto mt-2 leading-relaxed">
                No active classroom analysis was found in this session. Take or upload a photo of the lecture hall to run tactical seat appraisal.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push("/classroom")}
                icon={<School size={20} strokeWidth={3} />}
              >
                SCAN A CLASSROOM NOW
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  // Calculate seat stats from real AI data
  const totalIdentified = result.seats.length;
  const availableCount = result.seats.filter(
    (s) => s.availability === "available"
  ).length;
  const occupiedCount = result.seats.filter(
    (s) => s.availability === "occupied" || s.availability === "blocked"
  ).length;

  // 3. Uncertain State — when AI couldn't confidently recommend a seat
  if (result.status === "uncertain") {
    return (
      <main className="page-wrapper">
        <div className="max-w-lg mx-auto px-5 pt-6 pb-20 md:max-w-xl">
          <PageHeader
            title="TACTICAL DEBRIEF"
            subtitle="Tactical lecture hall reconnaissance dossier."
            badge="UNCERTAIN"
            badgeRotate={-2}
            backHref="/classroom"
          />

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="brutal-card p-6 border-l-[8px] border-l-irikk-black space-y-4 bg-irikk-white relative"
            >
              {/* Tape Stamp */}
              <div className="flex justify-between items-start">
                <span className="zine-tape text-[10px] uppercase font-bold tracking-widest -rotate-2">
                  HAZARD: OPTICAL OCCLUSION
                </span>
                <span className="font-mono text-xs font-bold bg-irikk-black text-irikk-white px-2 py-0.5 uppercase tracking-wider rotate-1 shadow-[2px_2px_0px_#E62B1E]">
                  {result.confidence}% SENSOR CONFIDENCE
                </span>
              </div>

              {/* Huge Rubber Stamp */}
              <div className="py-2 text-center my-3 border-y-2 border-dashed border-irikk-black/30">
                <span className="stamp-badge stamp-black inline-block text-xl md:text-2xl tracking-wider -rotate-1">
                  [ SCAN INCONCLUSIVE ]
                </span>
                <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-irikk-red mt-2">
                  INSUFFICIENT ROOM TOPOGRAPHY DETECTED
                </p>
              </div>

              <div className="p-3 bg-irikk-paper border-2 border-irikk-black">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-irikk-black/60 block mb-1">
                  AGENT DEBRIEF SUMMARY:
                </span>
                <p className="font-body text-sm text-irikk-near-black font-medium leading-relaxed">
                  {result.recommendation.reason ||
                    "The AI could not confidently identify a suitable available seat from this photograph."}
                </p>
              </div>

              {result.classroomDescription && (
                <div className="p-3 bg-irikk-paper/50 border border-irikk-black/30">
                  <p className="font-mono text-xs text-irikk-near-black/80 leading-relaxed">
                    <span className="font-bold uppercase text-irikk-red">// ROOM CONTEXT:</span>{" "}
                    {result.classroomDescription}
                  </p>
                </div>
              )}

              {result.concerns && result.concerns.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-irikk-black block">
                    CRITICAL OBSTRUCTIONS IDENTIFIED:
                  </span>
                  <ul className="space-y-1.5 font-mono text-xs">
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
                </div>
              )}
            </motion.div>

            <div className="space-y-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => {
                  if (typeof window !== "undefined") {
                    sessionStorage.removeItem("irikk_classroom_result");
                  }
                  router.push("/classroom");
                }}
                icon={<School size={20} strokeWidth={3} />}
              >
                RE-SCAN WITH WIDER ANGLE
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
            </div>
          </div>
        </div>
      </main>
    );
  }

  // 4. Success State — Real AI Recommendation
  return (
    <main className="page-wrapper">
      <div className="max-w-lg mx-auto px-4 sm:px-5 pt-4 sm:pt-6 pb-20 md:max-w-xl">
        <PageHeader
          title="TACTICAL DEBRIEF"
          subtitle="Target room analyzed. Optimal chair coordinates locked."
          badge="DEBRIEF #CR-402"
          badgeRotate={-2}
          backHref="/classroom"
        />

        <div className="space-y-6">
          {/* Room Overview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="brutal-card p-4 sm:p-6 border-t-[8px] border-t-irikk-red relative bg-irikk-white">
              {/* Registration marks */}
              <span className="absolute top-1.5 left-2 font-mono text-[9px] text-irikk-near-black/40 select-none">
                + SECTOR_SURVEY
              </span>
              <span className="absolute top-1.5 right-2 font-mono text-[9px] text-irikk-near-black/40 select-none">
                GRID_LOC +
              </span>

              {/* Top classification tags */}
              <div className="flex flex-wrap justify-between items-center gap-2 mb-4 pt-2">
                <span className="zine-tape text-[9px] sm:text-[10px] uppercase font-bold tracking-widest -rotate-2">
                  TOPOGRAPHY MAPPED
                </span>
                <span className="font-mono text-[11px] sm:text-xs font-bold bg-irikk-black text-irikk-white px-2 py-0.5 uppercase tracking-wider rotate-1 shadow-[2px_2px_0px_#E62B1E]">
                  {result.confidence}% SENSOR ACCURACY
                </span>
              </div>

              {/* Rubber Stamp Header */}
              <div className="py-2 text-center my-2 border-y-2 border-dashed border-irikk-black/30">
                <span className="stamp-badge stamp-black inline-block text-base sm:text-xl md:text-2xl tracking-wider rotate-1 break-words max-w-full">
                  [ SECTOR SCAN VALIDATED ]
                </span>
              </div>

              {/* Stats Counters Grid */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 my-3 sm:my-4">
                <div className="p-2 sm:p-3 bg-irikk-paper border-2 border-irikk-black text-center shadow-[2px_2px_0px_#0F0F0F]">
                  <p className="font-display font-black text-xl sm:text-2xl text-irikk-black leading-none">
                    {totalIdentified}
                  </p>
                  <p className="font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-irikk-near-black/60 mt-1">
                    SURVEYED
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-irikk-paper border-2 border-irikk-black text-center shadow-[2px_2px_0px_#0F0F0F]">
                  <p className="font-display font-black text-xl sm:text-2xl text-green-700 leading-none">
                    {availableCount}
                  </p>
                  <p className="font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-green-800 mt-1">
                    VACANT
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-irikk-paper border-2 border-irikk-black text-center shadow-[2px_2px_0px_#0F0F0F]">
                  <p className="font-display font-black text-xl sm:text-2xl text-irikk-red leading-none">
                    {occupiedCount}
                  </p>
                  <p className="font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-irikk-red mt-1">
                    BLOCKED
                  </p>
                </div>
              </div>

              {/* Classroom Context */}
              <div className="p-2.5 sm:p-3 bg-irikk-paper border border-irikk-black/30">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-irikk-black/60 block mb-0.5">
                  ROOM ARCHITECTURE SUMMARY:
                </span>
                <p className="font-body text-xs sm:text-sm text-irikk-near-black leading-relaxed font-medium">
                  {result.classroomDescription}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Best Seat Highlight Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 25 }}
            className="flex justify-center"
          >
            <ScoreDisplay
              score={result.recommendation.score}
              label="OPTIMAL MATCH SCORE"
              size="lg"
            />
          </motion.div>

          {/* Top Recommendation Dossier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="brutal-card p-6 border-l-[8px] border-l-irikk-red space-y-4 relative bg-irikk-white">
              <span className="absolute -top-3 left-4 font-mono text-[11px] font-bold uppercase tracking-wider bg-irikk-red text-irikk-white px-2.5 py-0.5 shadow-[2px_2px_0px_#0F0F0F] -rotate-1">
                ★ OPTIMAL CHAIR TARGET
              </span>

              <div className="pt-2">
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-irikk-red block">
                  VERBAL GRID DESIGNATION:
                </span>
                <h3 className="font-display font-black text-2xl md:text-3xl text-irikk-black leading-tight tracking-tight mt-1">
                  &ldquo;{result.recommendation.verbalLocation}&rdquo;
                </h3>
              </div>

              <div className="p-3.5 bg-irikk-paper border-2 border-irikk-black space-y-1">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-irikk-red block">
                  // STRATEGIC RATIONALE:
                </span>
                <p className="font-body text-sm text-irikk-near-black font-medium leading-relaxed">
                  {result.recommendation.reason}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Seat Candidates List */}
          {result.seats.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b-2 border-irikk-black pb-1">
                <h3 className="font-display font-black text-xl text-irikk-black uppercase tracking-tight">
                  EVALUATED SEAT CANDIDATES ({result.seats.length})
                </h3>
                <span className="font-mono text-xs font-bold text-irikk-red uppercase">
                  [ RANKED BY FIT ]
                </span>
              </div>

              {result.seats.map((seat, i) => {
                const isBest =
                  seat.verbalLocation === result.recommendation.verbalLocation;

                return (
                  <ResultCard
                    key={i}
                    title={
                      isBest
                        ? "OPTIMAL TARGET"
                        : seat.availability === "available"
                        ? `AVAILABLE CANDIDATE #${i + 1}`
                        : `${seat.availability.toUpperCase()} SEAT`
                    }
                    subtitle={seat.verbalLocation}
                    icon={
                      isBest ? (
                        <Trophy size={22} strokeWidth={3} />
                      ) : (
                        <MapPin size={22} strokeWidth={3} />
                      )
                    }
                    score={seat.suitabilityScore}
                    scoreLabel="Match Index"
                    badge={
                      isBest
                        ? "TOP PICK"
                        : seat.availability === "available"
                        ? `#${i + 1}`
                        : seat.availability.toUpperCase()
                    }
                    badgeVariant={
                      isBest
                        ? "red"
                        : seat.availability === "available"
                        ? "black"
                        : "white"
                    }
                    pros={seat.observations}
                    cons={seat.concerns}
                    index={i}
                    className="mb-4"
                  >
                    {/* Visual Factor Badges in High Contrast Grid */}
                    <div className="pt-3 border-t-2 border-irikk-black/20 grid grid-cols-2 gap-2 text-xs font-mono text-irikk-near-black">
                      <div className="flex items-center gap-1.5 p-1.5 bg-irikk-paper border border-irikk-black/20">
                        <Eye size={14} className="text-irikk-red flex-shrink-0" />
                        <span>Visibility: <strong>{seat.factors.visibility}%</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 p-1.5 bg-irikk-paper border border-irikk-black/20">
                        <Maximize2 size={14} className="text-irikk-black flex-shrink-0" />
                        <span>Legroom: <strong>{seat.factors.legroom}%</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 p-1.5 bg-irikk-paper border border-irikk-black/20">
                        <Shield size={14} className="text-irikk-black flex-shrink-0" />
                        <span>Privacy: <strong>{seat.factors.privacy}%</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 p-1.5 bg-irikk-paper border border-irikk-black/20">
                        <Footprints size={14} className="text-irikk-black flex-shrink-0" />
                        <span>Exit Access: <strong>{seat.factors.accessibility}%</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 p-1.5 bg-irikk-paper border border-irikk-black/20">
                        <Users size={14} className="text-irikk-black flex-shrink-0" />
                        <span>
                          Crowd:{" "}
                          <strong>
                            {seat.factors.crowding > 60
                              ? "High"
                              : seat.factors.crowding > 30
                              ? "Med"
                              : "Low"}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 p-1.5 bg-irikk-paper border border-irikk-black/20">
                        <Sun size={14} className="text-irikk-black flex-shrink-0" />
                        <span>
                          Glare:{" "}
                          <strong>
                            {seat.factors.sunExposure > 50
                              ? "High"
                              : seat.factors.sunExposure > 20
                              ? "Mod"
                              : "Low"}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </ResultCard>
                );
              })}
            </div>
          )}

          {/* Room-wide Observations & Concerns */}
          {(result.observations.length > 0 || result.concerns.length > 0) && (
            <ResultCard
              title="OVERALL SECTOR TELEMETRY"
              subtitle="General room-wide visual signals detected by Gemini Flash."
              icon={<Sparkles size={22} strokeWidth={3} />}
              badge="TELEMETRY"
              badgeVariant="black"
              pros={result.observations}
              cons={result.concerns}
              index={result.seats.length + 1}
            />
          )}

          {/* Post-Seat Forensic Investigation */}
          <PostSeatFeedback sourceContext="classroom" />

          {/* Actions */}
          <motion.div
            className="space-y-3 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 25 }}
          >
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => {
                if (typeof window !== "undefined") {
                  sessionStorage.removeItem("irikk_classroom_result");
                  sessionStorage.removeItem("irikk_classroom_purpose");
                  sessionStorage.removeItem("irikk_classroom_preferences");
                }
                router.push("/classroom");
              }}
              icon={<School size={20} strokeWidth={3} />}
            >
              SCAN ANOTHER SECTOR
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
