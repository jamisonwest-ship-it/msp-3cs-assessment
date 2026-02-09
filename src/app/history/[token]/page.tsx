"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GradeBadge } from "@/components/ui/badge";
import { GuidancePanel } from "@/components/ui/guidance-panel";
import { generateGuidance } from "@/lib/guidance";
import type { Grade } from "@/lib/scoring";

interface PersonResult {
  id: string;
  name: string;
  culture: number;
  competence: number;
  commitment: number;
  finalRating: number;
  grade: Grade;
  guidanceKey: string;
  hasPdf: boolean;
}

interface AssessmentData {
  assessment: {
    id: string;
    createdAt: string;
    assessorEmail: string;
  };
  people: PersonResult[];
}

export default function HistoryPage() {
  const params = useParams();
  const token = params.token as string;
  const [data, setData] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/assessments/${token}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Assessment not found. Please check your link.");
          } else {
            setError("Failed to load assessment.");
          }
          return;
        }
        const json = await res.json();
        setData(json);
      } catch {
        setError("Failed to load assessment.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-5xl px-4">
          {loading && (
            <div className="flex items-center justify-center py-16">
              <svg className="h-8 w-8 animate-spin text-msp-blue" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}

          {error && (
            <div className="mx-auto max-w-md text-center py-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-th-text">{error}</h2>
              <Link href="/" className="mt-4 inline-block text-msp-blue hover:underline">
                Go to homepage
              </Link>
            </div>
          )}

          {data && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-th-text">Assessment Results</h1>
                <p className="mt-2 text-th-muted">
                  Assessed on{" "}
                  {new Date(data.assessment.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <p className="text-sm text-th-muted">
                  {data.people.length} person{data.people.length > 1 ? "s" : ""} assessed
                </p>
              </div>

              {/* Per-person result cards with full guidance */}
              <div className="space-y-6">
                {data.people.map((person) => {
                  const guidance = generateGuidance(person.culture, person.competence, person.commitment, person.grade);
                  return (
                    <div key={person.id} className="rounded-xl border border-th-border bg-th-surface shadow-sm">
                      {/* Person header */}
                      <div className="flex items-center justify-between gap-4 border-b border-th-border px-6 py-4">
                        <div className="flex items-center gap-4">
                          <GradeBadge grade={person.grade} size="lg" />
                          <div>
                            <h2 className="text-lg font-semibold text-th-text">{person.name}</h2>
                            <p className="text-sm text-th-muted">{guidance.label}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-5 text-sm">
                          <div className="text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-msp-blue">Culture</p>
                            <p className="text-lg font-bold text-msp-blue">{person.culture}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-msp-green">Competence</p>
                            <p className="text-lg font-bold text-msp-green">{person.competence}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-th-commit">Commitment</p>
                            <p className="text-lg font-bold text-th-commit">{person.commitment}</p>
                          </div>
                          {person.hasPdf && (
                            <a
                              href={`/api/assessments/${token}/pdf/${person.id}`}
                              className="ml-2 inline-flex items-center gap-1.5 rounded-lg bg-msp-blue/10 px-3 py-1.5 text-xs font-semibold text-msp-blue hover:bg-msp-blue/20 transition-colors"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                              </svg>
                              PDF
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Full guidance */}
                      <div className="px-6 py-4">
                        <GuidancePanel guidance={guidance} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/assess"
                  className="rounded-lg bg-msp-blue px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-msp-blue-dark transition-all"
                >
                  Start New Assessment
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
