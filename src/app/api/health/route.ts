import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Lightweight health check that pings Supabase to prevent hobby-tier pausing.
// Called by Vercel Cron (see vercel.json) every 12 hours.
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from("assessments")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Health check DB ping failed:", error);
      return NextResponse.json(
        { status: "unhealthy", error: error.message },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Health check error:", err);
    return NextResponse.json(
      { status: "unhealthy", error: "Failed to reach database" },
      { status: 503 }
    );
  }
}
