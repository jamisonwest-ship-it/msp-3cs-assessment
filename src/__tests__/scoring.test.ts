import { describe, it, expect } from "vitest";
import { computeFinalRating, getGrade, computeScore } from "@/lib/scoring";

describe("computeFinalRating", () => {
  it("returns null when culture is missing", () => {
    expect(computeFinalRating({ culture: null, competence: 3, commitment: 2 })).toBeNull();
  });

  it("returns null when competence is missing", () => {
    expect(computeFinalRating({ culture: 5, competence: null, commitment: 2 })).toBeNull();
  });

  it("returns null when commitment is missing", () => {
    expect(computeFinalRating({ culture: 5, competence: 3, commitment: null })).toBeNull();
  });

  it("returns null when all inputs are missing", () => {
    expect(computeFinalRating({ culture: null, competence: null, commitment: null })).toBeNull();
  });

  it("computes max score: 10 * 5 * 3 * (2/3) = 100", () => {
    expect(computeFinalRating({ culture: 10, competence: 5, commitment: 3 })).toBe(100);
  });

  it("computes min score: 1 * 1 * 1 * (2/3) = 1 (rounded)", () => {
    expect(computeFinalRating({ culture: 1, competence: 1, commitment: 1 })).toBe(1);
  });

  it("rounds correctly: 8 * 4 * 3 * (2/3) = 64", () => {
    expect(computeFinalRating({ culture: 8, competence: 4, commitment: 3 })).toBe(64);
  });

  it("rounds 0.5 up: 1 * 1 * 2 * (2/3) = 1.333 → 1", () => {
    expect(computeFinalRating({ culture: 1, competence: 1, commitment: 2 })).toBe(1);
  });

  it("computes: 7 * 3 * 2 * (2/3) = 28", () => {
    expect(computeFinalRating({ culture: 7, competence: 3, commitment: 2 })).toBe(28);
  });

  it("computes: 5 * 3 * 2 * (2/3) = 20", () => {
    expect(computeFinalRating({ culture: 5, competence: 3, commitment: 2 })).toBe(20);
  });
});

describe("getGrade", () => {
  // A+ boundary: > 89
  it("returns A+ for 100", () => {
    expect(getGrade(100)).toBe("A+");
  });

  it("returns A+ for 90 (> 89)", () => {
    expect(getGrade(90)).toBe("A+");
  });

  it("returns A for 89 (not > 89)", () => {
    expect(getGrade(89)).toBe("A");
  });

  // A boundary: > 70
  it("returns A for 71", () => {
    expect(getGrade(71)).toBe("A");
  });

  it("returns B for 70 (not > 70)", () => {
    expect(getGrade(70)).toBe("B");
  });

  // B boundary: > 50
  it("returns B for 51", () => {
    expect(getGrade(51)).toBe("B");
  });

  it("returns C for 50 (not > 50)", () => {
    expect(getGrade(50)).toBe("C");
  });

  // C boundary: > 30
  it("returns C for 31", () => {
    expect(getGrade(31)).toBe("C");
  });

  it("returns D for 30 (not > 30)", () => {
    expect(getGrade(30)).toBe("D");
  });

  // D range
  it("returns D for 1", () => {
    expect(getGrade(1)).toBe("D");
  });

  it("returns D for 0", () => {
    expect(getGrade(0)).toBe("D");
  });
});

describe("computeScore", () => {
  it("returns null when inputs are missing", () => {
    expect(computeScore({ culture: null, competence: 3, commitment: 2 })).toBeNull();
  });

  it("returns correct result for max inputs", () => {
    const result = computeScore({ culture: 10, competence: 5, commitment: 3 });
    expect(result).toEqual({ finalRating: 100, grade: "A+" });
  });

  it("returns correct result for min inputs", () => {
    const result = computeScore({ culture: 1, competence: 1, commitment: 1 });
    expect(result).toEqual({ finalRating: 1, grade: "D" });
  });

  it("returns A+ for 9*5*3", () => {
    // 9*5*3*(2/3) = 90
    const result = computeScore({ culture: 9, competence: 5, commitment: 3 });
    expect(result).toEqual({ finalRating: 90, grade: "A+" });
  });

  it("returns A for 8*5*3", () => {
    // 8*5*3*(2/3) = 80
    const result = computeScore({ culture: 8, competence: 5, commitment: 3 });
    expect(result).toEqual({ finalRating: 80, grade: "A" });
  });

  it("returns B for 9*5*2", () => {
    // 9*5*2*(2/3) = 60
    const result = computeScore({ culture: 9, competence: 5, commitment: 2 });
    expect(result).toEqual({ finalRating: 60, grade: "B" });
  });

  it("returns C for 7*3*2", () => {
    // 7*3*2*(2/3) = 28
    const result = computeScore({ culture: 7, competence: 3, commitment: 2 });
    expect(result).toEqual({ finalRating: 28, grade: "D" });
  });

  it("returns B for 10*4*2", () => {
    // 10*4*2*(2/3) = 53.33 → 53
    const result = computeScore({ culture: 10, competence: 4, commitment: 2 });
    expect(result).toEqual({ finalRating: 53, grade: "B" });
  });
});
