import type { Grade } from "./scoring";

export interface GuidanceEntry {
  key: string;
  grade: Grade;
  label: string;
  summary: string;
  detail: string;
}

/**
 * Centralized narrative guidance per grade.
 * Expand this map to add richer content without refactoring.
 */
export const GUIDANCE: Record<Grade, GuidanceEntry> = {
  "A+": {
    key: "A_PLUS",
    grade: "A+",
    label: "Strong Fit",
    summary: "High confidence — strong fit across all dimensions.",
    detail:
      "This individual demonstrates exceptional alignment in culture, competence, and commitment. They are well-suited for critical roles and can be relied upon with high confidence. Continue to invest in their growth and engagement.",
  },
  A: {
    key: "A",
    grade: "A",
    label: "Solid Fit",
    summary: "Likely to succeed with normal coaching and support.",
    detail:
      "This individual shows solid alignment across the 3Cs. They are likely to succeed in most roles with standard coaching and support. Monitor progress and address any minor gaps through regular check-ins.",
  },
  B: {
    key: "B",
    grade: "B",
    label: "Moderate Fit",
    summary: "Investigate gaps and coach intentionally.",
    detail:
      "This individual has a moderate fit. There are identifiable gaps in one or more dimensions that should be investigated. Develop a targeted coaching plan and set clear expectations. With intentional support, improvement is achievable.",
  },
  C: {
    key: "C",
    grade: "C",
    label: "Risky Fit",
    summary: "Address specific issues before relying on this person.",
    detail:
      "This individual presents meaningful risk. Specific issues in culture, competence, or commitment need to be addressed before placing them in important roles. Have candid conversations, set improvement timelines, and reassess.",
  },
  D: {
    key: "D",
    grade: "D",
    label: "Poor Fit",
    summary: "Do not place in critical roles without major change.",
    detail:
      "This individual is not currently a good fit for critical responsibilities. Significant changes in one or more dimensions are required. Consider reassignment, intensive development, or transitioning out of the role.",
  },
};

/**
 * Slider helper text — context-sensitive descriptions for each value.
 */
export const CULTURE_LABELS: Record<number, string> = {
  1: "Strongly misaligned with organizational values",
  2: "Significant cultural gaps observed",
  3: "Notable misalignment in key areas",
  4: "Below-average cultural fit",
  5: "Average — some alignment, some gaps",
  6: "Above-average cultural alignment",
  7: "Good cultural fit with minor gaps",
  8: "Strong cultural alignment",
  9: "Excellent cultural fit",
  10: "Exceptional — fully embodies the culture",
};

export const COMPETENCE_LABELS: Record<number, string> = {
  1: "Lacks required skills for the role",
  2: "Below expectations — significant skill gaps",
  3: "Meets basic requirements",
  4: "Above average — solid skill set",
  5: "Exceptional — exceeds all competence expectations",
};

export const COMMITMENT_LABELS: Record<number, string> = {
  1: "Low engagement and commitment",
  2: "Moderate — shows reasonable effort",
  3: "Highly committed and engaged",
};
