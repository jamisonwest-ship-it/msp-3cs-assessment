import type { Grade } from "./scoring";

export interface GuidanceEntry {
  key: string;
  grade: Grade;
  label: string;
  summary: string;
  detail: string;
  primaryFocus: string;
  managerActions: string;
  strengthReinforcement: string;
}

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
  3: "Meets baseline requirements, but impact is limited",
  4: "Above average — solid skill set",
  5: "Exceptional — exceeds all competence expectations",
};

export const COMMITMENT_LABELS: Record<number, string> = {
  1: "Disengaged — minimal ownership or investment",
  2: "Participates, but ownership is inconsistent",
  3: "Fully invested — demonstrates ownership and initiative",
};

// ---- Grade labels (static) ----

const GRADE_LABELS: Record<Grade, string> = {
  "A+": "Strong Fit",
  A: "Solid Fit",
  B: "Moderate Fit",
  C: "Risky Fit",
  D: "Poor Fit",
};

// ---- Archetype detection ----

export type Archetype =
  | "high_confidence_fit"
  | "strong_contributor"
  | "disengaged_high_performer"
  | "culture_carrier_skill_gap"
  | "wrong_seat_right_bus"
  | "capable_but_inconsistent"
  | "cultural_misalignment_risk"
  | "low_culture_low_commitment"
  | "low_skill_low_commitment"
  | "low_commitment"
  | "developing_contributor";

/**
 * Evaluate archetypes in strict priority order. Returns the first match.
 * Exported for testing/validation only — not used directly in UI.
 */
export function detectArchetype(
  culture: number,
  competence: number,
  commitment: number
): Archetype {
  // 1. High-Confidence Fit
  if (culture >= 9 && competence >= 4 && commitment === 3)
    return "high_confidence_fit";

  // 2. Strong Contributor
  if (culture >= 7 && culture <= 8 && competence >= 4 && commitment === 3)
    return "strong_contributor";

  // 3. Disengaged High Performer
  if (commitment === 1 && competence >= 4 && culture >= 7)
    return "disengaged_high_performer";

  // 4. Culture Carrier, Skill Gap
  if (culture >= 9 && competence <= 2 && commitment >= 2)
    return "culture_carrier_skill_gap";

  // 5. Wrong Seat, Right Bus
  if (culture >= 7 && competence <= 2 && commitment >= 2)
    return "wrong_seat_right_bus";

  // 6. Capable but Inconsistent Impact
  if (competence === 3 && commitment >= 2 && culture >= 7)
    return "capable_but_inconsistent";

  // 7. Cultural Misalignment Risk
  if (culture <= 6 && competence >= 3 && commitment >= 2)
    return "cultural_misalignment_risk";

  // 8. Low Culture + Low Commitment
  if (culture <= 6 && commitment === 1)
    return "low_culture_low_commitment";

  // 9. Low Skill + Low Commitment
  if (competence <= 2 && commitment === 1)
    return "low_skill_low_commitment";

  // 10. Low Commitment
  if (commitment === 1)
    return "low_commitment";

  // 11. Developing Contributor (fallback)
  return "developing_contributor";
}

// ---- Strength identification ----

type Dimension = "culture" | "competence" | "commitment";

function identifyStrength(
  culture: number,
  competence: number,
  commitment: number
): Dimension {
  // Normalize each to 0–1 range for fair comparison
  const scores: Record<Dimension, number> = {
    culture: (culture - 1) / 9,
    competence: (competence - 1) / 4,
    commitment: (commitment - 1) / 2,
  };

  // Priority for ties: culture > commitment > competence
  if (scores.culture >= scores.competence && scores.culture >= scores.commitment)
    return "culture";
  if (scores.commitment >= scores.competence)
    return "commitment";
  return "competence";
}

const STRENGTH_TEXT: Record<Dimension, string> = {
  culture:
    "Cultural alignment is this person's strongest asset. Shared values make coaching and development significantly more productive. Lean into this alignment when addressing other areas — they are more likely to respond to feedback framed around organizational values and team expectations.",
  competence:
    "Technical competence is this person's strongest dimension. Their skills provide immediate value and organizational credibility. Use this strength as a foundation — pair skill-based contributions with targeted coaching in areas where they need growth.",
  commitment:
    "Commitment is this person's strongest dimension. A person who demonstrates ownership and initiative is highly coachable and responsive to development. Channel this energy into targeted growth — their willingness to invest effort is a significant advantage that accelerates progress in weaker areas.",
};

// ---- Archetype guidance content ----

interface ArchetypeContent {
  summary: string;
  primaryFocus: string;
  managerActions: string;
}

