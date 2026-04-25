import { auth } from "@clerk/nextjs/server";
import { ObjectId, type Document } from "mongodb";

import {
  generateCoachCard,
  type HabitSummary,
  type MorningEntrySummary,
} from "@/lib/coach-card-generator";
import {
  isCoachCardPhase,
  isValidCoachDate,
  parseCoachGenerationInput,
  type CoachCardPhase,
} from "@/lib/coach-card-model";
import { getDatabase, mongoCollectionName } from "@/lib/mongodb";

const coachCardType = "coachcard";
const riseAndGrindType = "riseandgrind";
const habitType = "habit";

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function readString(
  document: Document | null | undefined,
  key: string,
  fallback = ""
): string {
  const value = document?.[key] as unknown;
  return typeof value === "string" ? value : fallback;
}

function readNumber(
  document: Document | null | undefined,
  key: string
): number | null {
  const value = document?.[key] as unknown;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function summarizeMorningEntry(
  document: Document | null | undefined
): MorningEntrySummary | undefined {
  if (!document) {
    return undefined;
  }

  return {
    date: readString(document, "date"),
    wakeUpTime: readString(document, "wakeUpTime"),
    sleepDurationHours: readNumber(document, "sleepDurationHours"),
    mood: readString(document, "mood", readString(document, "state", "unknown")),
    gratitude: readString(document, "gratitude").slice(0, 500),
  };
}

function summarizeHabit(document: Document): HabitSummary {
  const title =
    readString(document, "title") ||
    readString(document, "name") ||
    readString(document, "label") ||
    "Unnamed habit";

  return {
    pillar: readString(document, "pillar", "custom"),
    title: title.slice(0, 140),
    status: readString(document, "status", "active"),
  };
}

async function buildCoachContext({
  userId,
  date,
  phase,
  userNote,
}: {
  userId: string;
  date: string;
  phase: CoachCardPhase;
  userNote?: string;
}) {
  const db = await getDatabase();
  const collection = db.collection(mongoCollectionName);

  const [morningEntry, recentEntries, activeHabits] = await Promise.all([
    collection.findOne({
      userId,
      type: riseAndGrindType,
      date,
    }),
    collection
      .find({
        userId,
        type: riseAndGrindType,
      })
      .sort({ date: -1, updatedAt: -1, createdAt: -1 })
      .limit(7)
      .toArray(),
    collection
      .find({
        userId,
        type: habitType,
        status: { $ne: "archived" },
      })
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(12)
      .toArray(),
  ]);

  return {
    date,
    phase,
    morningEntry: summarizeMorningEntry(morningEntry),
    recentEntries: recentEntries
      .map((entry) => summarizeMorningEntry(entry))
      .filter((entry): entry is MorningEntrySummary => Boolean(entry)),
    activeHabits: activeHabits.map(summarizeHabit),
    userNote,
  };
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || todayDateString();
    const phase = searchParams.get("phase");

    if (!isValidCoachDate(date)) {
      return Response.json(
        {
          success: false,
          message: "Date must be a valid YYYY-MM-DD value.",
        },
        { status: 400 }
      );
    }

    if (phase !== null && !isCoachCardPhase(phase)) {
      return Response.json(
        {
          success: false,
          message: "Phase must be morning or evening.",
        },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection(mongoCollectionName);
    const filter: Record<string, string> = {
      userId,
      type: coachCardType,
      date,
    };

    if (phase) {
      filter.phase = phase;
    }

    const entries = await collection
      .find(filter)
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(phase ? 1 : 10)
      .toArray();

    return Response.json({
      success: true,
      count: entries.length,
      data: entries,
    });
  } catch {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch coach cards.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    const parsed = parseCoachGenerationInput(body);

    if (!parsed.data) {
      return Response.json(
        {
          success: false,
          message: parsed.error || "Invalid payload.",
        },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection(mongoCollectionName);
    const filter = {
      userId,
      type: coachCardType,
      date: parsed.data.date,
      phase: parsed.data.phase,
    };

    if (!parsed.data.force) {
      const existing = await collection.findOne(filter);

      if (existing) {
        return Response.json({
          success: true,
          generated: false,
          source: "stored",
          data: existing,
        });
      }
    }

    const context = await buildCoachContext({
      userId,
      date: parsed.data.date,
      phase: parsed.data.phase,
      userNote: parsed.data.userNote,
    });
    const generated = await generateCoachCard(context);
    const now = new Date();

    const saved = await collection.findOneAndUpdate(
      filter,
      {
        $set: {
          card: generated.card,
          source: generated.source,
          provider: generated.provider,
          model: generated.model,
          contextStats: {
            hasMorningEntry: Boolean(context.morningEntry),
            recentEntryCount: context.recentEntries.length,
            activeHabitCount: context.activeHabits.length,
          },
          updatedAt: now,
        },
        $setOnInsert: {
          _id: new ObjectId(),
          type: coachCardType,
          userId,
          date: parsed.data.date,
          phase: parsed.data.phase,
          createdAt: now,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    if (saved?._id) {
      await collection.deleteMany({
        ...filter,
        _id: { $ne: saved._id },
      });
    }

    return Response.json(
      {
        success: true,
        generated: true,
        source: generated.source,
        data: saved,
      },
      { status: 200 }
    );
  } catch {
    return Response.json(
      {
        success: false,
        message: "Failed to generate coach card.",
      },
      { status: 500 }
    );
  }
}
