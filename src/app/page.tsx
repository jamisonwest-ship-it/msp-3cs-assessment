import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-th-text sm:text-5xl">
            3Cs Assessment
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-th-muted">
            Evaluate <strong className="text-msp-blue">Culture</strong>,{" "}
            <strong className="text-msp-green">Competence</strong>, and{" "}
            <strong className="text-th-commit">Commitment</strong> to
            determine fit and placement readiness.
          </p>

          <div className="mt-10 rounded-xl border border-th-border bg-th-surface p-6 text-left shadow-sm sm:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-th-muted">
              How it works
            </h2>
            <ol className="mt-4 space-y-4 text-sm text-th-muted">
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-msp-blue text-xs font-bold text-white">
                  1
                </span>
                <span className="pt-0.5">
                  Add the people you want to assess (up to 25 per session).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-msp-green text-xs font-bold text-white">
                  2
                </span>
                <span className="pt-0.5">
                  Score each person on <span className="font-semibold text-msp-blue">Culture</span> (1–10), <span className="font-semibold text-msp-green">Competence</span> (1–5), and{" "}
                  <span className="font-semibold text-th-commit">Commitment</span> (1–3).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-th-commit text-xs font-bold text-white">
                  3
                </span>
                <span className="pt-0.5">
                  Review live results with grades and coaching guidance.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-msp-blue text-xs font-bold text-white">
                  4
                </span>
                <span className="pt-0.5">
                  Submit to receive a detailed PDF report for each person via email.
                </span>
              </li>
            </ol>
          </div>

          <Link
            href="/assess"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-msp-blue px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:bg-msp-blue-dark hover:shadow-xl"
          >
            Start Assessment
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
