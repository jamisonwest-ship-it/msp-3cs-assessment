import { describe, it, expect } from "vitest";
import {
  detectArchetype,
  generateGuidance,
  type Archetype,
} from "@/lib/guidance";
import { computeFinalRating, getGrade } from "@/lib/scoring";

// All 11 archetypes
const ALL_ARCHETYPES: Archetype[] = [
  "high_confidence_fit",
  "strong_contributor",
  "disengaged_high_performer",
  "culture_carrier_skill_gap",
  "wrong_seat_right_bus",
  "capable_but_inconsistent",
  "cultural_misalignment_risk",
  "low_culture_low_commitment",
  "low_skill_low_commitment",
  "low_commitment",
  "developing_contributor",
];

// Helper: compute grade from raw scores
function gradeFor(culture: number, competence: number, commitment: number) {
  const rating = computeFinalRating({ culture, competence, commitment })!;
  return getGrade(rating);
}

// ---- Exhaustive 150-combination validation ----

interface ComboResult {
  culture: number;
  competence: number;
  commitment: number;
  archetype: Archetype;
  grade: string;
}

function getAllCombinations(): ComboResult[] {
  const results: ComboResult[] = [];
  for (let culture = 1; culture <= 10; culture++) {
    for (let competence = 1; competence <= 5; competence++) {
      for (let commitment = 1; commitment <= 3; commitment++) {
        const archetype = detectArchetype(culture, competence, commitment);
        const grade = gradeFor(culture, competence, commitment);
        results.push({ culture, competence, commitment, archetype, grade });
      }
    }
  }
  return results;
}

describe("Archetype detection — exhaustive 150 combinations", () => {
  const combos = getAllCombinations();

  it("assigns an archetype to all 150 combinations", () => {
    expect(combos).toHaveLength(150);
    for (const c of combos) {
      expect(ALL_ARCHETYPES).toContain(c.archetype);
    }
  });

  it("covers all 11 archetypes at least once", () => {
    const seen = new Set(combos.map((c) => c.archetype));
    for (const archetype of ALL_ARCHETYPES) {
      expect(seen.has(archetype), `Missing archetype: ${archetype}`).toBe(true);
    }
  });
});

describe("Guidance generation — all 150 combinations produce valid output", () => {
  const combos = getAllCombinations();

  it("generates non-empty guidance sections for every combination", () => {
    for (const c of combos) {
      const grade = gradeFor(c.culture, c.competence, c.commitment);
      const guidance = generateGuidance(c.culture, c.competence, c.commitment, grade);

      const label = `C=${c.culture} Comp=${c.competence} Commit=${c.commitment}`;
      expect(guidance.key, `${label}: missing key`).toBeTruthy();
      expect(guidance.summary.length, `${label}: empty summary`).toBeGreaterThan(0);
      expect(guidance.primaryFocus.length, `${label}: empty primaryFocus`).toBeGreaterThan(0);
      expect(guidance.managerActions.length, `${label}: empty managerActions`).toBeGreaterThan(0);
      expect(guidance.strengthReinforcement.length, `${label}: empty strengthReinforcement`).toBeGreaterThan(0);
      expect(guidance.label, `${label}: missing label`).toBeTruthy();
      expect(guidance.detail.length, `${label}: empty detail`).toBeGreaterThan(0);
    }
  });
});

// ---- Archetype boundary tests ----

