import { ObjectId } from "mongodb";
import { auth } from "@clerk/nextjs/server";

import { getDatabase, mongoCollectionName } from "@/lib/mongodb";

const leadType = "lead";

type LeadPayload = {
  sleepHours: number;
  wakeTime: string;
  manifest: string;
  state: "sleepy" | "energized" | "foggy";
  resilienceBoost: number;
};

export async function GET() {
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

    const db = await getDatabase();
    const leads = await db
      .collection(mongoCollectionName)
      .find({ userId, type: leadType })
      .sort({ createdAt: -1 })
      .limit(25)
      .toArray();

    return Response.json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch leads.",
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

    const body = (await request.json()) as Partial<LeadPayload>;

    if (!body.manifest || body.manifest.trim().length < 20) {
      return Response.json(
        {
          success: false,
          message: "Manifest must be at least 20 characters long.",
        },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const document = {
      _id: new ObjectId(),
      type: leadType,
      userId,
      sleepHours: Number(body.sleepHours || 0),
      wakeTime: body.wakeTime || "",
      manifest: body.manifest.trim(),
      state: body.state || "energized",
      resilienceBoost: Number(body.resilienceBoost || 0),
      createdAt: new Date(),
    };

    await db.collection(mongoCollectionName).insertOne(document);

    return Response.json(
      {
        success: true,
        id: document._id.toString(),
      },
      { status: 201 }
    );
  } catch {
    return Response.json(
      {
        success: false,
        message: "Failed to create lead.",
      },
      { status: 500 }
    );
  }
}