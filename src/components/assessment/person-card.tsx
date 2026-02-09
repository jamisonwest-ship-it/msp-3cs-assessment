"use client";

import { PremiumSlider } from "@/components/ui/slider";
import { GradeBadge } from "@/components/ui/badge";
import { GuidancePanel } from "@/components/ui/guidance-panel";
import { computeScore } from "@/lib/scoring";
import { generateGuidance, CULTURE_LABELS, COMPETENCE_LABELS, COMMITMENT_LABELS } from "@/lib/guidance";

export interface PersonData {
  id: string;
  name: string;
  culture: number;
  competence: number;
  commitment: number;
  cultureTouched?: boolean;
  competenceTouched?: boolean;
  commitmentTouched?: boolean;
}

interface PersonCardProps {
  person: PersonData;
  index: number;
  onUpdate: (id: string, field: keyof PersonData, value: string | number) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export function PersonCard({ person, index, onUpdate, onRemove, canRemove }: PersonCardProps) {
  const score = computeScore({
    culture: person.culture,
    competence: person.competence,
    commitment: person.commitment,
  });

  const guidance = score
    ? generateGuidance(person.culture, person.competence, person.commitment, score.grade)
    : null;

  return (
    <div className="rounded-xl border border-th-border bg-th-surface p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-msp-blue text-sm font-bold text-white">
              {index + 1}
            </span>
            <input
              type="text"
              value={person.name}
              onChange={(e) => onUpdate(person.id, "name", e.target.value)}
              placeholder="Person's name"
              className="flex-1 rounded-lg border border-th-muted/25 bg-th-surface px-3 py-2 text-sm font-medium text-th-text placeholder-th-muted focus:border-msp-blue focus:outline-none focus:ring-2 focus:ring-msp-blue/20"
            />
          </div>
        </div>

        {canRemove && (
          <button
            onClick={() => onRemove(person.id)}
            className="rounded-lg p-2 text-th-muted hover:bg-red-500/10 hover:text-red-500 transition-colors"
            title="Remove person"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <PremiumSlider
          label="Culture"
          value={person.culture}
          min={1}
          max={10}
          onChange={(v) => onUpdate(person.id, "culture", v)}
          helperText={CULTURE_LABELS[person.culture]}
          color="blue"
        />
        <PremiumSlider
          label="Competence"
          value={person.competence}
          min={1}
          max={5}
          onChange={(v) => onUpdate(person.id, "competence", v)}
          helperText={COMPETENCE_LABELS[person.competence]}
          color="green"
        />
        <PremiumSlider
          label="Commitment"
          value={person.commitment}
          min={1}
          max={3}
          onChange={(v) => onUpdate(person.id, "commitment", v)}
          helperText={COMMITMENT_LABELS[person.commitment]}
          color="primary"
        />
      </div>

      {/* Live result — only shown after all 3 sliders are touched */}
      {score && guidance && person.cultureTouched && person.competenceTouched && person.commitmentTouched && (
        <div className="mt-6 rounded-lg border border-th-border bg-gradient-to-r from-th-surface2 to-th-surface p-4">
          <div className="flex items-start gap-4 mb-4">
            <GradeBadge grade={score.grade} size="lg" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-th-text">{guidance.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-th-muted">{guidance.summary}</p>
            </div>
          </div>
          <GuidancePanel guidance={guidance} compact />
        </div>
      )}
    </div>
  );
}