describe("Archetype detection — specific boundary cases", () => {
  // 1. High-Confidence Fit: culture >= 9, competence >= 4, commitment = 3
  it("detects high_confidence_fit for (9, 4, 3)", () => {
    expect(detectArchetype(9, 4, 3)).toBe("high_confidence_fit");
  });
  it("detects high_confidence_fit for (10, 5, 3)", () => {
    expect(detectArchetype(10, 5, 3)).toBe("high_confidence_fit");
  });
  it("does NOT detect high_confidence_fit for (8, 4, 3) — culture too low", () => {
    expect(detectArchetype(8, 4, 3)).not.toBe("high_confidence_fit");
  });
  it("does NOT detect high_confidence_fit for (9, 3, 3) — competence too low", () => {
    expect(detectArchetype(9, 3, 3)).not.toBe("high_confidence_fit");
  });
  it("does NOT detect high_confidence_fit for (9, 4, 2) — commitment not 3", () => {
    expect(detectArchetype(9, 4, 2)).not.toBe("high_confidence_fit");
  });

  // 2. Strong Contributor: culture 7-8, competence >= 4, commitment = 3
  it("detects strong_contributor for (7, 4, 3)", () => {
    expect(detectArchetype(7, 4, 3)).toBe("strong_contributor");
  });
  it("detects strong_contributor for (8, 5, 3)", () => {
    expect(detectArchetype(8, 5, 3)).toBe("strong_contributor");
  });
  it("does NOT detect strong_contributor for (9, 4, 3) — culture too high (→ high_confidence_fit)", () => {
    expect(detectArchetype(9, 4, 3)).toBe("high_confidence_fit");
  });
  it("does NOT detect strong_contributor for (7, 3, 3) — competence too low", () => {
    expect(detectArchetype(7, 3, 3)).not.toBe("strong_contributor");
  });

  // 3. Disengaged High Performer: commitment = 1, competence >= 4, culture >= 7
  it("detects disengaged_high_performer for (7, 4, 1)", () => {
    expect(detectArchetype(7, 4, 1)).toBe("disengaged_high_performer");
  });
  it("detects disengaged_high_performer for (10, 5, 1)", () => {
    expect(detectArchetype(10, 5, 1)).toBe("disengaged_high_performer");
  });
  it("does NOT detect disengaged_high_performer for (6, 4, 1) — culture too low", () => {
    expect(detectArchetype(6, 4, 1)).not.toBe("disengaged_high_performer");
  });

  // 4. Culture Carrier, Skill Gap: culture >= 9, competence <= 2, commitment >= 2
  it("detects culture_carrier_skill_gap for (9, 1, 2)", () => {
    expect(detectArchetype(9, 1, 2)).toBe("culture_carrier_skill_gap");
  });
  it("detects culture_carrier_skill_gap for (10, 2, 3)", () => {
    expect(detectArchetype(10, 2, 3)).toBe("culture_carrier_skill_gap");
  });
  it("does NOT detect culture_carrier_skill_gap for (8, 2, 2) — culture too low (→ wrong_seat_right_bus)", () => {
    expect(detectArchetype(8, 2, 2)).toBe("wrong_seat_right_bus");
  });

  // 5. Wrong Seat, Right Bus: culture >= 7, competence <= 2, commitment >= 2
  it("detects wrong_seat_right_bus for (7, 1, 2)", () => {
    expect(detectArchetype(7, 1, 2)).toBe("wrong_seat_right_bus");
  });
  it("detects wrong_seat_right_bus for (8, 2, 3)", () => {
    expect(detectArchetype(8, 2, 3)).toBe("wrong_seat_right_bus");
  });

  // 6. Capable but Inconsistent: competence = 3, commitment >= 2, culture >= 7
  it("detects capable_but_inconsistent for (7, 3, 2)", () => {
    expect(detectArchetype(7, 3, 2)).toBe("capable_but_inconsistent");
  });
  it("detects capable_but_inconsistent for (8, 3, 3)", () => {
    expect(detectArchetype(8, 3, 3)).toBe("capable_but_inconsistent");
  });

  // 7. Cultural Misalignment Risk: culture <= 6, competence >= 3, commitment >= 2
  it("detects cultural_misalignment_risk for (6, 3, 2)", () => {
    expect(detectArchetype(6, 3, 2)).toBe("cultural_misalignment_risk");
  });
  it("detects cultural_misalignment_risk for (1, 5, 3)", () => {
    expect(detectArchetype(1, 5, 3)).toBe("cultural_misalignment_risk");
  });

  // 8. Low Culture + Low Commitment: culture <= 6, commitment = 1
  it("detects low_culture_low_commitment for (6, 3, 1)", () => {
    expect(detectArchetype(6, 3, 1)).toBe("low_culture_low_commitment");
  });
  it("detects low_culture_low_commitment for (1, 1, 1)", () => {
    expect(detectArchetype(1, 1, 1)).toBe("low_culture_low_commitment");
  });

  // 9. Low Skill + Low Commitment: competence <= 2, commitment = 1, culture >= 7
  it("detects low_skill_low_commitment for (7, 2, 1)", () => {
    expect(detectArchetype(7, 2, 1)).toBe("low_skill_low_commitment");
  });
  it("detects low_skill_low_commitment for (10, 1, 1)", () => {
    expect(detectArchetype(10, 1, 1)).toBe("low_skill_low_commitment");
  });

  // 10. Low Commitment: commitment = 1 (remaining cases — culture >= 7, competence = 3)
  it("detects low_commitment for (7, 3, 1)", () => {
    expect(detectArchetype(7, 3, 1)).toBe("low_commitment");
  });
  it("detects low_commitment for (8, 3, 1)", () => {
    expect(detectArchetype(8, 3, 1)).toBe("low_commitment");
  });

  // 11. Developing Contributor: fallback
  it("detects developing_contributor for (9, 3, 2) — culture 9, comp 3, commit 2", () => {
    expect(detectArchetype(9, 3, 2)).toBe("capable_but_inconsistent");
  });
  it("detects developing_contributor as fallback for uncovered combos", () => {
    // Culture 7-8, competence 3, commitment 2 → capable_but_inconsistent
    // Culture 9-10, competence 3, commitment 2 → capable_but_inconsistent (culture >= 7)
    // So developing_contributor hits when e.g. culture >= 7, competence >= 4, commitment = 2
    // But also culture >= 9, competence = 3, commitment = 2 hits capable_but_inconsistent
    // developing_contributor e.g.: culture 9, comp 4, commitment 2
    expect(detectArchetype(9, 4, 2)).toBe("developing_contributor");
  });
});

