import { GoogleGenAI, Type } from "@google/genai";
import {
  singleSeatAnalysisSchema,
  SingleSeatAnalysis,
  classroomAnalysisSchema,
  ClassroomAnalysis,
} from "./schemas";
import { buildSingleSeatPrompt, buildClassroomPrompt } from "./prompts";

/**
 * Centralized Gemini model declaration
 * Single point of change for vision model upgrades
 */
export const GEMINI_MODEL = "gemini-3.7-flash";

/**
 * Singleton client reference
 */
let genAIClient: GoogleGenAI | null = null;

/**
 * Initializes and retrieves the Google GenAI client instance.
 * Must only be invoked server-side.
 * Fails gracefully if GEMINI_API_KEY is not configured in process.env.
 */
export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    throw new Error(
      "GEMINI_API_KEY is not set. Please add it to your server environment (.env.local)."
    );
  }

  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }

  return genAIClient;
}

/**
 * Gemini response schema definition for single seat vision analysis
 * Matches Zod singleSeatAnalysisSchema
 */
const singleSeatResponseSchema = {
  type: Type.OBJECT,
  properties: {
    status: {
      type: Type.STRING,
      enum: ["available", "occupied", "claimed", "uncertain"],
    },
    confidence: {
      type: Type.INTEGER,
      description: "Confidence percentage from 0 to 100",
    },
    description: {
      type: Type.STRING,
      description:
        "Objective visual description of the chair and its immediate surrounding setting",
    },
    seatType: {
      type: Type.STRING,
      description:
        "Specific type of seat (e.g., ergonomic office task chair, wooden dining chair, padded booth, lecture seat)",
    },
    factors: {
      type: Type.OBJECT,
      properties: {
        comfort: {
          type: Type.INTEGER,
          description:
            "Estimated comfort from 0 to 100 based on visible cushioning and ergonomics",
        },
        crowding: {
          type: Type.INTEGER,
          description:
            "Estimated crowding from 0 (isolated) to 100 (tightly packed)",
        },
        sunExposure: {
          type: Type.INTEGER,
          description:
            "Estimated sunlight or window glare exposure from 0 (deep shade) to 100 (direct beam/glare)",
        },
        legroom: {
          type: Type.INTEGER,
          description:
            "Estimated legroom from 0 (cramped/blocked) to 100 (abundant clear space)",
        },
        privacy: {
          type: Type.INTEGER,
          description:
            "Estimated privacy from 0 (in direct line of sight/high-traffic) to 100 (secluded)",
        },
        accessibility: {
          type: Type.INTEGER,
          description:
            "Estimated accessibility from 0 (trapped/obstructed) to 100 (easy walkway/aisle access)",
        },
        noise: {
          type: Type.STRING,
          enum: ["low", "medium", "high"],
          description: "Estimated ambient noise level from visible context",
        },
      },
      required: [
        "comfort",
        "crowding",
        "sunExposure",
        "legroom",
        "privacy",
        "accessibility",
        "noise",
      ],
    },
    observations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Key visible observations regarding the seat and surroundings",
    },
    concerns: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Potential downsides or concerns based strictly on visible evidence",
    },
  },
  required: [
    "status",
    "confidence",
    "description",
    "seatType",
    "factors",
    "observations",
    "concerns",
  ],
};

/**
 * Gemini response schema definition for classroom vision analysis
 * Matches Zod classroomAnalysisSchema
 */
