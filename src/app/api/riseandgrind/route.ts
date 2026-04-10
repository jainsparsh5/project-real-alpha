import { auth } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";

import {
  getDatabase,
  mongoCollectionName,
} from "@/lib/mongodb";
import { parseRiseAndGrindInput } from "@/lib/rise-and-grind-model";

const riseAndGrindType = "riseandgrind";

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
    const date = searchParams.get("date");
    const db = await getDatabase();
    const collection = db.collection(mongoCollectionName);

    const entries = date
      ? await collection
          .find({ userId, type: riseAndGrindType, date })
          .sort({ updatedAt: -1, createdAt: -1 })
          .limit(1)
          .toArray()
      : await collection
          .find({ userId, type: riseAndGrindType })
          .sort({ date: -1, updatedAt: -1, createdAt: -1 })
          .limit(30)
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
        message: "Failed to fetch rise and grind entries.",
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

    const body = await request.json();
    const parsed = parseRiseAndGrindInput(body);

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
    const now = new Date();
    const filter = {
      userId,
      type: riseAndGrindType,
      date: parsed.data.date,
    };

    const result = await collection.findOneAndUpdate(
      filter,
      {
        $set: {
          wakeUpTime: parsed.data.wakeUpTime,
          sleepDurationHours: parsed.data.sleepDurationHours,
          date: parsed.data.date,
          mood: parsed.data.mood,
          state: parsed.data.mood,
          gratitude: parsed.data.gratitude,
          updatedAt: now,
        },
        $setOnInsert: {
          _id: new ObjectId(),
          type: riseAndGrindType,
          userId,
          createdAt: now,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    const saved = result;

    if (saved?._id) {
      await collection.deleteMany({
        ...filter,
        _id: { $ne: saved._id },
      });
    }

    return Response.json(
      {
        success: true,
        id: saved?._id?.toString?.() || null,
        message: "Entry saved for the selected day.",
      },
      { status: 200 }
    );
  } catch {
    return Response.json(
      {
        success: false,
        message: "Failed to create rise and grind entry.",
      },
      { status: 500 }
    );
  }
}