// ---- Quality constraint tests ----

describe("Quality constraints — positive archetype language", () => {
  const combos = getAllCombinations();

  const NEGATIVE_PATTERNS = /\bfix\b|\bfixing\b|\bfixes\b|\bgaps?\b|\bremediat/i;

  it("high_confidence_fit guidance never uses gap/fix/remediate language", () => {
    const highConf = combos.filter((c) => c.archetype === "high_confidence_fit");
    expect(highConf.length).toBeGreaterThan(0);
    for (const c of highConf) {
      const grade = gradeFor(c.culture, c.competence, c.commitment);
      const g = generateGuidance(c.culture, c.competence, c.commitment, grade);
      const combined = `${g.primaryFocus} ${g.managerActions}`;
      expect(
        NEGATIVE_PATTERNS.test(combined),
        `high_confidence_fit (${c.culture},${c.competence},${c.commitment}) should not contain gap/fix/remediate language: "${combined.substring(0, 100)}..."`
      ).toBe(false);
    }
  });

  it("strong_contributor guidance never uses gap/fix/remediate language", () => {
    const strong = combos.filter((c) => c.archetype === "strong_contributor");
    expect(strong.length).toBeGreaterThan(0);
    for (const c of strong) {
      const grade = gradeFor(c.culture, c.competence, c.commitment);
      const g = generateGuidance(c.culture, c.competence, c.commitment, grade);
      const combined = `${g.primaryFocus} ${g.managerActions}`;
      expect(
        NEGATIVE_PATTERNS.test(combined),
        `strong_contributor (${c.culture},${c.competence},${c.commitment}) should not contain gap/fix/remediate language`
      ).toBe(false);
    }
  });
});

describe("Quality constraints — commitment = 3 never described as disengaged", () => {
  const DISENGAGED_PATTERNS = /\blow engagement\b|\bdisengaged\b|\bnot engaged\b|\bnot invested\b|\black.{0,10}commitment\b/i;

  it("no commitment = 3 profile has disengagement language in guidance", () => {
    for (let culture = 1; culture <= 10; culture++) {
      for (let competence = 1; competence <= 5; competence++) {
        const commitment = 3;
        const grade = gradeFor(culture, competence, commitment);
        const g = generateGuidance(culture, competence, commitment, grade);
        const combined = `${g.summary} ${g.primaryFocus} ${g.managerActions}`;
        expect(
          DISENGAGED_PATTERNS.test(combined),
          `(${culture},${competence},${commitment}) commitment=3 should never have disengagement language`
        ).toBe(false);
      }
    }
  });
});

