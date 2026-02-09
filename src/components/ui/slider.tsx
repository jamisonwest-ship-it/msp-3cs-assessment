"use client";

interface PremiumSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  helperText?: string;
  color?: "blue" | "green" | "primary";
}

const colorMap = {
  blue: {
    bg: "bg-msp-blue",
    text: "text-msp-blue",
    ring: "ring-msp-blue/30",
    gradient: "from-th-blue-tint to-msp-blue",
    labelBg: "bg-th-blue-tint",
    labelBorder: "border-msp-blue/20",
  },
  green: {
    bg: "bg-msp-green",
    text: "text-msp-green",
    ring: "ring-msp-green/30",
    gradient: "from-th-green-tint to-msp-green",
    labelBg: "bg-th-green-tint",
    labelBorder: "border-msp-green/20",
  },
  primary: {
    bg: "bg-th-commit",
    text: "text-th-commit",
    ring: "ring-th-commit/30",
    gradient: "from-th-commit-tint to-th-commit",
    labelBg: "bg-th-commit-tint",
    labelBorder: "border-th-commit/20",
  },
};

export function PremiumSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  helperText,
  color = "blue",
}: PremiumSliderProps) {
  const colors = colorMap[color];
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold tracking-wide uppercase ${colors.labelBg} ${colors.labelBorder} ${colors.text}`}
        >
          {label}
        </span>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${colors.bg} text-sm font-bold text-white shadow-sm`}
        >
          {value}
        </span>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 flex items-center px-0.5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-th-muted/20">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${colors.gradient} transition-all duration-150`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="relative z-10 w-full cursor-pointer opacity-0 h-6"
          style={{ WebkitAppearance: "none" }}
        />
        {/* Custom visible thumb */}
        <div
          className="pointer-events-none absolute top-1/2 z-20 -translate-y-1/2"
          style={{ left: `calc(${percentage}% - 12px + ${(50 - percentage) * 0.24}px)` }}
        >
          <div
            className={`h-6 w-6 rounded-full ${colors.bg} shadow-md ring-4 ${colors.ring} transition-all duration-150`}
          />
        </div>
      </div>

      <div className="flex justify-between text-xs text-th-muted">
        <span>{min}</span>
        <span>{max}</span>
      </div>

      {helperText && (
        <p className={`text-xs ${colors.text} font-medium leading-snug`}>{helperText}</p>
      )}
    </div>
  );
}
