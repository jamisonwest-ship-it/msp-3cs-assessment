"use client";

import { GradeBadge } from "@/components/ui/badge";
import { computeScore } from "@/lib/scoring";
import { GUIDANCE } from "@/lib/guidance";
import type { PersonData } from "./person-card";

interface ResultsPreviewProps {
  people: PersonData[];
}

export function ResultsPreview({ people }: ResultsPreviewProps) {
  const scoredPeople = people
    .filter((p) => p.name.trim())
    .map((p) => ({
      ...p,
      score: computeScore({
        culture: p.culture,
        competence: p.competence,
        commitment: p.commitment,
      }),
    }));

  if (scoredPeople.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-msp-primary">Results Summary</h2>
      <p className="mt-1 text-sm text-gray-500">Live preview — updates as you score</p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4 text-center">Culture</th>
              <th className="pb-3 pr-4 text-center">Competence</th>
              <th className="pb-3 pr-4 text-center">Commitment</th>
              <th className="pb-3 pr-4 text-center">Rating</th>
              <th className="pb-3 pr-4 text-center">Grade</th>
              <th className="pb-3">Guidance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {scoredPeople.map((p) => {
              const guidance = p.score ? GUIDANCE[p.score.grade] : null;
              return (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="py-3 pr-4 font-medium text-msp-primary">
                    {p.name || "—"}
                  </td>
                  <td className="py-3 pr-4 text-center">{p.culture}</td>
                  <td className="py-3 pr-4 text-center">{p.competence}</td>
                  <td className="py-3 pr-4 text-center">{p.commitment}</td>
                  <td className="py-3 pr-4 text-center font-bold">
                    {p.score?.finalRating ?? "—"}
                  </td>
                  <td className="py-3 pr-4 text-center">
                    {p.score ? <GradeBadge grade={p.score.grade} size="sm" /> : "—"}
                  </td>
                  <td className="py-3 text-xs text-gray-500">
                    {guidance?.summary ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
