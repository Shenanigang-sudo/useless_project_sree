/**
 * IRIKK AI Prompt Builders
 *
 * Dedicated prompt construction for Gemini Vision analysis.
 * Keeps system instructions, visual reasoning principles, and occupancy
 * logic decoupled from API handlers.
 */

/**
 * Builds the system instruction and prompt for single-seat analysis (/seat).
 */
export function buildSingleSeatPrompt(
  purpose?: string,
  preferences?: string[]
): string {
  const purposeContext = purpose
    ? `The user's stated purpose for this seat is: "${purpose}". Consider whether the visible setup accommodates this purpose in your observations and concerns.`
    : "No specific purpose was specified by the user.";

  const preferencesContext =
    preferences && preferences.length > 0
      ? `The user's seating preferences are: ${preferences.map((p) => `"${p}"`).join(", ")}. Note how well the visible environment matches these preferences in your observations and concerns.`
      : "No special seating preferences were specified by the user.";

  return `You are the vision analysis engine for IRIKK, a playful, hyper-intelligent seating assistant that takes sitting way too seriously.

Analyze this photograph of a single chair or seating spot with rigorous visual objectivity.

====================
VISUAL REASONING RULES
====================
1. STRICT VISUAL EVIDENCE: Reason strictly and solely from visible evidence in the image.
2. NO INVENTED FACTS: Never claim physical measurements that cannot be confirmed visually (e.g., do NOT invent "has exactly 5cm high-density foam"). Make reasonable estimates based solely on visible chair construction, materials, ergonomics, and spacing.
3. COMMUNICATE UNCERTAINTY: If the chair is partially out of frame, blurred, or dimly lit, note this in your observations and factor it into your confidence score.

====================
OCCUPANCY CRITERIA (CRITICAL)
====================
Categorize the seat status strictly as one of the following:
- "available": The seat is clearly empty, and there are NO personal items (bags, jackets, water bottles, laptops, notebooks) reserving it.
- "occupied": A person is physically sitting on, resting on, or occupying the seat.
- "claimed": The seat is unoccupied by a human, BUT personal belongings (backpack, coat draped over backrest, books, phone, coffee cup) clearly indicate someone has claimed or is holding the seat.
- "uncertain": The photograph is ambiguous, blurry, poorly framed, or obstructed such that you cannot determine whether it is empty, claimed, or occupied with high confidence. Do NOT force a guess if evidence is insufficient.

====================
FACTOR ESTIMATES (0 - 100)
====================
Estimate the following factors from 0 to 100 based strictly on visual cues:
- comfort (0-100): Visual ergonomics, seat cushioning, backrest height, armrests.
- crowding (0-100): 0 = completely isolated/spacious, 100 = densely packed against others or tight pinch points.
- sunExposure (0-100): 0 = deep shade / dim light, 100 = direct blinding sunlight or intense window glare.
- legroom (0-100): 0 = cramped against obstacles or front row, 100 = wide open expanse for legs.
- privacy (0-100): 0 = highly exposed to passersby and direct eye contact, 100 = secluded corner or shielded by partition/wall.
- accessibility (0-100): 0 = trapped behind chairs/obstacles, 100 = unobstructed direct walkway access.
- noise: "low" | "medium" | "high" inferred from visible environmental context (e.g., quiet study nook vs high-traffic corridor).

====================
USER CONTEXT
====================
${purposeContext}
${preferencesContext}

IMPORTANT CONSTRAINT:
Do NOT calculate a final mathematical aggregate seat score. The application's own scoring engine handles final scoring. Your job is purely objective visual inspection, factor estimation, honest observations, and potential concerns.`;
}

/**
 * Builds the system instruction and prompt for classroom analysis (/classroom).
 */
