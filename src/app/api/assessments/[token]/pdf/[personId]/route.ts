import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string; personId: string }> }
) {
  try {
    const { token, personId } = await params;
    const supabase = getSupabaseAdmin();

    // Verify session token matches the assessment that owns this person
    const { data: assessment } = await supabase
      .from("assessments")
      .select("id")
      .eq("session_token", token)
      .single();

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    // Verify person belongs to this assessment
    const { data: person } = await supabase
      .from("assessment_people")
      .select("id, person_name")
      .eq("id", personId)
      .eq("assessment_id", assessment.id)
      .single();

    if (!person) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    // Get PDF artifact path
    const { data: artifact } = await supabase
      .from("pdf_artifacts")
      .select("storage_path")
      .eq("assessment_person_id", personId)
      .single();

    if (!artifact) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    // Create signed URL (1 hour expiry)
    const { data: signedUrl, error: signError } = await supabase.storage
      .from("3cs-pdfs")
      .createSignedUrl(artifact.storage_path, 3600);

    if (signError || !signedUrl) {
      console.error("Failed to create signed URL:", signError);
      return NextResponse.json({ error: "Failed to generate download link" }, { status: 500 });
    }

    // Redirect to the signed URL
    return NextResponse.redirect(signedUrl.signedUrl);
  } catch (err) {
    console.error("PDF download error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
