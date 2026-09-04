"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { School, ArrowRight, Sparkles, AlertTriangle, Crosshair } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/analysis/ImageUploader";
import { PurposeSelector } from "@/components/analysis/PurposeSelector";
import { PreferenceSelector } from "@/components/analysis/PreferenceSelector";
import { LoadingState } from "@/components/ui/LoadingState";
import { CLASSROOM_PURPOSES, PREFERENCES } from "@/lib/constants";
import type { ClassroomPurpose, Preference } from "@/types";

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
        reject(new Error("Failed to process classroom image"));
      }
    };
    reader.onerror = () => reject(new Error("Unable to read image file"));
    reader.readAsDataURL(file);
  });
}

export default function ClassroomPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<ClassroomPurpose | null>(null);
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

  const handlePurposeSelect = useCallback((id: ClassroomPurpose) => {
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
      setAnalysisError("Please select or capture a classroom photo first.");
      return;
    }
    if (!selectedPurpose) {
      setAnalysisError("Please choose a purpose for sitting in this classroom.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // 1. Convert File to base64 Data URL
      const base64Image = await fileToBase64(selectedImage);

      // 2. Real POST request to /api/analyze with mode: classroom
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "classroom",
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
            `Classroom analysis failed with status ${response.status}. Please try again.`
        );
      }

      // 3. Store real classroom analysis in sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("irikk_classroom_result", JSON.stringify(json.data));
        sessionStorage.setItem("irikk_classroom_purpose", selectedPurpose);
        sessionStorage.setItem(
          "irikk_classroom_preferences",
          JSON.stringify(selectedPreferences)
        );
      }

      // 4. Navigate to result page
      router.push("/classroom/result");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "The AI choked. Couldn't analyze this classroom. Try another photo.";
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
          title="WHERE SHOULD I SIT?"
          subtitle="Tactical lecture hall reconnaissance & seat recommendation."
          badge="SECTOR SCAN"
          badgeRotate={-2}
          backHref="/"
        />

        {/* Tactical Zine Step Tracker */}
        <div className="mb-6 p-2.5 sm:p-3 bg-irikk-white border-2 border-irikk-black shadow-[3px_3px_0px_#0F0F0F] select-none">
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider">
            <span className="text-irikk-near-black/60">// RECON PROCEDURE</span>
            <span className="text-irikk-red">
              STEP {stepIndex + 1} OF 4
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1 sm:gap-1.5 mt-2">
            {[
              { num: "01", name: "ROOM" },
              { num: "02", name: "INTENT" },
              { num: "03", name: "DEMANDS" },
              { num: "04", name: "VERDICT" },
            ].map((step, idx) => {
              const isActive = idx === stepIndex;
              const isPassed = idx < stepIndex;
              return (
                <div
                  key={step.num}
                  className={`p-1 sm:p-1.5 text-center border-2 transition-all ${
                    isActive
                      ? "bg-irikk-red text-irikk-white border-irikk-black shadow-[2px_2px_0px_#0F0F0F]"
                      : isPassed
                      ? "bg-irikk-black text-irikk-white border-irikk-black"
                      : "bg-irikk-paper text-irikk-near-black/50 border-irikk-black/20"
                  }`}
                >
                  <p className="font-mono text-[8px] sm:text-[9px] leading-tight font-black">
                    {step.num}
                  </p>
                  <p className="font-display text-[8px] sm:text-[9px] uppercase tracking-wider font-bold truncate">
                    {step.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Loading State Display */}
        {isAnalyzing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="brutal-card p-8 bg-irikk-white text-center space-y-4"
          >
            <LoadingState
              message="EVALUATING LECTURE HALL TOPOGRAPHY..."
              submessage="Gemini Flash 3.6 is calculating line-of-sight, acoustic exposure, and escape vectors."
            />
          </motion.div>
        ) : (
          /* Normal Classroom Steps */
          <div className="space-y-7">
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
                title="UPLOAD ROOM TELEMETRY"
                subtitle="Take or upload a wide photograph of the classroom or lecture hall."
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
                    purposes={CLASSROOM_PURPOSES}
                    selected={selectedPurpose}
                    onSelect={(id) => handlePurposeSelect(id as ClassroomPurpose)}
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
                className="brutal-card p-4 border-l-[6px] border-l-irikk-red bg-red-50 text-irikk-black space-y-1.5"
              >
                <div className="flex items-center gap-2 font-display font-black uppercase text-irikk-red text-sm tracking-wide">
                  <AlertTriangle size={18} strokeWidth={3} />
                  <span>CRITICAL AI MALFUNCTION</span>
                </div>
                <p className="font-body text-sm text-irikk-near-black leading-relaxed font-medium">
                  {analysisError}
                </p>
                <p className="font-mono text-[10px] text-irikk-red font-bold uppercase tracking-wider pt-1">
                  [ CHECK INTERNET / RETAKE HIGH-RESOLUTION PHOTO ]
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
                    icon={<Crosshair size={20} strokeWidth={3} />}
                    iconRight={<ArrowRight size={20} strokeWidth={3} />}
                  >
                    {isAnalyzing ? "EXECUTING RECON..." : "CALCULATE OPTIMAL SEAT"}
                  </Button>
                  <p className="text-center font-mono text-[11px] text-irikk-near-black/60 uppercase tracking-widest mt-3">
                    [ WE EVALUATE EVERY VISIBLE SEAT. NO EMBARRASSMENT GUARANTEED ]
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
