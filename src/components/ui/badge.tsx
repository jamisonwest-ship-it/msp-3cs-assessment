import type { Grade } from "@/lib/scoring";

const gradeStyles: Record<Grade, string> = {
  "A+": "bg-grade-aplus text-white",
  A: "bg-grade-a text-white",
  B: "bg-grade-b text-white",
  C: "bg-grade-c text-white",
  D: "bg-grade-d text-white",
};

interface GradeBadgeProps {
  grade: Grade;
  size?: "sm" | "md" | "lg";
}

export function GradeBadge({ grade, size = "md" }: GradeBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold ${gradeStyles[grade]} ${sizeClasses[size]}`}
    >
      {grade}
    </span>
  );
}
