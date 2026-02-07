import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const supabase = getSupabaseClient();

    // Fetch assessment by session token
    const { data: assessment, error: assessmentError } = await supabase
      .from("assessments")
      .select("id, created_at, assessor_email, session_token")
      .eq("session_token", token)
      .single();

    if (assessmentError || !assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    // Fetch people for this assessment
    const { data: people, error: peopleError } = await supabase
      .from("assessment_people")
      .select("id, person_name, culture, competence, commitment, final_rating, grade, guidance_key, created_at")
      .eq("assessment_id", assessment.id)
      .order("created_at", { ascending: true });

    if (peopleError) {
      return NextResponse.json(
        { error: "Failed to fetch assessment details" },
        { status: 500 }
      );
    }

    // Fetch PDF artifacts for each person
    const personIds = (people || []).map((p) => p.id);
    const { data: artifacts } = await supabase
      .from("pdf_artifacts")
      .select("assessment_person_id, storage_path")
      .in("assessment_person_id", personIds);

    const artifactMap = new Map(
      (artifacts || []).map((a) => [a.assessment_person_id, a.storage_path])
    );

    return NextResponse.json({
      assessment: {
        id: assessment.id,
        createdAt: assessment.created_at,
        assessorEmail: assessment.assessor_email,
      },
      people: (people || []).map((p) => ({
        id: p.id,
        name: p.person_name,
        culture: p.culture,
        competence: p.competence,
        commitment: p.commitment,
        finalRating: p.final_rating,
        grade: p.grade,
        guidanceKey: p.guidance_key,
        hasPdf: artifactMap.has(p.id),
      })),
    });
  } catch (err) {
    console.error("Fetch assessment error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
