import {
  createAiChatCompletion,
  getAiRuntimeConfig,
  type AiChatMessage,
} from "@/lib/ai-client";
import {
  containsCrisisSignal,
  createFallbackCoachCard,
  createSafetyCoachCard,
  parseCoachCard,
  type CoachCard,
  type CoachCardPhase,
} from "@/lib/coach-card-model";

export type MorningEntrySummary = {
  date: string;
  wakeUpTime: string;
  sleepDurationHours: number | null;
  mood: string;
  gratitude: string;
};

export type HabitSummary = {
  pillar: string;
  title: string;
  status: string;
};

export type CoachGenerationContext = {
  date: string;
  phase: CoachCardPhase;
  morningEntry?: MorningEntrySummary;
  recentEntries: MorningEntrySummary[];
  activeHabits: HabitSummary[];
  userNote?: string;
};

export type GeneratedCoachCard = {
  card: CoachCard;
  source: "ai" | "fallback" | "safety";
  provider: string;
  model: string;
};

const defaultHabitPillars: HabitSummary[] = [
  { pillar: "sleep", title: "Protect bedtime and wake time", status: "default" },
  { pillar: "body", title: "Move or train with sane intensity", status: "default" },
  { pillar: "focus", title: "Complete one clean work block", status: "default" },
  { pillar: "connection", title: "Make one real human contact", status: "default" },
];

function buildCrisisInput(context: CoachGenerationContext): string {
  return [
    context.userNote,
    context.morningEntry?.gratitude,
    ...context.recentEntries.map((entry) => entry.gratitude),
  ]
    .filter((value): value is string => Boolean(value))
    .join("\n");
}

function buildCoachMessages(context: CoachGenerationContext): AiChatMessage[] {
  const habits =
    context.activeHabits.length > 0 ? context.activeHabits : defaultHabitPillars;

  return [
    {
      role: "system",
      content: [
        "You are the Project-Real Alpha AI coach for men rebuilding discipline, routine, fitness, impulse control, and connection.",
        "Tone: direct brotherhood. Be firm, loyal, concise, and practical.",
        "Never insult, humiliate, diagnose, treat, moralize, or shame sexual struggle.",
        "Do not claim to be a therapist, doctor, or substitute for professional help.",
        "Do not recommend extreme gym volume, fasting, sleep deprivation, isolation, or medical actions.",
        "If crisis or self-harm intent appears, return a safety-first card with U.S. 988 guidance.",
        "Return only valid JSON. Do not include markdown, code fences, hidden reasoning, commentary, or extra keys.",
        "The JSON schema is: {\"readout\":\"string\",\"todayPlan\":[\"string\"],\"habitTweaks\":[\"string\"],\"riskFlags\":[\"string\"],\"brotherhoodChallenge\":\"string\",\"checkInQuestion\":\"string\",\"safetyNote\":\"string\"}.",
        "Every array must include 1 to 5 short strings. Keep each string concrete and action-oriented.",
      ].join("\n"),
    },
    {
      role: "user",
      content: JSON.stringify(
        {
          date: context.date,
          phase: context.phase,
          morningEntry: context.morningEntry || null,
          recentEntries: context.recentEntries,
          activeHabits: habits,
          userNote: context.userNote || null,
          outputIntent:
            "Create one stable coach card for this user's daily command dashboard.",
        },
        null,
        2
      ),
    },
  ];
}

export async function generateCoachCard(
  context: CoachGenerationContext
): Promise<GeneratedCoachCard> {
  const config = getAiRuntimeConfig();

  if (containsCrisisSignal(buildCrisisInput(context))) {
    return {
      card: createSafetyCoachCard(),
      source: "safety",
      provider: config.provider,
      model: config.model,
    };
  }

  try {
    const messages = buildCoachMessages(context);
    const completion = await createAiChatCompletion({
      messages,
      maxTokens: 1800,
      temperature: 0.35,
      topP: 0.9,
    }).catch(async (error) => {
      if (!config.fallbackModel || config.fallbackModel === config.model) {
        throw error;
      }

      return createAiChatCompletion({
        messages,
        model: config.fallbackModel,
        maxTokens: 1800,
        temperature: 0.35,
        topP: 0.9,
      });
    });
    const parsed = parseCoachCard(completion.content);

    if (!parsed.data) {
      return {
        card: createFallbackCoachCard(),
        source: "fallback",
        provider: completion.provider,
        model: completion.model,
      };
    }

    return {
      card: parsed.data,
      source: "ai",
      provider: completion.provider,
      model: completion.model,
    };
  } catch {
    return {
      card: createFallbackCoachCard(),
      source: "fallback",
      provider: config.provider,
      model: config.model,
    };
  }
}
