import type {
  PurposeOption,
  PreferenceOption,
  SeatPurpose,
  ClassroomPurpose,
} from "@/types";

export const SEAT_PURPOSES: PurposeOption[] = [
  { id: "sleeping" as SeatPurpose, emoji: "😴", label: "Sleeping" },
  { id: "scrolling" as SeatPurpose, emoji: "📱", label: "Scrolling" },
  { id: "studying" as SeatPurpose, emoji: "📚", label: "Studying" },
  { id: "waiting" as SeatPurpose, emoji: "⏳", label: "Waiting" },
  { id: "working" as SeatPurpose, emoji: "💻", label: "Working" },
  { id: "socializing" as SeatPurpose, emoji: "🗣️", label: "Socializing" },
  { id: "avoiding_people" as SeatPurpose, emoji: "🫥", label: "Avoiding people" },
  { id: "eating" as SeatPurpose, emoji: "🍔", label: "Eating" },
  { id: "chilling" as SeatPurpose, emoji: "✨", label: "Just chilling" },
];

export const CLASSROOM_PURPOSES: PurposeOption[] = [
  { id: "study" as ClassroomPurpose, emoji: "📚", label: "Study" },
  { id: "sleep" as ClassroomPurpose, emoji: "😴", label: "Sleep" },
  { id: "scroll" as ClassroomPurpose, emoji: "📱", label: "Scroll" },
  { id: "see_board" as ClassroomPurpose, emoji: "👀", label: "See the board" },
  { id: "avoid_people" as ClassroomPurpose, emoji: "🫥", label: "Avoid people" },
  { id: "sit_with_friends" as ClassroomPurpose, emoji: "🗣️", label: "Sit with friends" },
  { id: "leave_quickly" as ClassroomPurpose, emoji: "🚪", label: "Leave quickly" },
];

export const PREFERENCES: PreferenceOption[] = [
  { id: "low_crowd", label: "Low crowd" },
  { id: "high_comfort", label: "High comfort" },
  { id: "low_sunlight", label: "Low sunlight" },
  { id: "more_legroom", label: "More legroom" },
  { id: "more_privacy", label: "More privacy" },
  { id: "near_window", label: "Near window" },
  { id: "near_door", label: "Near door" },
  { id: "good_board_visibility", label: "Good board visibility" },
];

export const PLAYFUL_QUOTES = [
  "Seat selection, unnecessarily optimized.",
  "Your spine deserves better.",
  "Stop standing. Find a chair.",
  "We take sitting very seriously.",
  "Powered by questionable levels of intelligence.",
  "This is probably more analysis than your seat deserves.",
  "Because standing is overrated.",
  "The future of sitting is here.",
  "Overthinking chairs since 2024.",
  "No seat left behind.",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
