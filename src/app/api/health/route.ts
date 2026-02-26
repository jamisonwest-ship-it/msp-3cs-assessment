import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Lightweight health check that pings Supabase to prevent hobby-tier pausing.
// Called by Vercel Cron (see vercel.json) every 5 days.
export async function GET() {
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
