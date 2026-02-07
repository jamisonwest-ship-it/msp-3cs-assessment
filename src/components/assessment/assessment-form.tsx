"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PersonCard, type PersonData } from "./person-card";
import { ResultsPreview } from "./results-preview";
import { computeScore } from "@/lib/scoring";

const MAX_PEOPLE = 25;

function createPerson(): PersonData {
  return {
    id: crypto.randomUUID(),
    name: "",
    culture: 5,
    competence: 3,
    commitment: 2,
  };
}

export function AssessmentForm() {
  const router = useRouter();
  const [assessorEmail, setAssessorEmail] = useState("");
  const [people, setPeople] = useState<PersonData[]>([createPerson()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPerson = useCallback(() => {
    if (people.length >= MAX_PEOPLE) return;
    setPeople((prev) => [...prev, createPerson()]);
  }, [people.length]);

  const removePerson = useCallback((id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updatePerson = useCallback(
    (id: string, field: keyof PersonData, value: string | number) => {
      setPeople((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
      );
    },
    []
  );

  const resetAll = useCallback(() => {
    setAssessorEmail("");
    setPeople([createPerson()]);
    setError(null);
  }, []);

  // Validation
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(assessorEmail);
  const scoredPeople = people.filter((p) => {
    if (!p.name.trim()) return false;
    const score = computeScore({
      culture: p.culture,
      competence: p.competence,
      commitment: p.commitment,
    });
    return score !== null;
  });
  const canSubmit = isValidEmail && scoredPeople.length > 0 && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        assessorEmail,
        people: scoredPeople.map((p) => ({
          name: p.name.trim(),
          culture: p.culture,
          competence: p.competence,
          commitment: p.commitment,
        })),
      };

      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed. Please try again.");
      }

      const data = await res.json();
      router.push(`/assess/complete?token=${data.sessionToken}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Assessor email */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium text-gray-700">
          Your email address
        </label>
        <p className="mt-1 text-xs text-gray-500">
          Results will be sent to this address.
        </p>
        <input
          type="email"
          value={assessorEmail}
          onChange={(e) => setAssessorEmail(e.target.value)}
          placeholder="assessor@company.com"
          className={`mt-2 w-full max-w-md rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
            assessorEmail && !isValidEmail
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-msp-blue focus:ring-msp-blue/20"
          }`}
        />
        {assessorEmail && !isValidEmail && (
          <p className="mt-1 text-xs text-red-500">Please enter a valid email address.</p>
        )}
      </div>

      {/* People cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-msp-primary">
            People to Assess ({people.length}/{MAX_PEOPLE})
          </h2>
          <div className="flex gap-2">
            <button
              onClick={resetAll}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Reset All
            </button>
            <button
              onClick={addPerson}
              disabled={people.length >= MAX_PEOPLE}
              className="rounded-lg bg-msp-green px-4 py-2 text-sm font-medium text-white hover:bg-msp-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add Person
            </button>
          </div>
        </div>

        {people.map((person, i) => (
          <PersonCard
            key={person.id}
            person={person}
            index={i}
            onUpdate={updatePerson}
            onRemove={removePerson}
            canRemove={people.length > 1}
          />
        ))}
      </div>

      {/* Results preview */}
      <ResultsPreview people={people} />

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="rounded-lg bg-msp-blue px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-msp-blue-dark hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit & Email Results"
          )}
        </button>

        {!canSubmit && !isSubmitting && (
          <p className="text-sm text-gray-500">
            {!isValidEmail
              ? "Enter a valid email to continue."
              : scoredPeople.length === 0
              ? "Add at least one person with a name to continue."
              : ""}
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
