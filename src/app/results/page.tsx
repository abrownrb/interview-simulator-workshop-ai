"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useInterview } from "@/hooks/useInterview";
import FeedbackCard from "@/components/results/FeedbackCard";
import StarBreakdown from "@/components/results/StarBreakdown";
import StrengthsList from "@/components/results/StrengthsList";
import ImprovementsList from "@/components/results/ImprovementsList";

export default function ResultsPage() {
  const router = useRouter();
  const { state, dispatch } = useInterview();
  const [showSuggested, setShowSuggested] = useState(false);

  if (!state.feedback) {
    return (
      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            No feedback yet
          </h1>
          <p className="mt-2 text-slate-600">
            Complete an interview question first to see your results.
          </p>
          <button
            onClick={() => router.push("/interview?mode=practice")}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            Start Practicing
          </button>
        </div>
      </main>
    );
  }

  const { feedback, currentQuestion } = state;
  const isBehavioral = currentQuestion?.category === "behavioral";

  return (
    <main className="flex-1 bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">
          Your Feedback
        </h1>
        <p className="mb-8 text-slate-600">
          Here&apos;s how you did on this question.
        </p>

        <div className="space-y-6">
          {/* Original question */}
          {currentQuestion && (
            <div className="rounded-xl border border-slate-200 bg-slate-100 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">
                Question
              </p>
              <p className="text-sm text-slate-800">{currentQuestion.text}</p>
            </div>
          )}

          <FeedbackCard feedback={feedback} />

          {isBehavioral && feedback.starEvaluation && (
            <StarBreakdown evaluation={feedback.starEvaluation} />
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <StrengthsList strengths={feedback.strengths} />
            <ImprovementsList improvements={feedback.improvements} />
          </div>

          {/* Suggested answer */}
          {feedback.suggestedAnswer && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <button
                onClick={() => setShowSuggested(!showSuggested)}
                className="flex w-full items-center justify-between text-left"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  Suggested Answer
                </h3>
                <svg
                  className={`h-5 w-5 text-slate-400 transition-transform ${
                    showSuggested ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              {showSuggested && (
                <p className="mt-4 text-sm leading-6 text-slate-700 whitespace-pre-line">
                  {feedback.suggestedAnswer}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => {
                dispatch({ type: "RESET" });
                router.push("/interview?mode=practice");
              }}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              Try Another Question
            </button>
            <button
              onClick={() => router.push("/")}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
