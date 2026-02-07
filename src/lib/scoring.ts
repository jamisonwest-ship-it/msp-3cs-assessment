export type Grade = "A+" | "A" | "B" | "C" | "D";

export interface ScoreInputs {
  culture: number | null;
  competence: number | null;
  commitment: number | null;
}

export interface ScoreResult {
  finalRating: number;
  grade: Grade;
}

/**
 * Compute the 3Cs Final Rating.
 * FinalRating = Culture * Competence * Commitment * (2/3)
 * Returns null if any input is missing.
 */
export function computeFinalRating(inputs: ScoreInputs): number | null {
  const { culture, competence, commitment } = inputs;
  if (culture == null || competence == null || commitment == null) {
    return null;
  }
  return Math.round(culture * competence * commitment * (2 / 3));
}

/**
 * Map a FinalRating (0–100) to a letter grade.
 * A+ if > 89, A if > 70, B if > 50, C if > 30, D otherwise.
 */
export function getGrade(finalRating: number): Grade {
  if (finalRating > 89) return "A+";
  if (finalRating > 70) return "A";
  if (finalRating > 50) return "B";
  if (finalRating > 30) return "C";
  return "D";
}

/**
 * Compute both finalRating and grade in one call.
 * Returns null if any input is missing.
 */
export function computeScore(inputs: ScoreInputs): ScoreResult | null {
  const finalRating = computeFinalRating(inputs);
  if (finalRating == null) return null;
  return { finalRating, grade: getGrade(finalRating) };
}
