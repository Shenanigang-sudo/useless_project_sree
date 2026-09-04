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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { ScoreDisplay } from "@/components/ui/ScoreDisplay";
import { ResultCard } from "@/components/results/ResultCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
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
        <div className="max-w-lg mx-auto px-5 pt-12 pb-20 md:max-w-xl text-center">
          <p className="font-display font-bold text-lg uppercase tracking-wide">
            Loading analysis...
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
            title="SEAT ANALYSIS"
            subtitle="Real AI vision inspection."
            badge="RESULTS"
            badgeRotate={2}
            backHref="/seat"
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
              No Analysis Found
            </h2>
            <p className="font-body text-sm text-irikk-near-black/70 max-w-sm mx-auto leading-relaxed">
              No active seat inspection was found in this session. Take or upload a photo of a chair to run Gemini Vision.
            </p>
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
      title: "SEAT AVAILABLE",
      subtitle: "No occupant or personal belongings detected",
      badgeColor: "green",
      borderColor: "border-l-green-600",
      iconBg: "bg-green-100",
      icon: <CheckCircle size={24} strokeWidth={3} className="text-green-600" />,
    },
    occupied: {
      title: "SEAT OCCUPIED",
      subtitle: "A person is currently sitting on or using this seat",
      badgeColor: "red",
      borderColor: "border-l-irikk-red",
      iconBg: "bg-red-100",
      icon: <XCircle size={24} strokeWidth={3} className="text-irikk-red" />,
    },
    claimed: {
      title: "SEAT CLAIMED",
      subtitle: "Unoccupied but reserved with personal belongings",
      badgeColor: "amber",
      borderColor: "border-l-amber-500",
      iconBg: "bg-amber-100",
      icon: <ShoppingBag size={24} strokeWidth={3} className="text-amber-600" />,
    },
    uncertain: {
      title: "STATUS UNCERTAIN",
      subtitle: "Insufficient or ambiguous visual evidence to confirm occupancy",
      badgeColor: "gray",
      borderColor: "border-l-irikk-black",
      iconBg: "bg-gray-100",
      icon: <HelpCircle size={24} strokeWidth={3} className="text-irikk-black" />,
    },
  }[result.status];

  return (
    <main className="page-wrapper">
      <div className="max-w-lg mx-auto px-5 pt-6 pb-20 md:max-w-xl">
        <PageHeader
          title="SEAT ANALYSIS"
          subtitle="Real AI vision inspection."
          badge="RESULTS"
          badgeRotate={2}
          backHref="/seat"
        />

        <div className="space-y-6">
          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div
              className={`brutal-card rounded-xl p-6 border-l-[6px] ${statusMeta.borderColor} relative`}
            >
              <div className="absolute -top-3 right-4 flex items-center gap-2">
                <Badge variant="black" rotate={3}>
                  {result.confidence}% CONFIDENT
                </Badge>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`p-2 ${statusMeta.iconBg} border-2 border-irikk-black rounded-lg`}
                >
                  {statusMeta.icon}
                </div>
                <div>
                  <h2 className="font-display font-bold text-2xl text-irikk-black uppercase tracking-tight">
                    {statusMeta.title}
                  </h2>
                  <p className="font-body text-sm text-irikk-near-black/60">
                    {statusMeta.subtitle}
                  </p>
                </div>
              </div>

              {/* Seat Type Tag */}
              {result.seatType && (
                <div className="mb-3">
                  <span className="inline-block font-display text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-irikk-gray border border-irikk-black rounded">
                    Type: {result.seatType}
                  </span>
                </div>
              )}

              {/* Description */}
              <p className="font-body text-sm text-irikk-near-black/80 leading-relaxed">
                {result.description}
              </p>
            </div>
          </motion.div>

          {/* Comfort Rating / Score Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 25 }}
            className="flex justify-center"
          >
            <ScoreDisplay
              score={result.factors.comfort}
              label="Comfort Rating"
              size="lg"
            />
          </motion.div>

          {/* Factor Breakdown */}
          <ResultCard
            title="VISUAL FACTOR BREAKDOWN"
            subtitle="Estimated strictly from visible evidence."
            icon={<Eye size={22} strokeWidth={3} />}
            badge="METRICS"
            index={1}
          >
            <div className="space-y-3 pt-2">
              <ProgressBar
                value={result.factors.comfort}
                label="Comfort"
              />
              <ProgressBar
                value={result.factors.crowding}
                label="Crowding"
              />
              <ProgressBar
                value={result.factors.sunExposure}
                label="Sun Exposure"
              />
              <ProgressBar
                value={result.factors.legroom}
                label="Legroom"
              />
              <ProgressBar
                value={result.factors.privacy}
                label="Privacy"
              />
              <ProgressBar
                value={result.factors.accessibility}
                label="Accessibility"
              />

              {/* Noise Level */}
              <div className="flex items-center justify-between pt-2 border-t-2 border-irikk-gray">
                <span className="font-display text-xs font-bold uppercase tracking-wide text-irikk-black flex items-center gap-1.5">
                  <Volume2 size={16} strokeWidth={2.5} />
                  Estimated Noise Level
                </span>
                <Badge variant="black" rotate={-1}>
                  {result.factors.noise.toUpperCase()}
                </Badge>
              </div>
            </div>
          </ResultCard>

          {/* Key Observations */}
          {result.observations && result.observations.length > 0 && (
            <ResultCard
              title="KEY OBSERVATIONS"
              subtitle="Visible details identified by Gemini Vision."
              icon={<Sparkles size={22} strokeWidth={3} />}
              badge="OBSERVATIONS"
              badgeVariant="red"
              index={2}
            >
              <ul className="space-y-2 pt-1">
                {result.observations.map((obs, idx) => (
                  <li
                    key={idx}
                    className="font-body text-sm text-irikk-near-black flex items-start gap-2"
                  >
                    <span className="text-irikk-red font-bold flex-shrink-0 mt-0.5">
                      +
                    </span>
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </ResultCard>
          )}

          {/* Concerns / Downsides */}
          {result.concerns && result.concerns.length > 0 && (
            <ResultCard
              title="POTENTIAL CONCERNS"
              subtitle="Drawbacks or warnings based on visible cues."
              icon={<AlertTriangle size={22} strokeWidth={3} />}
              badge="WATCH OUT"
              badgeVariant="black"
              index={3}
            >
              <ul className="space-y-2 pt-1">
                {result.concerns.map((concern, idx) => (
                  <li
                    key={idx}
                    className="font-body text-sm text-irikk-near-black flex items-start gap-2"
                  >
                    <span className="text-irikk-black font-bold flex-shrink-0 mt-0.5">
                      −
                    </span>
                    <span>{concern}</span>
                  </li>
                ))}
              </ul>
            </ResultCard>
          )}

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
              CHECK ANOTHER SEAT
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
