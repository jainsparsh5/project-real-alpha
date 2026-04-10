import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    await db.command({ ping: 1 });

    return Response.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return Response.json(
      {
        status: "error",
        database: "disconnected",
      },
      { status: 500 }
    );
  }
}