"use client";

import { Question } from "@/lib/types";

const difficultyColors = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700",
};

const categoryLabels = {
  behavioral: "Behavioral (STAR)",
  case: "Open-Ended Case",
  situational: "Situational Judgment",
};

export default function QuestionCard({ question }: { question: Question }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            difficultyColors[question.difficulty]
          }`}
        >
          {question.difficulty.charAt(0).toUpperCase() +
            question.difficulty.slice(1)}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {categoryLabels[question.category]}
        </span>
      </div>
      <p className="text-lg font-medium leading-7 text-slate-900">
        {question.text}
      </p>
      {question.hint && (
        <p className="mt-3 text-sm text-slate-500 italic">
          Hint: {question.hint}
        </p>
      )}
    </div>
  );
}
