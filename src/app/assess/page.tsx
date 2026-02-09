import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AssessmentForm } from "@/components/assessment/assessment-form";

export default function AssessPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-th-text">3Cs Assessment</h1>
            <p className="mt-2 text-th-muted">
              Score each person on <span className="font-medium text-msp-blue">Culture</span>, <span className="font-medium text-msp-green">Competence</span>, and <span className="font-medium text-th-commit">Commitment</span>. Results update live.
            </p>
          </div>

          <AssessmentForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
