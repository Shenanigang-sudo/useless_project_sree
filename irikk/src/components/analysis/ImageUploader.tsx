"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  ImagePlus,
  X,
  RefreshCw,
  SwitchCamera,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { validateImageFile, formatFileSize } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  selectedImage: File | null;
  previewUrl: string | null;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function ImageUploader({
  onImageSelect,
  onImageRemove,
  selectedImage,
  previewUrl,
  title = "SHOW US THE SEAT",
  subtitle = "Take a photo or upload one",
  className,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        return;
      }
      setError(null);
      onImageSelect(file);
    },
    [onImageSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  // Stop camera media tracks
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setCameraLoading(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Check if multiple camera devices exist
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const videoDevices = devices.filter((d) => d.kind === "videoinput");
          setHasMultipleCameras(videoDevices.length > 1);
        })
        .catch(() => setHasMultipleCameras(false));
    }
  }, []);

  // Start camera stream
  const startCamera = useCallback(
    async (mode: "environment" | "user" = facingMode) => {
      setError(null);
      setCameraLoading(true);
      setIsCameraActive(true);

      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setError("Camera access is not supported on this browser/device.");
        setIsCameraActive(false);
        setCameraLoading(false);
        return;
      }

      try {
        let stream: MediaStream;
        try {
          // Try with desired facingMode
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: mode },
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            },
            audio: false,
          });
        } catch {
          // Fallback to basic video if facingMode constraint fails (e.g. desktop webcams)
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCameraLoading(false);
      } catch (err: unknown) {
        const errMessage =
          err instanceof Error && err.name === "NotAllowedError"
            ? "Camera permission denied. Please allow camera access in your browser settings."
            : "Could not access camera. Please check your permissions or choose an image.";
        setError(errMessage);
        stopCamera();
      }
    },
    [facingMode, stopCamera]
  );

  // Toggle between front and rear cameras
  const toggleCamera = () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Capture current frame from live video
  const takeSnapshot = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      setError("Camera not ready yet. Please wait a moment.");
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setError("Could not capture frame from camera.");
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError("Failed to create snapshot image.");
            return;
          }

          const filename = `irikk-capture-${Date.now()}.jpg`;
          const file = new File([blob], filename, { type: "image/jpeg" });

          stopCamera();
          handleFile(file);
        },
        "image/jpeg",
        0.95
      );
    } catch {
      setError("Failed to capture snapshot from camera.");
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <AnimatePresence mode="wait">
        {/* State 1: Live In-App Camera View */}
        {isCameraActive ? (
          <motion.div
            key="camera"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="brutal-card rounded-xl overflow-hidden bg-irikk-black relative"
          >
            {/* Live Camera Viewfinder */}
            <div className="relative w-full h-72 sm:h-96 bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className="w-full h-full object-cover"
              />

              {cameraLoading && (
                <div className="absolute inset-0 bg-irikk-black/80 flex flex-col items-center justify-center gap-2 text-irikk-white">
                  <RefreshCw className="animate-spin text-irikk-red" size={32} strokeWidth={3} />
                  <p className="font-display font-bold text-sm uppercase">Starting Camera...</p>
                </div>
              )}

              {/* Viewfinder Corner Overlays */}
              <div className="absolute inset-4 pointer-events-none border-2 border-white/30 rounded-lg flex flex-col justify-between p-2">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-irikk-red" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-irikk-red" />
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-irikk-red" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-irikk-red" />
                </div>
              </div>

              {/* Top Controls */}
              <div className="absolute top-3 left-3">
                <Badge variant="red" rotate={-2}>
                  LIVE CAMERA
                </Badge>
              </div>

              <div className="absolute top-3 right-3 flex items-center gap-2">
                {hasMultipleCameras && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleCamera}
                    className="p-2.5 bg-irikk-white text-irikk-black border-2 border-irikk-black rounded-lg shadow-[2px_2px_0px_#1A1A1A] cursor-pointer"
                    aria-label="Switch camera"
                    title="Switch camera"
                  >
                    <SwitchCamera size={18} strokeWidth={3} />
                  </motion.button>
                )}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={stopCamera}
                  className="p-2.5 bg-irikk-red text-irikk-white border-2 border-irikk-black rounded-lg shadow-[2px_2px_0px_#1A1A1A] cursor-pointer"
                  aria-label="Close camera"
                  title="Close camera"
                >
                  <X size={18} strokeWidth={3} />
                </motion.button>
              </div>
            </div>

            {/* Bottom Shutter Action Bar */}
            <div className="p-4 bg-irikk-white border-t-3 border-irikk-black flex items-center justify-between gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={stopCamera}
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                size="md"
                className="flex-1"
                icon={<Camera size={20} strokeWidth={3} />}
                onClick={takeSnapshot}
              >
                SNAP PHOTO
              </Button>
            </div>
          </motion.div>
        ) : previewUrl && selectedImage ? (
          /* State 2: Selected Image Preview */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative brutal-card rounded-xl overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Selected image preview"
              className="w-full h-56 md:h-72 object-cover"
            />
            <div className="absolute top-3 right-3 flex gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => startCamera()}
                className="p-2 bg-irikk-white text-irikk-black border-2 border-irikk-black rounded-lg shadow-[2px_2px_0px_#1A1A1A] cursor-pointer"
                aria-label="Retake photo with camera"
                title="Retake photo"
              >
                <Camera size={18} strokeWidth={3} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={openFilePicker}
                className="p-2 bg-irikk-white border-2 border-irikk-black rounded-lg shadow-[2px_2px_0px_#1A1A1A] cursor-pointer"
                aria-label="Choose another file"
                title="Choose file"
              >
                <RefreshCw size={18} strokeWidth={3} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  onImageRemove();
                  setError(null);
                }}
                className="p-2 bg-irikk-red text-irikk-white border-2 border-irikk-black rounded-lg shadow-[2px_2px_0px_#1A1A1A] cursor-pointer"
                aria-label="Remove image"
                title="Remove image"
              >
                <X size={18} strokeWidth={3} />
              </motion.button>
            </div>
            <div className="p-3 border-t-2 border-irikk-black bg-irikk-off-white">
              <p className="font-body text-sm text-irikk-near-black truncate">
                📎 {selectedImage.name}
              </p>
              <p className="font-body text-xs text-irikk-gray-dark">
                {formatFileSize(selectedImage.size)}
              </p>
            </div>
          </motion.div>
        ) : (
          /* State 3: Upload Box with Choose Image & Take Photo */
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
              "brutal-card rounded-xl p-8 md:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-150 min-h-[240px]",
              isDragging && "border-irikk-red bg-irikk-red/5 shadow-[4px_4px_0px_#E63226]"
            )}
            onClick={openFilePicker}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            aria-label={`${title}. Click to choose image`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openFilePicker();
              }
            }}
          >
            <motion.div
              animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Camera
                size={48}
                strokeWidth={2.5}
                className={cn(
                  "mb-4",
                  isDragging ? "text-irikk-red" : "text-irikk-black"
                )}
              />
            </motion.div>

            <h3 className="font-display font-bold text-xl md:text-2xl text-irikk-black uppercase tracking-tight mb-2">
              {title}
            </h3>
            <p className="font-body text-sm text-irikk-near-black/60 mb-6 max-w-xs">
              {subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="sm"
                icon={<ImagePlus size={16} strokeWidth={3} />}
                onClick={(e) => {
                  e.stopPropagation();
                  openFilePicker();
                }}
              >
                Choose Image
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={<Camera size={16} strokeWidth={3} />}
                onClick={(e) => {
                  e.stopPropagation();
                  startCamera();
                }}
              >
                Take Photo
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-irikk-red/10 border-2 border-irikk-red rounded-lg flex items-center gap-2"
        >
          <AlertTriangle size={18} strokeWidth={3} className="text-irikk-red flex-shrink-0" />
          <p className="font-body text-sm text-irikk-red font-medium">{error}</p>
        </motion.div>
      )}

      {/* Hidden file input for file picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        onChange={handleFileInput}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}
