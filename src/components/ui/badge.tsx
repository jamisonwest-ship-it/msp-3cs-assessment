import type { Grade } from "@/lib/scoring";

const gradeStyles: Record<Grade, string> = {
  "A+": "bg-grade-aplus text-white shadow-grade-aplus/30",
  A: "bg-grade-a text-white shadow-grade-a/30",
  B: "bg-grade-b text-white shadow-grade-b/30",
  C: "bg-grade-c text-white shadow-grade-c/30",
  D: "bg-grade-d text-white shadow-grade-d/30",
};

interface GradeBadgeProps {
  grade: Grade;
  size?: "sm" | "md" | "lg";
}

export function GradeBadge({ grade, size = "md" }: GradeBadgeProps) {
  const sizeClasses = {
    sm: "h-7 w-7 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-11 w-11 text-base",
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg font-extrabold shadow-sm ${gradeStyles[grade]} ${sizeClasses[size]}`}
    >
      {grade}
    </span>
  );
}
