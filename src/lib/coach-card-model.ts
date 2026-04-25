export const coachCardPhases = ["morning", "evening"] as const;

export type CoachCardPhase = (typeof coachCardPhases)[number];

export type CoachCard = {
  readout: string;
  todayPlan: string[];
  habitTweaks: string[];
  riskFlags: string[];
  brotherhoodChallenge: string;
  checkInQuestion: string;
  safetyNote: string;
};

export type CoachGenerationInput = {
  date: string;
  phase: CoachCardPhase;
  force: boolean;
  userNote?: string;
};

const crisisPatterns = [
  /\bkill myself\b/i,
  /\bend my life\b/i,
  /\bwant to die\b/i,
  /\bwanna die\b/i,
  /\bsuicid(?:e|al)\b/i,
  /\bself[-\s]?harm\b/i,
  /\bhurt myself\b/i,
  /\bcan'?t go on\b/i,
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function isValidCoachDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime());
}

export function isCoachCardPhase(value: unknown): value is CoachCardPhase {
  return (
    typeof value === "string" &&
    coachCardPhases.includes(value as CoachCardPhase)
  );
}

function normalizeString(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  return normalized.slice(0, maxLength);
}

function normalizeStringArray(
  value: unknown,
  maxItems: number,
  maxLength: number
): string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const normalized = value
    .map((item) => normalizeString(item, maxLength))
    .filter((item): item is string => Boolean(item))
    .slice(0, maxItems);

  return normalized.length > 0 ? normalized : null;
}

function parseJsonObject(value: string): unknown {
  const trimmed = value.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const fencedJson = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];

    if (fencedJson) {
      return JSON.parse(fencedJson);
    }

    const objectMatch = trimmed.match(/\{[\s\S]*\}/);

    if (objectMatch) {
      return JSON.parse(objectMatch[0]);
    }

    throw new Error("Coach card response did not contain JSON.");
  }
}

export function parseCoachCard(input: unknown): {
  data?: CoachCard;
  error?: string;
} {
  let payload = input;

  if (typeof input === "string") {
    try {
      payload = parseJsonObject(input);
    } catch {
      return { error: "Coach card response was not valid JSON." };
    }
  }

  if (!isRecord(payload)) {
    return { error: "Coach card must be a JSON object." };
  }

  const readout = normalizeString(payload.readout, 360);
  const todayPlan = normalizeStringArray(payload.todayPlan, 5, 180);
  const habitTweaks = normalizeStringArray(payload.habitTweaks, 5, 180);
  const riskFlags = normalizeStringArray(payload.riskFlags, 5, 180);
  const brotherhoodChallenge = normalizeString(
    payload.brotherhoodChallenge,
    220
  );
  const checkInQuestion = normalizeString(payload.checkInQuestion, 220);
  const safetyNote = normalizeString(payload.safetyNote, 260);

  if (
    !readout ||
    !todayPlan ||
    !habitTweaks ||
    !riskFlags ||
    !brotherhoodChallenge ||
    !checkInQuestion ||
    !safetyNote
  ) {
    return { error: "Coach card did not match the required shape." };
  }

  return {
    data: {
      readout,
      todayPlan,
      habitTweaks,
      riskFlags,
      brotherhoodChallenge,
      checkInQuestion,
      safetyNote,
    },
  };
}

export function parseCoachGenerationInput(input: unknown): {
  data?: CoachGenerationInput;
  error?: string;
} {
  if (!isRecord(input)) {
    return { error: "Invalid payload." };
  }

  const date = normalizeString(input.date, 10);

  if (!date || !isValidCoachDate(date)) {
    return { error: "Date must be a valid YYYY-MM-DD value." };
  }

  const phase = input.phase === undefined ? "morning" : input.phase;

  if (!isCoachCardPhase(phase)) {
    return { error: "Phase must be morning or evening." };
  }

  const userNote = normalizeString(input.userNote, 800) || undefined;

  return {
    data: {
      date,
      phase,
      force: input.force === true,
      userNote,
    },
  };
}

export function createFallbackCoachCard(): CoachCard {
  return {
    readout:
      "Your data was saved, but the AI coach is unavailable right now. Stay practical: protect sleep, move your body, keep one focus block clean, and make one real connection today.",
    todayPlan: [
      "Pick one non-negotiable task and finish it before checking distractions.",
      "Train or walk for at least 20 minutes without turning it into a heroic punishment session.",
      "Set a realistic bedtime target and protect the final 30 minutes from screens.",
    ],
    habitTweaks: [
      "Keep today to one small upgrade instead of rebuilding your entire life in one morning.",
    ],
    riskFlags: [
      "Low structure can turn into drift, so choose the next action before motivation fades.",
    ],
    brotherhoodChallenge:
      "Send one honest message to someone you respect instead of isolating by default.",
    checkInQuestion:
      "What is the one action that would make tonight feel like you kept your word?",
    safetyNote:
      "This is coaching, not medical or mental health treatment. If you feel at risk of hurting yourself, call or text 988 in the U.S. or contact local emergency services.",
  };
}

export function createSafetyCoachCard(): CoachCard {
  return {
    readout:
      "Pause optimization for a moment. If you might hurt yourself, this is not a discipline problem. This is a real-life support moment.",
    todayPlan: [
      "Move away from anything you could use to hurt yourself.",
      "Call or text 988 in the U.S., or contact local emergency services now.",
      "Message one trusted person: I need you to stay with me right now.",
    ],
    habitTweaks: [
      "Drop performance goals for the next hour and focus only on staying physically safe.",
    ],
    riskFlags: ["Self-harm or crisis language was detected."],
    brotherhoodChallenge:
      "Do not carry this alone. Reach one real person or crisis service now.",
    checkInQuestion: "Are you physically safe for the next 10 minutes?",
    safetyNote:
      "In the U.S., call or text 988, or use 988lifeline.org for chat. If there is immediate danger, call emergency services.",
  };
}

export function containsCrisisSignal(input: string): boolean {
  return crisisPatterns.some((pattern) => pattern.test(input));
}