const ARCHETYPE_CONTENT: Record<Archetype, ArchetypeContent> = {
  high_confidence_fit: {
    summary:
      "Excellent fit across all dimensions — invest in growth and retention.",
    primaryFocus:
      "This individual demonstrates exceptional alignment across culture, competence, and commitment. They are a high-confidence fit for critical roles and should be treated as a key asset to protect and develop. The primary lever here is retention and growth — ensure this person is challenged, recognized, and given increasing responsibility.",
    managerActions:
      "Provide stretch assignments and increased scope to maintain engagement. Discuss long-term career development openly and frequently. Leverage this person as a culture ambassador, mentor, or leader of high-impact initiatives. Proactively address anything that could erode their commitment or cause them to seek opportunity elsewhere.",
  },
  strong_contributor: {
    summary:
      "Strong across all dimensions — elevate responsibility and develop further.",
    primaryFocus:
      "This person shows strong cultural alignment, solid competence, and full commitment. They are a reliable, high-performing contributor who can be trusted with increased responsibility. The primary lever is elevation — creating opportunities for this person to grow into higher-impact roles while reinforcing what they already do well.",
    managerActions:
      "Expand their scope of ownership and provide visibility into strategic work. Pair them with high-confidence team members for mutual development. Set clear expectations for the next level of performance and provide regular feedback on their trajectory. Invest in their professional development to accelerate the transition from strong contributor to exceptional performer.",
  },
  disengaged_high_performer: {
    summary:
      "Capable and culturally aligned, but not engaged — investigate root causes.",
    primaryFocus:
      "This person has the skills and cultural alignment to succeed, but they are not investing discretionary effort. Disengagement in someone with this profile is a warning signal that demands immediate attention — left unaddressed, it erodes their own performance and can negatively influence those around them. The primary lever is commitment: understanding why engagement has dropped and addressing it directly.",
    managerActions:
      "Have an honest, exploratory conversation about what is driving disengagement — it may stem from role fit, leadership dynamics, personal circumstances, or lack of growth opportunity. Set clear ownership expectations with short-term accountability checkpoints. Create conditions for re-engagement by connecting their work to meaningful outcomes. If engagement does not improve after intentional effort, reassess overall fit despite their capability.",
  },
  culture_carrier_skill_gap: {
    summary:
      "Exceptional culture carrier with a skill gap — invest in competence development.",
    primaryFocus:
      "This person deeply embodies organizational values and is fully invested, but their technical capabilities fall short of what their role demands. Their cultural alignment is an exceptional asset that makes them worth investing in. The primary lever is competence — closing the skill gap through targeted development while leveraging their cultural influence.",
    managerActions:
      "Assess whether the current role is realistic given the skill gap, or whether an adjacent role would better match their capabilities. If staying in role, create a structured development plan with clear milestones and a realistic timeline. Pair them with skilled mentors who can accelerate technical growth. Leverage their cultural strength by involving them in onboarding, values reinforcement, or team cohesion efforts.",
  },
  wrong_seat_right_bus: {
    summary:
      "Strong cultural fit, but current role exceeds skill level — explore repositioning.",
    primaryFocus:
      "This person belongs in the organization — their cultural alignment and engagement confirm that. However, their technical capabilities do not match their current role demands. The primary lever is role fit: finding a position where their existing strengths can be fully utilized while their competence aligns with expectations.",
    managerActions:
      "Evaluate whether the skill gap can be closed through targeted training within a reasonable timeframe. Explore alternative roles where cultural alignment and commitment can be leveraged alongside a better competence match. If staying in the current role, set clear performance milestones with defined timelines. Avoid prolonged underperformance — it erodes confidence for both the individual and the team.",
  },
  capable_but_inconsistent: {
    summary:
      "Culturally aligned with adequate skills, but impact is inconsistent — clarify expectations.",
    primaryFocus:
      "This person fits the culture and is engaged, but their competence is at a baseline level that limits their impact. They meet expectations but do not consistently exceed them. The primary lever is competence elevation — targeted development that moves them from adequate to reliably strong, while maintaining the cultural alignment and engagement that are already in place.",
    managerActions:
      "Identify the specific skill areas where baseline is not enough and create focused development goals. Provide clear examples of what higher-impact performance looks like in their role. Pair them with stronger performers for mentoring and knowledge transfer. Set measurable milestones and review progress at regular intervals to maintain momentum.",
  },
  cultural_misalignment_risk: {
    summary:
      "Cultural alignment is the primary gap — address before investing further.",
    primaryFocus:
      "Despite adequate or strong technical skills and engagement, this person's behaviors and values do not consistently align with organizational expectations. Culture is the hardest dimension to change and the most disruptive when left unaddressed. The primary lever is culture: establishing clear behavioral expectations and assessing whether genuine alignment is achievable.",
    managerActions:
      "Have a direct, candid conversation about specific cultural expectations and the behavioral gaps you have observed. Define measurable behavioral standards and set a 30–60 day checkpoint to assess change. Do not invest heavily in skill development or expanded responsibility until cultural alignment improves. If alignment does not shift after deliberate effort, prioritize organizational culture over individual capability.",
  },
  low_culture_low_commitment: {
    summary:
      "Low cultural alignment combined with disengagement — assess continued fit.",
    primaryFocus:
      "This person shows both cultural misalignment and a lack of investment in the organization. When two foundational dimensions are weak simultaneously, the likelihood of meaningful improvement is low without extraordinary intervention. The primary lever is an honest assessment of whether continued investment is justified, regardless of technical skill level.",
    managerActions:
      "Have a transparent conversation about mutual expectations and fit. Define minimum behavioral and engagement standards with a short timeline for observable change. Avoid assigning high-stakes work that depends on cultural alignment or discretionary effort. If improvement does not materialize within the defined window, move toward a transition that respects both parties.",
  },
  low_skill_low_commitment: {
    summary:
      "Skill gaps combined with disengagement — significant intervention required.",
    primaryFocus:
      "This person lacks both the technical skills the role requires and the engagement needed to close that gap. Without commitment, skill development stalls — and without skills, contribution remains limited. The primary lever is commitment: until this person demonstrates willingness to invest effort, skill-building interventions will not yield results.",
    managerActions:
      "Set clear, non-negotiable expectations around both effort and output. Establish a short-duration performance checkpoint with specific, measurable goals. Provide resources for skill development, but make clear that engagement is a prerequisite for continued investment. If neither commitment nor competence improves within the defined window, initiate a transition conversation.",
  },
  low_commitment: {
    summary:
      "Disengagement is the limiting factor — address commitment before other development.",
    primaryFocus:
      "Regardless of skill level or cultural alignment, this person is not invested in their work. Commitment is the engine that drives growth in every other dimension — without it, coaching, training, and cultural reinforcement are ineffective. The primary lever is commitment: understanding the cause and creating conditions for genuine re-engagement.",
    managerActions:
      "Initiate a direct conversation to understand the root cause of disengagement. Distinguish between situational factors (role mismatch, personal challenges, leadership friction) and a fundamental lack of investment. Set clear ownership expectations with short-cycle accountability. If the underlying cause is addressable, create a structured re-engagement plan. If commitment remains low after deliberate intervention, reassess fit.",
  },
  developing_contributor: {
    summary:
      "Growth potential is present — focus development on the highest-impact area.",
    primaryFocus:
      "This person does not fall into a clear risk or strength pattern, which means development should be intentional and prioritized rather than spread across too many areas. The most effective approach is identifying the single highest-impact gap and directing coaching effort there first.",
    managerActions:
      "Identify the one dimension that, if improved, would most significantly change this person's overall trajectory. Create a structured 90-day development plan with measurable milestones focused on that dimension. Provide consistent coaching and regular feedback. Reassess progress before expanding the scope of expectations to additional areas.",
  },
};