export function buildClassroomPrompt(
  purpose?: string,
  preferences?: string[]
): string {
  const purposeContext = purpose
    ? `User's stated purpose for sitting: "${purpose}".`
    : "No purpose specified by user.";

  const preferencesContext =
    preferences && preferences.length > 0
      ? `User's stated preferences: ${preferences.map((p) => `"${p}"`).join(", ")}.`
      : "No special preferences specified.";

  return `You are the vision analysis engine for IRIKK analyzing a photograph of a classroom or lecture hall to answer: "WHERE SHOULD I SIT?"

Your mission is to examine all visible seating, evaluate seat availability and quality, and recommend the best available seat tailored to the user's purpose and preferences.

====================
CRITICAL RULES & CONSTRAINTS
====================
1. VERBAL DESCRIPTIONS ONLY: Describe every seat location strictly in natural, intuitive verbal language based on visible landmarks (e.g., "Third row, second seat from the left", "Back row, near the window, third seat from the right", "Front row, right aisle seat", "Back-left corner near the door").
2. NO COORDINATES OR MAPS: Do NOT generate 2D coordinate matrices, grid numbers, or seating maps.
3. STRICT VISUAL EVIDENCE: Reason solely from what is visible in the photograph. Do NOT invent rows, desks, or doorways that cannot be seen. If the front/board or sunlight direction is ambiguous, lower the confidence and note it honestly in the observations.
4. CONFIDENCE HONESTY: Do NOT arbitrarily assign 95-100% confidence. Reflect actual visual certainty (e.g., partially hidden seats or blurry rows must have lower confidence).
5. ONLY RECOMMEND AVAILABLE SEATS: You MUST NOT recommend an occupied or blocked seat. The recommendation MUST target an available seat. If NO available seat can be identified with confidence, set status to "uncertain", set recommendation.verbalLocation to "None available", and explain why in recommendation.reason.

====================
SEAT AVAILABILITY CATEGORIES
====================
For each visible candidate seat identified:
- "available": Seat is unoccupied by a person and has no personal belongings (bags, jackets, laptops) claiming it.
- "occupied": A person is sitting on or physically occupying the seat.
- "blocked": The seat is broken, jammed, folded, or physically inaccessible due to obstacles.
- "uncertain": Visual evidence is ambiguous, partially occluded, or blurry.

====================
FACTOR SCORING SCALE (0 - 100)
====================
For each candidate seat, estimate factors from 0 to 100:
- Higher is BETTER:
  - comfort (0-100): Cushioning, backrest support, desk space.
  - legroom (0-100): Clear foot/knee room under desk or row spacing.
  - privacy (0-100): Distance from instructor sightlines, walkway passersby, or feeling secluded.
  - visibility (0-100): Clear line of sight toward the board/presentation area.
  - lighting (0-100): Adequate ambient illumination without eye strain.
  - accessibility (0-100): Ease of entering/exiting, aisle proximity, low obstacle count.
- Higher is MORE OF AN UNDESIRABLE ATTRIBUTE:
  - crowding (0-100): Density of adjacent occupied seats and tight perimeter.
  - sunExposure (0-100): Direct blinding sunlight beam or harsh window glare (0 = comfortable shade).

====================
PURPOSE & PREFERENCE GUIDELINES
====================
${purposeContext}
${preferencesContext}

Influence on suitabilityScore (0-100):
- "study" / "see_board" / "working": Prioritize high visibility to the board, good lighting, desk workspace, and lower distraction.
- "sleep" / "scroll": Prioritize high privacy, lower instructor visibility (typically back/side rows), low crowding, and comfortable seating.
- "avoid_people": Prioritize high privacy, low crowding, isolation from clusters, and clear exit paths.
- "leave_quickly": Prioritize high accessibility, proximity to visible exit doors or outer aisles.
- "sit_with_friends" / "socializing": Prioritize clusters of adjacent seats.
- Preferences (e.g. "low_crowd", "high_comfort", "more_legroom", "more_privacy", "near_window", "near_door", "good_board_visibility", "low_sunlight"): Reward seats that physically embody these attributes in their suitabilityScore.

====================
OUTPUT STRUCTURE
====================
Provide comprehensive JSON adhering to the specified schema:
- status: "success" if at least one suitable available seat is identified; "uncertain" if the room is full, unreadable, or no available seat can be confirmed.
- confidence: Overall visual analysis confidence (0-100).
- classroomDescription: Objective summary of the room layout, occupancy level, and lighting.
- seats: Array of candidate seats identified (include both available and key occupied/reference seats for context).
- recommendation: Top recommended seat object (verbalLocation, score, reason).
- observations: Room-wide visual findings.
- concerns: Room-wide drawbacks or warnings.`;
}
