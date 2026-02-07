"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GradeBadge } from "@/components/ui/badge";
import { GUIDANCE } from "@/lib/guidance";
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
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-gray-900">{error}</h2>
              <Link href="/" className="mt-4 inline-block text-msp-blue hover:underline">
                Go to homepage
              </Link>
            </div>
          )}

          {data && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-msp-primary">Assessment Results</h1>
                <p className="mt-2 text-gray-600">
                  Assessed on{" "}
                  {new Date(data.assessment.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <p className="text-sm text-gray-500">
                  {data.people.length} person{data.people.length > 1 ? "s" : ""} assessed
                </p>
              </div>

              {/* Results table */}
              <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      <th className="px-6 py-4">Name</th>
                      <th className="px-4 py-4 text-center">Culture</th>
                      <th className="px-4 py-4 text-center">Competence</th>
                      <th className="px-4 py-4 text-center">Commitment</th>
                      <th className="px-4 py-4 text-center">Rating</th>
                      <th className="px-4 py-4 text-center">Grade</th>
                      <th className="px-4 py-4">Guidance</th>
                      <th className="px-4 py-4 text-center">PDF</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.people.map((person) => {
                      const guidance = GUIDANCE[person.grade];
                      return (
                        <tr key={person.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-msp-primary">
                            {person.name}
                          </td>
                          <td className="px-4 py-4 text-center">{person.culture}</td>
                          <td className="px-4 py-4 text-center">{person.competence}</td>
                          <td className="px-4 py-4 text-center">{person.commitment}</td>
                          <td className="px-4 py-4 text-center text-lg font-bold text-msp-primary">
                            {person.finalRating}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <GradeBadge grade={person.grade} />
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm font-medium text-gray-700">{guidance?.label}</p>
                            <p className="text-xs text-gray-500">{guidance?.summary}</p>
                          </td>
                          <td className="px-4 py-4 text-center">
                            {person.hasPdf ? (
                              <a
                                href={`/api/assessments/${token}/pdf/${person.id}`}
                                className="inline-flex items-center gap-1 rounded-lg bg-msp-blue/10 px-3 py-1.5 text-xs font-medium text-msp-blue hover:bg-msp-blue/20 transition-colors"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                Download
                              </a>
                            ) : (
                              <span className="text-xs text-gray-400">N/A</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
