import { NextRequest, NextResponse } from "next/server";
import { assessmentSubmitSchema } from "@/lib/validation";
import { computeFinalRating, getGrade } from "@/lib/scoring";
import { generateGuidance } from "@/lib/guidance";
import { renderPersonPDFToBuffer } from "@/lib/pdf";
import { buildAssessmentEmailHTML } from "@/lib/email";
import { sendAssessmentEmail } from "@/lib/email-sender";
import { getSupabaseAdmin } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rate-limit";

export const maxDuration = 60; // Allow up to 60s for PDF generation + email

export async function POST(request: NextRequest) {
  try {
    // Rate limiting (5 submissions per 15 min per IP)
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { allowed, retryAfterMs } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((retryAfterMs || 60000) / 1000)) },
        }
      );
    }

    const body = await request.json();

    // Validate input
    const parsed = assessmentSubmitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { assessorEmail, people } = parsed.data;
    const supabase = getSupabaseAdmin();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const dateTime = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    // 1. Create assessment record
    const { data: assessment, error: assessmentError } = await supabase
      .from("assessments")
      .insert({ assessor_email: assessorEmail })
      .select("id, session_token")
      .single();

    if (assessmentError || !assessment) {
      console.error("Failed to create assessment:", assessmentError);
      return NextResponse.json(
        { error: "Failed to save assessment" },
        { status: 500 }
      );
    }

    // 2. Compute scores and prepare results (store guidance to avoid recomputing)
    const results = people.map((p) => {
      const finalRating = computeFinalRating({
        culture: p.culture,
        competence: p.competence,
        commitment: p.commitment,
      })!;
      const grade = getGrade(finalRating);
      const guidance = generateGuidance(p.culture, p.competence, p.commitment, grade);
      return {
        ...p,
        finalRating,
        grade,
        guidanceKey: guidance.key,
        guidanceSummary: guidance.summary,
      };
    });

    // 3. Insert people records
    const peopleInserts = results.map((r) => ({
      assessment_id: assessment.id,
      person_name: r.name,
      culture: r.culture,
      competence: r.competence,
      commitment: r.commitment,
      final_rating: r.finalRating,
      grade: r.grade,
      guidance_key: r.guidanceKey,
    }));

    const { data: insertedPeople, error: peopleError } = await supabase
      .from("assessment_people")
      .insert(peopleInserts)
      .select("id, person_name");

    if (peopleError || !insertedPeople) {
      console.error("Failed to insert people:", peopleError);
      return NextResponse.json(
        { error: "Failed to save assessment people" },
        { status: 500 }
      );
    }

    // 4. Generate PDFs and upload to storage (in parallel)
    let logoBase64: string | undefined;
    try {
      const fs = await import("fs");
      const path = await import("path");
      const logoPath = path.join(process.cwd(), "public", "logo.png");
      if (fs.existsSync(logoPath)) {
        const logoData = fs.readFileSync(logoPath);
        logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;
      }
    } catch {
      // Logo not available, PDF will use text fallback
    }

    const pdfBuffers = await Promise.all(
      results.map(async (r, i) => {
        const personId = insertedPeople[i].id;

        const buffer = await renderPersonPDFToBuffer({
          personName: r.name,
          culture: r.culture,
          competence: r.competence,
          commitment: r.commitment,
          finalRating: r.finalRating,
          grade: r.grade,
          assessorEmail,
          dateTime,
          logoBase64,
        });

        // Upload to Supabase Storage
        const storagePath = `${assessment.id}/${personId}.pdf`;
        const { error: uploadError } = await supabase.storage
          .from("3cs-pdfs")
          .upload(storagePath, buffer, {
            contentType: "application/pdf",
            upsert: true,
          });

        if (uploadError) {
          console.error(`Failed to upload PDF for ${r.name}:`, uploadError);
        }

        // Record PDF artifact
        const { error: artifactError } = await supabase
          .from("pdf_artifacts")
          .insert({
            assessment_person_id: personId,
            storage_path: storagePath,
          });

        if (artifactError) {
          console.error(`Failed to record PDF artifact for ${r.name}:`, artifactError);
        }

        return { name: r.name, buffer, personId };
      })
    );

    // 5. Send email with all PDFs attached
    const emailHTML = buildAssessmentEmailHTML({
      assessorEmail,
      people: results,
      sessionToken: assessment.session_token,
      appUrl,
      dateTime,
    });

    const responsePayload = {
      sessionToken: assessment.session_token,
      results: results.map((r) => ({
        name: r.name,
        finalRating: r.finalRating,
        grade: r.grade,
        guidance: r.guidanceSummary,
      })),
    };

    try {
      await sendAssessmentEmail({
        to: assessorEmail,
        subject: `MSP+ 3Cs Assessment Results — ${people.length} person${people.length > 1 ? "s" : ""} assessed`,
        html: emailHTML,
        attachments: pdfBuffers.map((pb) => ({
          filename: `3Cs_Assessment_${pb.name.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
          content: pb.buffer,
        })),
      });
    } catch (emailError) {
      console.error("Email send failed:", emailError);
      return NextResponse.json({
        ...responsePayload,
        warning: "Assessment saved but email delivery failed. You can still view results via the history link.",
      });
    }

    return NextResponse.json(responsePayload);
  } catch (err) {
    console.error("Assessment submission error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
