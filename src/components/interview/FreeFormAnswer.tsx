"use client";

import { useCallback } from "react";
import { useInterview } from "@/hooks/useInterview";
import VoiceRecorder from "./VoiceRecorder";

export default function FreeFormAnswer() {
  const { state, dispatch } = useInterview();

  const handleTranscription = useCallback(
    (text: string) => {
      dispatch({
        type: "SET_CURRENT_ANSWER",
        payload: state.currentAnswer
          ? state.currentAnswer + "\n\n" + text
          : text,
      });
    },
    [state.currentAnswer, dispatch]
  );

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-700">
            Your Answer
          </label>
        </div>
        <textarea
          value={state.currentAnswer}
          onChange={(e) =>
            dispatch({ type: "SET_CURRENT_ANSWER", payload: e.target.value })
          }
          placeholder="Type your answer here. Be specific and use concrete examples..."
          rows={8}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <p className="mt-2 text-xs text-slate-500">
          {state.category === "behavioral"
            ? "Tip: Structure your answer using the STAR method \u2014 Situation, Task, Action, Result."
            : "Tip: Be specific and provide concrete examples to strengthen your answer."}
        </p>
      </div>

      <VoiceRecorder onTranscription={handleTranscription} />
    </div>
  );
}
