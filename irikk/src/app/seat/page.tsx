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
      <div className="max-w-lg mx-auto px-4 sm:px-5 pt-4 sm:pt-6 pb-20 md:max-w-xl">
        <PageHeader
          title="IS THIS SEAT TAKEN?"
          subtitle="Got a suspicious chair? We'll interrogate every pixel and deliver the verdict."
          badge="SPECIMEN INTAKE"
          badgeRotate={-2}
          formCode="FORM-84-A // SINGLE_CHAIR"
          backHref="/"
        />

        {/* Zine Step Checklist Tracker */}
        <div className="grid grid-cols-4 gap-1 sm:gap-1.5 mb-6 sm:mb-8 font-mono text-[9px] sm:text-[10px] uppercase select-none">
          {[
            { id: "01", label: "SPECIMEN" },
            { id: "02", label: "INTENT" },
            { id: "03", label: "DEMANDS" },
            { id: "04", label: "VERDICT" },
          ].map((step, i) => (
            <div
              key={step.id}
              className={`p-1 sm:p-1.5 border-2 border-irikk-black text-center transition-all ${
                i <= stepIndex
                  ? "bg-irikk-black text-irikk-white shadow-[2px_2px_0px_#E62B1E]"
                  : "bg-irikk-paper text-irikk-gray-dark border-dashed"
              }`}
            >
              <span className="block font-bold text-irikk-red">{step.id}</span>
              <span className="font-bold truncate block">{step.label}</span>
            </div>
          ))}
        </div>

        {/* Loading State Overlay / Card */}
        {isAnalyzing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="brutal-card p-8 bg-irikk-white text-center space-y-4"
          >
            <LoadingState
              message="INTERROGATING THIS CHAIR..."
              submessage="Gemini Vision is inspecting pixel density, cushion ergonomics, and surrounding occupancy."
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
              <div className="font-mono text-[10px] text-irikk-red font-bold uppercase tracking-wider mb-2">
                // 01. PHOTOGRAPHIC EVIDENCE INTAKE
              </div>
              <ImageUploader
                onImageSelect={handleImageSelect}
                onImageRemove={handleImageRemove}
                selectedImage={selectedImage}
                previewUrl={previewUrl}
                title="SHOW US THE SPECIMEN"
                subtitle="Snap a photo or upload. We'll overthink the rest."
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
                  <div className="font-mono text-[10px] text-irikk-red font-bold uppercase tracking-wider mb-2">
                    // 02. DECLARE YOUR BUTT&apos;S INTENTIONS
                  </div>
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
                  <div className="font-mono text-[10px] text-irikk-red font-bold uppercase tracking-wider mb-2">
                    // 03. SPECIAL DEMANDS & COMPLAINTS
                  </div>
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
                className="brutal-card p-4 border-l-[6px] border-l-irikk-red bg-red-50 text-irikk-black space-y-1"
              >
                <div className="flex items-center gap-2 font-mono font-bold uppercase text-irikk-red text-xs tracking-wider">
                  <AlertTriangle size={16} strokeWidth={3} />
                  <span>ANALYSIS ERROR // INTERROGATION FAILED</span>
                </div>
                <p className="font-body text-xs sm:text-sm text-irikk-near-black font-medium">
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
                    {isAnalyzing ? "INTERROGATING..." : "EXECUTE CHAIR VERDICT"}
                  </Button>
                  <p className="text-center font-mono text-[11px] text-irikk-gray-dark mt-2.5 uppercase tracking-wider">
                    ※ Powered by questionable levels of seating intelligence.
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
