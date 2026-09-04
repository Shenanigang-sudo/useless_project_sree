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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { ScoreDisplay } from "@/components/ui/ScoreDisplay";
import { ResultCard } from "@/components/results/ResultCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
        <div className="max-w-lg mx-auto px-5 pt-12 pb-20 md:max-w-xl text-center">
          <p className="font-display font-bold text-lg uppercase tracking-wide">
            Loading classroom analysis....
          </p>
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
            title="CLASSROOM ANALYSIS"
            subtitle="Real AI seating recommendation."
            badge="RESULTS"
            badgeRotate={2}
            backHref="/classroom"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="brutal-card rounded-xl p-8 bg-irikk-white text-center space-y-4"
          >
            <div className="w-16 h-16 mx-auto bg-irikk-gray border-3 border-irikk-black rounded-xl flex items-center justify-center">
              <AlertCircle size={32} strokeWidth={3} className="text-irikk-red" />
            </div>
            <h2 className="font-display font-bold text-2xl uppercase tracking-tight text-irikk-black">
              NO CLASSROOM ANALYSIS YET
            </h2>
            <p className="font-body text-sm text-irikk-near-black/70 max-w-sm mx-auto leading-relaxed">
              You haven&apos;t scanned a classroom yet. Take or upload a photo to get AI seat recommendations based on your preferences.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push("/classroom")}
                icon={<School size={20} strokeWidth={3} />}
              >
                ANALYZE A CLASSROOM
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
            title="CLASSROOM ANALYSIS"
            subtitle="AI seating verdict."
            badge="UNCERTAIN"
            badgeRotate={-2}
            backHref="/classroom"
          />

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="brutal-card rounded-xl p-6 border-l-[6px] border-l-irikk-black space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-irikk-gray border-2 border-irikk-black rounded-lg">
                  <AlertTriangle size={24} strokeWidth={3} className="text-irikk-red" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-2xl uppercase tracking-tight text-irikk-black">
                    IRIKK ISN&apos;T SURE
                  </h2>
                  <p className="font-body text-sm text-irikk-near-black/60">
                    {result.confidence}% visual confidence
                  </p>
                </div>
              </div>

              <p className="font-body text-sm text-irikk-near-black/80 leading-relaxed font-medium">
                {result.recommendation.reason ||
                  "The AI could not confidently identify a suitable available seat from this photograph."}
              </p>

              {result.classroomDescription && (
                <div className="p-3 bg-irikk-gray/40 border border-irikk-black rounded-lg">
                  <p className="font-body text-xs text-irikk-near-black/70 leading-relaxed">
                    <span className="font-bold">Room context:</span>{" "}
                    {result.classroomDescription}
                  </p>
                </div>
              )}

              {result.concerns && result.concerns.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-irikk-black">
                    Key Concerns:
                  </span>
                  <ul className="space-y-1.5">
                    {result.concerns.map((concern, idx) => (
                      <li
                        key={idx}
                        className="font-body text-sm text-irikk-near-black flex items-start gap-2"
                      >
                        <span className="text-irikk-red font-bold">−</span>
                        <span>{concern}</span>
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
                TRY ANOTHER PHOTO
              </Button>
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => router.push("/")}
                iconRight={<ArrowRight size={18} strokeWidth={3} />}
              >
                BACK TO HOME
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
      <div className="max-w-lg mx-auto px-5 pt-6 pb-20 md:max-w-xl">
        <PageHeader
          title="YOUR SEATS AWAIT"
          subtitle="We judged every chair. Here are the findings."
          badge="RESULTS"
          badgeRotate={2}
          backHref="/classroom"
        />

        <div className="space-y-6">
          {/* Room Overview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="brutal-card rounded-xl p-6 border-t-[6px] border-t-irikk-red relative">
              <div className="absolute -top-3 right-4">
                <Badge variant="black" rotate={2}>
                  {result.confidence}% CONFIDENT
                </Badge>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="p-2.5 bg-irikk-red text-irikk-white border-2 border-irikk-black rounded-lg shadow-[2px_2px_0px_#1A1A1A]">
                  <School size={24} strokeWidth={3} />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl text-irikk-black uppercase tracking-tight">
                    ROOM SCANNED
                  </h2>
                  <p className="font-body text-sm text-irikk-near-black/60">
                    Visual analysis complete
                  </p>
                </div>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                <div className="brutal-card-sm rounded-lg p-2.5 text-center">
                  <p className="font-display font-bold text-2xl text-irikk-black">
                    {totalIdentified}
                  </p>
                  <p className="font-display text-[9px] font-bold uppercase tracking-wider text-irikk-gray-dark">
                    Scanned
                  </p>
                </div>
                <div className="brutal-card-sm rounded-lg p-2.5 text-center">
                  <p className="font-display font-bold text-2xl text-green-600">
                    {availableCount}
                  </p>
                  <p className="font-display text-[9px] font-bold uppercase tracking-wider text-irikk-gray-dark">
                    Available
                  </p>
                </div>
                <div className="brutal-card-sm rounded-lg p-2.5 text-center">
                  <p className="font-display font-bold text-2xl text-irikk-red">
                    {occupiedCount}
                  </p>
                  <p className="font-display text-[9px] font-bold uppercase tracking-wider text-irikk-gray-dark">
                    Occupied
                  </p>
                </div>
              </div>

              <p className="font-body text-sm text-irikk-near-black/80 leading-relaxed">
                {result.classroomDescription}
              </p>
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
              label="Best Match Score"
              size="lg"
            />
          </motion.div>

          {/* Top Recommendation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="brutal-card rounded-xl p-6 border-l-[6px] border-l-irikk-red space-y-3 relative">
              <div className="absolute -top-3 left-4">
                <Badge variant="red" rotate={-2}>
                  RECOMMENDED SEAT
                </Badge>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <div className="p-2 bg-yellow-100 border-2 border-irikk-black rounded-lg text-yellow-700 mt-1 flex-shrink-0">
                  <Trophy size={22} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-irikk-black leading-snug">
                    &ldquo;{result.recommendation.verbalLocation}&rdquo;
                  </h3>
                </div>
              </div>

              <div className="p-3 bg-irikk-gray/30 border border-irikk-black rounded-lg">
                <span className="font-display text-[11px] font-bold uppercase tracking-wider text-irikk-red block mb-1">
                  Why this seat:
                </span>
                <p className="font-body text-sm text-irikk-near-black/80 leading-relaxed">
                  {result.recommendation.reason}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Seat Candidates List */}
          {result.seats.length > 0 && (
            <div className="space-y-4 pt-2">
              <h3 className="font-display font-bold text-lg text-irikk-black uppercase tracking-tight">
                SEATS EVALUATED ({result.seats.length})
              </h3>

              {result.seats.map((seat, i) => {
                const isBest =
                  seat.verbalLocation === result.recommendation.verbalLocation;

                return (
                  <ResultCard
                    key={i}
                    title={
                      isBest
                        ? "TOP PICK"
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
                    scoreLabel="Suitability"
                    badge={
                      isBest
                        ? "BEST MATCH"
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
                    {/* Visual Factor Badges (respecting higher=better vs higher=undesirable) */}
                    <div className="pt-3 border-t border-irikk-gray grid grid-cols-2 gap-2 text-xs font-body text-irikk-near-black">
                      <div className="flex items-center gap-1.5">
                        <Eye size={14} className="text-irikk-red flex-shrink-0" />
                        <span>Visibility: <strong>{seat.factors.visibility}%</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Maximize2 size={14} className="text-irikk-black flex-shrink-0" />
                        <span>Legroom: <strong>{seat.factors.legroom}%</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Shield size={14} className="text-irikk-black flex-shrink-0" />
                        <span>Privacy: <strong>{seat.factors.privacy}%</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Footprints size={14} className="text-irikk-black flex-shrink-0" />
                        <span>Exit Access: <strong>{seat.factors.accessibility}%</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-irikk-black flex-shrink-0" />
                        <span>
                          Crowding:{" "}
                          <strong>
                            {seat.factors.crowding > 60
                              ? "High"
                              : seat.factors.crowding > 30
                              ? "Medium"
                              : "Low"}{" "}
                            ({seat.factors.crowding}%)
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Sun size={14} className="text-irikk-black flex-shrink-0" />
                        <span>
                          Sun Glare:{" "}
                          <strong>
                            {seat.factors.sunExposure > 50
                              ? "High"
                              : seat.factors.sunExposure > 20
                              ? "Moderate"
                              : "Low"}{" "}
                            ({seat.factors.sunExposure}%)
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
              title="ROOM OBSERVATIONS & CONCERNS"
              subtitle="General room-wide visual insights detected by Gemini."
              icon={<Sparkles size={22} strokeWidth={3} />}
              badge="GENERAL"
              badgeVariant="black"
              pros={result.observations}
              cons={result.concerns}
              index={result.seats.length + 1}
            />
          )}

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
              SCAN ANOTHER ROOM
            </Button>
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => router.push("/")}
              iconRight={<ArrowRight size={18} strokeWidth={3} />}
            >
              BACK TO HOME
            </Button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
