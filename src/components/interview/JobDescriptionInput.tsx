"use client";

import { useInterview } from "@/hooks/useInterview";

export default function JobDescriptionInput() {
  const { state, dispatch } = useInterview();

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Job Description
      </label>
      <textarea
        value={state.jobDescription}
        onChange={(e) =>
          dispatch({ type: "SET_JOB_DESCRIPTION", payload: e.target.value })
        }
        placeholder="Paste the full job description here..."
        rows={8}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <p className="mt-2 text-xs text-slate-500">
        Paste the job title, responsibilities, requirements, and qualifications
        for the most relevant questions.
      </p>
    </div>
  );
}
