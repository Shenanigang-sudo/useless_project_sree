"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/analysis/ImageUploader";
import { PurposeSelector } from "@/components/analysis/PurposeSelector";
import { PreferenceSelector } from "@/components/analysis/PreferenceSelector";
import { LoadingState } from "@/components/ui/LoadingState";
import { SEAT_PURPOSES, PREFERENCES } from "@/lib/constants";
import type { SeatPurpose, Preference } from "@/types";

type Step = "upload" | "purpose" | "preferences" | "ready";

/**
 * Converts a File object to base64 Data URL string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to process image data"));
      }
    };
    reader.onerror = () => reject(new Error("Unable to read image file"));
    reader.readAsDataURL(file);
  });
}

export default function SeatPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<SeatPurpose | null>(null);
  const [selectedPreferences, setSelectedPreferences] = useState<Preference[]>([]);

  // Real analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    setSelectedImage(file);
    setAnalysisError(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setCurrentStep("purpose");
  }, []);

  const handleImageRemove = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedImage(null);
    setPreviewUrl(null);
    setAnalysisError(null);
    setCurrentStep("upload");
  }, [previewUrl]);

  const handlePurposeSelect = useCallback((id: SeatPurpose) => {
    setSelectedPurpose(id);
    setAnalysisError(null);
    setCurrentStep("preferences");
  }, []);

  const handlePreferenceToggle = useCallback((id: Preference) => {
    setSelectedPreferences((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
    setCurrentStep("ready");
  }, []);

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setAnalysisError("Please select or capture a photo of the seat first.");
      return;
    }
    if (!selectedPurpose) {
      setAnalysisError("Please choose a purpose for sitting.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // 1. Convert actual File to base64 Data URL (not browser blob URL)
      const base64Image = await fileToBase64(selectedImage);

      // 2. Real POST request to /api/analyze
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "seat",
          image: base64Image,
          purpose: selectedPurpose,
          preferences: selectedPreferences,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(
          json.message ||
            json.error ||
            `Analysis failed with status ${response.status}. Please try again.`
        );
      }

      // 3. Store complete Gemini response in sessionStorage for /seat/result
      if (typeof window !== "undefined") {
        sessionStorage.setItem("irikk_seat_result", JSON.stringify(json.data));
      }

      // 4. Navigate to result page
      router.push("/seat/result");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Unable to complete visual analysis. Please check your connection and try again.";
      setAnalysisError(errorMessage);
      setIsAnalyzing(false);
    }
  };

  const isReadyToAnalyze = selectedImage && selectedPurpose && !isAnalyzing;

  const stepIndex = useMemo(() => {
    const steps: Step[] = ["upload", "purpose", "preferences", "ready"];
    return steps.indexOf(currentStep);
  }, [currentStep]);

  return (
    <main className="page-wrapper">
      <div className="max-w-lg mx-auto px-5 pt-6 pb-20 md:max-w-xl">
        <PageHeader
          title="IS THIS SEAT TAKEN?"
          subtitle="Got a suspicious chair? Time to investigate."
          badge="SEAT CHECK"
          badgeRotate={-2}
          backHref="/"
        />

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-8">
          {["Photo", "Purpose", "Prefs", "Go"].map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-full h-1.5 rounded-full transition-colors duration-300 ${
                    i <= stepIndex ? "bg-irikk-red" : "bg-irikk-gray"
                  }`}
                />
                <span
                  className={`font-display text-[10px] font-bold uppercase tracking-wider mt-1 ${
                    i <= stepIndex ? "text-irikk-red" : "text-irikk-gray-dark"
                  }`}
                >
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State Overlay / Card */}
        {isAnalyzing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="brutal-card rounded-xl p-8 bg-irikk-white text-center space-y-4"
          >
            <LoadingState
              message="Analyzing your seat..."
              submessage="Gemini Vision is inspecting occupancy, cushion ergonomics, and surrounding space."
            />
          </motion.div>
        ) : (
          /* Normal Step UI */
          <div className="space-y-8">
            {/* Step 1: Upload */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <ImageUploader
                onImageSelect={handleImageSelect}
                onImageRemove={handleImageRemove}
                selectedImage={selectedImage}
                previewUrl={previewUrl}
                title="SHOW US THE SEAT"
                subtitle="Take a photo or upload one. We'll do the rest."
              />
            </motion.section>

            {/* Step 2: Purpose */}
            <AnimatePresence>
              {(currentStep === "purpose" ||
                currentStep === "preferences" ||
                currentStep === "ready") && (
                <motion.section
                  initial={{ opacity: 0, y: 20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <PurposeSelector
                    purposes={SEAT_PURPOSES}
                    selected={selectedPurpose}
                    onSelect={(id) => handlePurposeSelect(id as SeatPurpose)}
                  />
                </motion.section>
              )}
            </AnimatePresence>

            {/* Step 3: Preferences */}
            <AnimatePresence>
              {(currentStep === "preferences" || currentStep === "ready") && (
                <motion.section
                  initial={{ opacity: 0, y: 20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <PreferenceSelector
                    preferences={PREFERENCES}
                    selected={selectedPreferences}
                    onToggle={handlePreferenceToggle}
                  />
                </motion.section>
              )}
            </AnimatePresence>

            {/* Error Message */}
            {analysisError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="brutal-card p-4 rounded-xl border-l-[6px] border-l-irikk-red bg-red-50 text-irikk-black space-y-1"
              >
                <div className="flex items-center gap-2 font-display font-bold uppercase text-irikk-red text-sm">
                  <AlertTriangle size={18} strokeWidth={3} />
                  <span>Analysis Error</span>
                </div>
                <p className="font-body text-sm text-irikk-near-black/80">
                  {analysisError}
                </p>
              </motion.div>
            )}

            {/* Submit */}
            <AnimatePresence>
              {selectedImage && selectedPurpose && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="pt-2"
                >
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={!isReadyToAnalyze}
                    onClick={handleAnalyze}
                    icon={<Sparkles size={20} strokeWidth={3} />}
                    iconRight={<ArrowRight size={20} strokeWidth={3} />}
                  >
                    {isAnalyzing ? "ANALYZING..." : "ANALYZE THIS SEAT"}
                  </Button>
                  <p className="text-center font-body text-xs text-irikk-gray-dark mt-3">
                    This is probably more analysis than your seat deserves.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
