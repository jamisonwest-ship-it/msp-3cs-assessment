"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

function CompletionContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div className="mx-auto max-w-2xl text-center">
      {/* Success icon */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-msp-green/10">
        <svg className="h-8 w-8 text-msp-green" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <h1 className="mt-6 text-3xl font-bold text-msp-primary">Assessment Submitted!</h1>
      <p className="mt-3 text-gray-600">
        Your 3Cs Assessment results have been saved and an email with PDF reports is on its way.
      </p>

      {token && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700">Your Assessment History Link</h2>
          <p className="mt-1 text-xs text-gray-500">
            Bookmark this link to access your results and download PDFs anytime.
          </p>
          <div className="mt-3 overflow-hidden rounded-lg bg-gray-50 p-3">
            <Link
              href={`/history/${token}`}
              className="text-sm font-medium text-msp-blue hover:underline break-all"
            >
              /history/{token}
            </Link>
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-4">
        <Link
          href="/assess"
          className="rounded-lg bg-msp-blue px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-msp-blue-dark"
        >
          Start New Assessment
        </Link>
        {token && (
          <Link
            href={`/history/${token}`}
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            View Results
          </Link>
        )}
      </div>
    </div>
  );
}

export default function CompletePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <Suspense fallback={<div className="text-center text-gray-500">Loading...</div>}>
          <CompletionContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
