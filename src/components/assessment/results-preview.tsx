"use client";

import { GradeBadge } from "@/components/ui/badge";
import { computeScore } from "@/lib/scoring";
import { generateGuidance } from "@/lib/guidance";
import type { PersonData } from "./person-card";

interface ResultsPreviewProps {
  people: PersonData[];
}

export function ResultsPreview({ people }: ResultsPreviewProps) {
  const scoredPeople = people
    .filter((p) => p.name.trim() && p.cultureTouched && p.competenceTouched && p.commitmentTouched)
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
    <div className="rounded-xl border border-th-border bg-th-surface shadow-sm">
      <div className="border-b border-th-border px-6 py-4">
        <h2 className="text-lg font-semibold text-th-text">Results Summary</h2>
        <p className="mt-0.5 text-sm text-th-muted">Live preview — updates as you score</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-th-border bg-th-subtle text-left text-[11px] font-semibold uppercase tracking-wider">
              <th className="px-6 py-3 text-th-muted">Name</th>
              <th className="px-4 py-3 text-center text-msp-blue">Culture</th>
              <th className="px-4 py-3 text-center text-msp-green">Competence</th>
              <th className="px-4 py-3 text-center text-th-commit">Commitment</th>
              <th className="px-4 py-3 text-center text-th-muted">Grade</th>
              <th className="px-6 py-3 text-th-muted">Guidance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-th-border">
            {scoredPeople.map((p) => {
              const guidance = p.score
                ? generateGuidance(p.culture, p.competence, p.commitment, p.score.grade)
                : null;
              return (
                <tr key={p.id} className="hover:bg-th-subtle transition-colors">
                  <td className="px-6 py-3.5 font-medium text-th-text">
                    {p.name || "\u2014"}
                  </td>
                  <td className="px-4 py-3.5 text-center font-semibold text-msp-blue">{p.culture}</td>
                  <td className="px-4 py-3.5 text-center font-semibold text-msp-green">{p.competence}</td>
                  <td className="px-4 py-3.5 text-center font-semibold text-th-commit">{p.commitment}</td>
                  <td className="px-4 py-3.5 text-center">
                    {p.score ? <GradeBadge grade={p.score.grade} size="sm" /> : "\u2014"}
                  </td>
                  <td className="px-6 py-3.5 text-xs leading-relaxed text-th-muted">
                    {guidance?.summary ?? "\u2014"}
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
