"use client";

import { useInterview } from "@/hooks/useInterview";
import { CATEGORIES, DIFFICULTIES } from "@/lib/constants";
import { QuestionCategory, Difficulty } from "@/lib/types";

export default function QuestionTypeSelector() {
  const { state, dispatch } = useInterview();

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Question Category
        </label>
        <div className="grid gap-3 sm:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() =>
                dispatch({
                  type: "SET_CATEGORY",
                  payload: cat.value as QuestionCategory,
                })
              }
              className={`rounded-lg border p-4 text-left transition-all ${
                state.category === cat.value
                  ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="text-sm font-semibold text-slate-900">
                {cat.label}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {cat.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Difficulty Level
        </label>
        <div className="flex gap-3">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff.value}
              onClick={() =>
                dispatch({
                  type: "SET_DIFFICULTY",
                  payload: diff.value as Difficulty,
                })
              }
              className={`rounded-lg border px-6 py-2.5 text-sm font-medium transition-all ${
                state.difficulty === diff.value
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {diff.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
