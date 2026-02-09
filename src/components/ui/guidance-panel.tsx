"use client";

import { useState } from "react";
import type { GuidanceEntry } from "@/lib/guidance";

interface DisclosureProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Disclosure({ title, children, defaultOpen = true }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-th-border last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3 text-left transition-colors hover:bg-th-subtle"
      >
        <span className="text-[11px] font-semibold uppercase tracking-wider text-th-muted">
          {title}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-th-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="pb-4">
          <p className="max-w-prose text-sm leading-relaxed text-th-text">
            {children}
          </p>
        </div>
      )}
    </div>
  );
}

interface GuidancePanelProps {
  guidance: GuidanceEntry;
  compact?: boolean;
}

export function GuidancePanel({ guidance, compact = false }: GuidancePanelProps) {
  return (
    <div className={compact ? "space-y-0" : "space-y-0"}>
      <h3 className={`font-semibold text-th-text ${compact ? "text-sm" : "text-base"} mb-1`}>
        Assessment Guidance
      </h3>
      <p className={`text-th-muted mb-3 ${compact ? "text-xs" : "text-sm"} leading-relaxed`}>
        {guidance.summary}
      </p>
      <div className="rounded-lg border border-th-border bg-th-surface px-4">
        <Disclosure title="Primary Coaching Focus">
          {guidance.primaryFocus}
        </Disclosure>
        <Disclosure title="Manager Action Guidance">
          {guidance.managerActions}
        </Disclosure>
        <Disclosure title="Strength Reinforcement">
          {guidance.strengthReinforcement}
        </Disclosure>
      </div>
    </div>
  );
}