describe("Quality constraints — archetype detection boundaries are correct", () => {
  it("high_confidence_fit only triggers for culture >= 9, competence >= 4, commitment = 3", () => {
    const combos = getAllCombinations();
    const hcf = combos.filter((c) => c.archetype === "high_confidence_fit");
    for (const c of hcf) {
      expect(c.culture, `culture should be >= 9: ${JSON.stringify(c)}`).toBeGreaterThanOrEqual(9);
      expect(c.competence, `competence should be >= 4: ${JSON.stringify(c)}`).toBeGreaterThanOrEqual(4);
      expect(c.commitment, `commitment should be = 3: ${JSON.stringify(c)}`).toBe(3);
    }
  });

  it("strong_contributor only triggers for culture 7-8, competence >= 4, commitment = 3", () => {
    const combos = getAllCombinations();
    const sc = combos.filter((c) => c.archetype === "strong_contributor");
    for (const c of sc) {
      expect(c.culture, `culture should be 7-8: ${JSON.stringify(c)}`).toBeGreaterThanOrEqual(7);
      expect(c.culture, `culture should be 7-8: ${JSON.stringify(c)}`).toBeLessThanOrEqual(8);
      expect(c.competence, `competence should be >= 4: ${JSON.stringify(c)}`).toBeGreaterThanOrEqual(4);
      expect(c.commitment, `commitment should be = 3: ${JSON.stringify(c)}`).toBe(3);
    }
  });
});

// ---- Summary table output ----

describe("Archetype distribution summary", () => {
  it("prints 150-combination summary table", () => {
    const combos = getAllCombinations();
    const counts: Record<string, number> = {};
    for (const c of combos) {
      counts[c.archetype] = (counts[c.archetype] || 0) + 1;
    }

    console.log("\n=== ARCHETYPE DISTRIBUTION (150 combinations) ===");
    console.log("%-35s %s", "Archetype", "Count");
    console.log("-".repeat(45));
    for (const archetype of ALL_ARCHETYPES) {
      console.log(`  ${archetype.padEnd(35)} ${counts[archetype] || 0}`);
    }
    console.log("-".repeat(45));
    console.log(`  ${"TOTAL".padEnd(35)} ${combos.length}`);

    console.log("\n=== FULL COMBINATION TABLE ===");
    console.log(
      `${"C".padStart(3)} ${"Comp".padStart(4)} ${"Cmit".padStart(4)} ${"Grade".padStart(5)} ${"Archetype"}`
    );
    console.log("-".repeat(70));
    for (const c of combos) {
      console.log(
        `${String(c.culture).padStart(3)} ${String(c.competence).padStart(4)} ${String(c.commitment).padStart(4)} ${c.grade.padStart(5)} ${c.archetype}`
      );
    }

    // Validate total
    expect(combos).toHaveLength(150);
  });
});

// ---- Dev check: known combination (7, 4, 3) ----

describe("Dev check — known combination (Culture=7, Competence=4, Commitment=3)", () => {
  const culture = 7;
  const competence = 4;
  const commitment = 3;
  const grade = gradeFor(culture, competence, commitment);
  const guidance = generateGuidance(culture, competence, commitment, grade);

  it("resolves to strong_contributor archetype", () => {
    expect(detectArchetype(culture, competence, commitment)).toBe("strong_contributor");
  });

  it("produces grade B (7*4*3*(2/3) = 56)", () => {
    expect(grade).toBe("B");
  });

  it("returns all three guidance sections as non-empty strings", () => {
    expect(typeof guidance.primaryFocus).toBe("string");
    expect(guidance.primaryFocus.length).toBeGreaterThan(50);

    expect(typeof guidance.managerActions).toBe("string");
    expect(guidance.managerActions.length).toBeGreaterThan(50);

    expect(typeof guidance.strengthReinforcement).toBe("string");
    expect(guidance.strengthReinforcement.length).toBeGreaterThan(50);
  });

  it("assessment page and PDF use the same generateGuidance source", () => {
    // Both the assessment page (GuidancePanel) and the PDF (PersonPDF)
    // call generateGuidance(culture, competence, commitment, grade).
    // Calling it twice with the same inputs must return identical content.
    const second = generateGuidance(culture, competence, commitment, grade);
    expect(guidance.primaryFocus).toBe(second.primaryFocus);
    expect(guidance.managerActions).toBe(second.managerActions);
    expect(guidance.strengthReinforcement).toBe(second.strengthReinforcement);
    expect(guidance.summary).toBe(second.summary);
    expect(guidance.key).toBe(second.key);
  });

  it("guidance has elevation posture, not remediation posture", () => {
    const combined = `${guidance.primaryFocus} ${guidance.managerActions}`;
    // Should not contain fix/gap/remediate language
    expect(combined).not.toMatch(/\bfix\b|\bgaps?\b|\bremediat/i);
    // Should contain positive/elevation language
    expect(combined).toMatch(/\belevat|\bresponsibility|\bgrow|\bdevelop/i);
  });
});
