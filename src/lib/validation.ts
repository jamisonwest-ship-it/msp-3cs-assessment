import { z } from "zod";

export const personSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  culture: z.number().int().min(1).max(10),
  competence: z.number().int().min(1).max(5),
  commitment: z.number().int().min(1).max(3),
});

export const assessmentSubmitSchema = z.object({
  assessorEmail: z.string().email("Valid email is required"),
  people: z
    .array(personSchema)
    .min(1, "At least one person is required")
    .max(25, "Maximum 25 people per session"),
});

export type PersonInput = z.infer<typeof personSchema>;
export type AssessmentSubmitInput = z.infer<typeof assessmentSubmitSchema>;
