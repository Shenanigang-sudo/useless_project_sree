import { NextRequest, NextResponse } from "next/server";
import { analyzeRequestSchema } from "@/lib/ai/schemas";
import { analyzeSeatVision, analyzeClassroomVision } from "@/lib/ai";
import { ZodError } from "zod";

// Max image payload size: ~10MB (approx 13.5MB in base64)
const MAX_BASE64_LENGTH = 14 * 1024 * 1024;

const SUPPORTED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/gif",
]);

/**
 * Parses and validates base64 image data URL or raw base64.
 */
function extractImagePayload(rawImage: string): {
  mimeType: string;
  base64Data: string;
} {
  const dataUrlRegex = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/;
  const match = rawImage.match(dataUrlRegex);

  if (match) {
    const mimeType = match[1].toLowerCase();
    const base64Data = match[2];
    return { mimeType, base64Data };
  }

  // Fallback if raw base64 string provided
  return { mimeType: "image/jpeg", base64Data: rawImage };
}

/**
 * POST /api/analyze
 *
 * Server-side endpoint for IRIKK AI Vision analysis.
 * Secures Gemini API key exclusively on the server.
 *
 * Supports modes:
 * - "seat": Single seat occupancy & factor analysis
 * - "classroom": Full classroom seating inspection & verbal seat recommendation
 *
 * Expected JSON Body:
 * {
 *   mode: "seat" | "classroom",
 *   image: "data:image/jpeg;base64,...",
 *   purpose?: string,
 *   preferences?: string[]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parse JSON body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON",
          message: "Request body must be valid JSON.",
        },
        { status: 400 }
      );
    }

    // 2. Validate request structure with Zod
    const parseResult = analyzeRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          message: "Invalid request payload format.",
          details: parseResult.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const { mode, image, purpose, preferences } = parseResult.data;

    // 3. Payload size check
    if (image.length > MAX_BASE64_LENGTH) {
      return NextResponse.json(
        {
          error: "Payload Too Large",
          message: "The provided image exceeds the maximum allowed size (10MB).",
        },
        { status: 413 }
      );
    }

    // 4. Extract and validate mime type & base64 content
    const { mimeType, base64Data } = extractImagePayload(image);
    if (!SUPPORTED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        {
          error: "Unsupported Media Type",
          message: `Unsupported image format: ${mimeType}. Supported formats: JPEG, PNG, WEBP, HEIC, GIF.`,
        },
        { status: 400 }
      );
    }

    if (!base64Data || base64Data.trim() === "") {
      return NextResponse.json(
        {
          error: "Invalid Image",
          message: "Image base64 content cannot be empty.",
        },
        { status: 400 }
      );
    }

    // 5. Handle Single Seat Mode
    if (mode === "seat") {
      const seatAnalysis = await analyzeSeatVision({
        base64Data,
        mimeType,
        purpose,
        preferences,
      });

      return NextResponse.json(
        {
          success: true,
          mode: "seat",
          data: seatAnalysis,
        },
        { status: 200 }
      );
    }

    // 6. Handle Classroom Mode
    if (mode === "classroom") {
      if (!purpose || purpose.trim() === "") {
        return NextResponse.json(
          {
            error: "Validation Error",
            message: "User purpose is required for classroom seat recommendation.",
          },
          { status: 400 }
        );
      }

      const classroomAnalysis = await analyzeClassroomVision({
        base64Data,
        mimeType,
        purpose,
        preferences,
      });

      return NextResponse.json(
        {
          success: true,
          mode: "classroom",
          data: classroomAnalysis,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        error: "Invalid Mode",
        message: `Unknown analysis mode: ${mode}.`,
      },
      { status: 400 }
    );
  } catch (error: unknown) {
    // Graceful server-side error handling without exposing secrets or stacks
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    // Handle missing API key
    if (errorMessage.includes("GEMINI_API_KEY is not set")) {
      return NextResponse.json(
        {
          error: "Configuration Error",
          message:
            "AI service configuration error. GEMINI_API_KEY is not configured on the server.",
        },
        { status: 500 }
      );
    }

    // Handle Zod response validation failure
    if (error instanceof ZodError) {
      console.error("[IRIKK AI] Output schema validation error:", error.issues);
      return NextResponse.json(
        {
          error: "Analysis Output Validation Error",
          message:
            "The AI model response could not be validated against the expected schema.",
        },
        { status: 502 }
      );
    }

    // Generic safe error logging on server
    console.error("[IRIKK AI] Analysis route error:", errorMessage);

    return NextResponse.json(
      {
        error: "AI Analysis Failed",
        message:
          "Unable to process the image with AI Vision at this time. Please try again.",
      },
      { status: 500 }
    );
  }
}
