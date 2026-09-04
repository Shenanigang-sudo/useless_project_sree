// IRIKK Type Definitions

// Seat analysis types
export type SeatStatus = "occupied" | "claimed" | "available" | "unknown";

export type SeatPurpose =
  | "sleeping"
  | "scrolling"
  | "studying"
  | "waiting"
  | "working"
  | "socializing"
  | "avoiding_people"
  | "eating"
  | "chilling";

export type ClassroomPurpose =
  | "study"
  | "sleep"
  | "scroll"
  | "see_board"
  | "avoid_people"
  | "sit_with_friends"
  | "leave_quickly";

export type Preference =
  | "low_crowd"
  | "high_comfort"
  | "low_sunlight"
  | "more_legroom"
  | "more_privacy"
  | "near_window"
  | "near_door"
  | "good_board_visibility";

export interface PurposeOption {
  id: SeatPurpose | ClassroomPurpose;
  emoji: string;
  label: string;
}

export interface PreferenceOption {
  id: Preference;
  label: string;
  icon?: string;
}

export interface SeatAnalysisResult {
  status: SeatStatus;
  confidence: number;
  description: string;
  qualityScore: number;
  qualityBreakdown: {
    comfort: number;
    lighting: number;
    legroom: number;
    privacy: number;
    accessibility: number;
  };
  funFact: string;
  recommendation: string;
}

export interface ClassroomSeatOption {
  id: string;
  location: string;
  score: number;
  pros: string[];
  cons: string[];
  matchPercentage: number;
}

export interface ClassroomAnalysisResult {
  totalSeats: number;
  availableSeats: number;
  recommendations: ClassroomSeatOption[];
  bestSeat: ClassroomSeatOption;
  analysisNote: string;
}

export interface AnalysisRequest {
  imageFile: File;
  purpose: SeatPurpose | ClassroomPurpose;
  preferences: Preference[];
  type: "seat" | "classroom";
}
