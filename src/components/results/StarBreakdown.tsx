"use client";

import { StarEvaluation } from "@/lib/types";

const labels = [
  { key: "situation" as const, label: "Situation", description: "Context and background" },
  { key: "task" as const, label: "Task", description: "Your responsibility" },
  { key: "action" as const, label: "Action", description: "Steps you took" },
  { key: "result" as const, label: "Result", description: "Outcome and impact" },
];

export default function StarBreakdown({
  evaluation,
}: {
  evaluation: StarEvaluation;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">
        STAR Framework Breakdown
      </h3>
      <div className="space-y-4">
        {labels.map(({ key, label, description }) => {
          const item = evaluation[key];
          return (
            <div
              key={key}
              className={`rounded-lg border p-4 ${
                item.present
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-rose-200 bg-rose-50"
              }`}
            >
              <div className="flex items-center gap-2">
                {item.present ? (
                  <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className="text-sm font-semibold text-slate-900">
                  {label}
                </span>
                <span className="text-xs text-slate-500">
                  {description}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-700">{item.feedback}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
