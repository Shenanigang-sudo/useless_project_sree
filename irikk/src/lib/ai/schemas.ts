import { z } from "zod";

/**
 * Single-seat factor ratings (all 0-100 visual estimates)
 */
export const singleSeatFactorsSchema = z.object({
  comfort: z.number().min(0).max(100),
  crowding: z.number().min(0).max(100),
  sunExposure: z.number().min(0).max(100),
  legroom: z.number().min(0).max(100),
  privacy: z.number().min(0).max(100),
  accessibility: z.number().min(0).max(100),
  noise: z.enum(["low", "medium", "high"]),
});

/**
 * Single-seat analysis response schema
 * Validates Gemini's structured output for /seat
 */
export const singleSeatAnalysisSchema = z.object({
  status: z.enum(["available", "occupied", "claimed", "uncertain"]),
  confidence: z.number().min(0).max(100),
  description: z.string(),
  seatType: z.string(),
  factors: singleSeatFactorsSchema,
  observations: z.array(z.string()),
  concerns: z.array(z.string()),
});

export type SingleSeatAnalysis = z.infer<typeof singleSeatAnalysisSchema>;

/**
 * Classroom seat candidate factor ratings (all 0-100 visual estimates)
 * Higher is better: comfort, legroom, privacy, visibility, lighting, accessibility
 * Higher means more undesirable: crowding, sunExposure
 */
export const classroomSeatFactorsSchema = z.object({
  comfort: z.number().min(0).max(100),
  crowding: z.number().min(0).max(100),
  sunExposure: z.number().min(0).max(100),
  legroom: z.number().min(0).max(100),
  privacy: z.number().min(0).max(100),
  visibility: z.number().min(0).max(100),
  lighting: z.number().min(0).max(100),
  accessibility: z.number().min(0).max(100),
});

/**
 * Individual candidate seat identified in classroom mode
 */
export const classroomSeatCandidateSchema = z.object({
  verbalLocation: z.string(),
  availability: z.enum(["available", "occupied", "blocked", "uncertain"]),
  confidence: z.number().min(0).max(100),
  suitabilityScore: z.number().min(0).max(100),
  factors: classroomSeatFactorsSchema,
  observations: z.array(z.string()),
  concerns: z.array(z.string()),
});

/**
 * Top recommendation for classroom mode
 */
export const classroomRecommendationSchema = z.object({
  verbalLocation: z.string(),
  score: z.number().min(0).max(100),
  reason: z.string(),
});

/**
 * Structured classroom analysis response schema
 * Validates Gemini's structured output for /classroom
 */
export const classroomAnalysisSchema = z.object({
  status: z.enum(["success", "uncertain"]),
  confidence: z.number().min(0).max(100),
  classroomDescription: z.string(),
  seats: z.array(classroomSeatCandidateSchema),
  recommendation: classroomRecommendationSchema,
  observations: z.array(z.string()),
  concerns: z.array(z.string()),
});

export type ClassroomAnalysis = z.infer<typeof classroomAnalysisSchema>;
export type ClassroomSeatCandidate = z.infer<typeof classroomSeatCandidateSchema>;
export type ClassroomSeatFactors = z.infer<typeof classroomSeatFactorsSchema>;
export type ClassroomRecommendation = z.infer<typeof classroomRecommendationSchema>;

/**
 * Incoming POST /api/analyze request validation
 */
export const analyzeRequestSchema = z.object({
  mode: z.enum(["seat", "classroom"]),
  image: z.string().min(1, "Image data is required"),
  purpose: z.string().optional(),
  preferences: z.array(z.string()).optional(),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
