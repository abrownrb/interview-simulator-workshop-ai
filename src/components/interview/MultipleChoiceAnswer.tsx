"use client";

import { useInterview } from "@/hooks/useInterview";
import { Question } from "@/lib/types";

export default function MultipleChoiceAnswer({
  question,
}: {
  question: Question;
}) {
  const { state, dispatch } = useInterview();

  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-slate-700">
        Choose the best answer
      </label>
      <div className="space-y-3">
        {question.multipleChoiceOptions.map((option, index) => (
          <button
            key={index}
            onClick={() =>
              dispatch({ type: "SET_CURRENT_ANSWER", payload: option })
            }
            className={`w-full rounded-lg border p-4 text-left text-sm transition-all ${
              state.currentAnswer === option
                ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <span className="font-medium text-slate-500 mr-3">
              {String.fromCharCode(65 + index)}.
            </span>
            <span className="text-slate-900">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