// ---- Public API ----

/**
 * Generate dynamic diagnostic guidance based on individual scores and grade.
 * Identifies an internal archetype, the strongest dimension, and produces
 * three coaching sections: Primary Focus, Manager Actions, Strength Reinforcement.
 */
export function generateGuidance(
  culture: number,
  competence: number,
  commitment: number,
  grade: Grade
): GuidanceEntry {
  const archetype = detectArchetype(culture, competence, commitment);
  const strength = identifyStrength(culture, competence, commitment);
  const content = ARCHETYPE_CONTENT[archetype];
  const strengthText = STRENGTH_TEXT[strength];

  return {
    key: archetype,
    grade,
    label: GRADE_LABELS[grade],
    summary: content.summary,
    primaryFocus: content.primaryFocus,
    managerActions: content.managerActions,
    strengthReinforcement: strengthText,
    detail: [
      "Primary Coaching Focus",
      content.primaryFocus,
      "",
      "Manager Action Guidance",
      content.managerActions,
      "",
      "Strength Reinforcement",
      strengthText,
    ].join("\n"),
  };
}

/**
 * @deprecated Use generateGuidance() for score-aware diagnostic guidance.
 * Kept for backward compatibility with stored guidance keys.
 */
export const GUIDANCE: Record<Grade, GuidanceEntry> = {
  "A+": generateGuidance(10, 5, 3, "A+"),
  A: generateGuidance(8, 4, 3, "A"),
  B: generateGuidance(6, 4, 2, "B"),
  C: generateGuidance(5, 3, 2, "C"),
  D: generateGuidance(3, 2, 1, "D"),
};