const classroomResponseSchema = {
  type: Type.OBJECT,
  properties: {
    status: {
      type: Type.STRING,
      enum: ["success", "uncertain"],
    },
    confidence: {
      type: Type.INTEGER,
      description: "Overall visual confidence score from 0 to 100",
    },
    classroomDescription: {
      type: Type.STRING,
      description:
        "Concise summary of the classroom layout, lighting, and general occupancy state",
    },
    seats: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          verbalLocation: {
            type: Type.STRING,
            description:
              "Natural language description of the seat position relative to visible landmarks",
          },
          availability: {
            type: Type.STRING,
            enum: ["available", "occupied", "blocked", "uncertain"],
          },
          confidence: {
            type: Type.INTEGER,
            description:
              "Confidence from 0 to 100 regarding this seat's availability and location",
          },
          suitabilityScore: {
            type: Type.INTEGER,
            description:
              "Score from 0 to 100 tailored to the user's purpose and preferences",
          },
          factors: {
            type: Type.OBJECT,
            properties: {
              comfort: {
                type: Type.INTEGER,
                description: "Comfort rating 0-100",
              },
              crowding: {
                type: Type.INTEGER,
                description: "Crowding density 0-100",
              },
              sunExposure: {
                type: Type.INTEGER,
                description: "Sun/glare exposure 0-100",
              },
              legroom: {
                type: Type.INTEGER,
                description: "Legroom rating 0-100",
              },
              privacy: {
                type: Type.INTEGER,
                description: "Privacy rating 0-100",
              },
              visibility: {
                type: Type.INTEGER,
                description: "Board/front visibility rating 0-100",
              },
              lighting: {
                type: Type.INTEGER,
                description: "Lighting quality rating 0-100",
              },
              accessibility: {
                type: Type.INTEGER,
                description: "Accessibility and aisle access rating 0-100",
              },
            },
            required: [
              "comfort",
              "crowding",
              "sunExposure",
              "legroom",
              "privacy",
              "visibility",
              "lighting",
              "accessibility",
            ],
          },
          observations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Key visual observations about this specific seat",
          },
          concerns: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Potential downsides or concerns about this seat",
          },
        },
        required: [
          "verbalLocation",
          "availability",
          "confidence",
          "suitabilityScore",
          "factors",
          "observations",
          "concerns",
        ],
      },
    },
    recommendation: {
      type: Type.OBJECT,
      properties: {
        verbalLocation: {
          type: Type.STRING,
          description:
            "Verbal location of the recommended seat or 'None available'",
        },
        score: {
          type: Type.INTEGER,
          description: "Suitability score of the recommended seat from 0 to 100",
        },
        reason: {
          type: Type.STRING,
          description:
            "Clear explanation of why this seat was recommended based on purpose and preferences",
        },
      },
      required: ["verbalLocation", "score", "reason"],
    },
    observations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "General room-wide visual observations",
    },
    concerns: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "General room-wide concerns or warnings",
    },
  },
  required: [
    "status",
    "confidence",
    "classroomDescription",
    "seats",
    "recommendation",
    "observations",
    "concerns",
  ],
};

export interface AnalyzeSeatParams {
  base64Data: string;
  mimeType: string;
  purpose?: string;
  preferences?: string[];
}

/**
 * Helper to call ai.models.generateContent with automatic retry backoff
 * for transient Google server errors (such as 503 High Demand spikes).
 */
async function callGeminiWithRetry(
  ai: GoogleGenAI,
  params: Parameters<typeof ai.models.generateContent>[0],
  maxRetries = 2
) {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: unknown) {
      lastError = err;
      const errMsg = err instanceof Error ? err.message : String(err);
      const isTransient =
        errMsg.includes("503") ||
        errMsg.includes("high demand") ||
        errMsg.includes("UNAVAILABLE") ||
        errMsg.includes("temporarily unavailable");

      if (isTransient && attempt < maxRetries) {
        console.warn(
          `[IRIKK AI] Transient Gemini error: ${errMsg}. Retrying in ${
            (attempt + 1) * 1500
          }ms (attempt ${attempt + 1}/${maxRetries})...`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, (attempt + 1) * 1500)
        );
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

/**
 * Analyzes a single chair/seat image using Gemini Vision.
 *
 * Flow:
 * 1. Build prompt from user purpose & preferences
 * 2. Send image inlineData + prompt to Gemini model
 * 3. Request structured JSON using singleSeatResponseSchema
 * 4. Validate output with Zod schema
 * 5. Return validated SingleSeatAnalysis
 */
export async function analyzeSeatVision({
  base64Data,
  mimeType,
  purpose,
  preferences,
}: AnalyzeSeatParams): Promise<SingleSeatAnalysis> {
  const ai = getGeminiClient();
  const prompt = buildSingleSeatPrompt(purpose, preferences);

  const response = await callGeminiWithRetry(ai, {
    model: GEMINI_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: singleSeatResponseSchema,
    },
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error("Gemini returned an empty response");
  }

  let rawJson: unknown;
  try {
    rawJson = JSON.parse(responseText);
  } catch {
    throw new Error("Gemini response could not be parsed as valid JSON");
  }

  // Validate with Zod for strict type guarantees
  const validated = singleSeatAnalysisSchema.parse(rawJson);
  return validated;
}

/**
 * Analyzes a classroom or lecture hall image using Gemini Vision.
 *
 * Flow:
 * 1. Build classroom prompt factoring in user purpose and preferences
 * 2. Send image inlineData + prompt to Gemini model
 * 3. Request structured JSON using classroomResponseSchema
 * 4. Validate output with Zod schema
 * 5. Return validated ClassroomAnalysis
 */
export async function analyzeClassroomVision({
  base64Data,
  mimeType,
  purpose,
  preferences,
}: AnalyzeSeatParams): Promise<ClassroomAnalysis> {
  const ai = getGeminiClient();
  const prompt = buildClassroomPrompt(purpose, preferences);

  const response = await callGeminiWithRetry(ai, {
    model: GEMINI_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: classroomResponseSchema,
    },
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error("Gemini returned an empty response for classroom analysis");
  }

  let rawJson: unknown;
  try {
    rawJson = JSON.parse(responseText);
  } catch {
    throw new Error("Gemini classroom response could not be parsed as valid JSON");
  }

  // Validate with Zod for strict type guarantees
  const validated = classroomAnalysisSchema.parse(rawJson);
  return validated;
}
