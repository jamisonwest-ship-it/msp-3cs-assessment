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
            <h1 className="text-3xl font-bold text-msp-primary">3Cs Assessment</h1>
            <p className="mt-2 text-gray-600">
              Score each person on Culture, Competence, and Commitment. Results update live.
            </p>
          </div>

          <AssessmentForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
