"use client";

import { Feedback } from "@/lib/types";

function ScoreCircle({ score }: { score: number }) {
  const color =
    score >= 7
      ? "text-emerald-600 border-emerald-200 bg-emerald-50"
      : score >= 5
        ? "text-amber-600 border-amber-200 bg-amber-50"
        : "text-rose-600 border-rose-200 bg-rose-50";

  return (
    <div
      className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 ${color}`}
    >
      <span className="text-2xl font-bold">{score}/10</span>
    </div>
  );
}

export default function FeedbackCard({ feedback }: { feedback: Feedback }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-6">
        <ScoreCircle score={feedback.overallScore} />
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Overall Assessment
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {feedback.summary}
          </p>
        </div>
      </div>
    </div>
  );
}
