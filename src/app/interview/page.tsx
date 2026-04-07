"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useInterview } from "@/hooks/useInterview";
import QuestionTypeSelector from "@/components/interview/QuestionTypeSelector";
import JobDescriptionInput from "@/components/interview/JobDescriptionInput";
import QuestionCard from "@/components/interview/QuestionCard";
import FreeFormAnswer from "@/components/interview/FreeFormAnswer";
import MultipleChoiceAnswer from "@/components/interview/MultipleChoiceAnswer";
import { Question } from "@/lib/types";

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export default function InterviewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = use(searchParams);
  const router = useRouter();
  const { state, dispatch } = useInterview();
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    const mode = params.mode;
    if (mode === "job-description" || mode === "practice") {
      dispatch({ type: "SET_MODE", payload: mode });
    }
  }, [params.mode, dispatch]);

  const activeQuestion: Question | null =
    state.questions.length > 0
      ? state.mode === "job-description" && selectedQuestionIndex !== null
        ? state.questions[selectedQuestionIndex]
        : state.mode === "practice"
          ? state.questions[0]
          : null
      : null;

  async function handleGenerateQuestions() {
    dispatch({ type: "SET_LOADING_QUESTIONS", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    setSelectedQuestionIndex(null);

    try {
      const body =
        state.mode === "practice"
          ? {
              mode: state.mode,
              category: state.category,
              difficulty: state.difficulty,
              count: 1,
            }
          : {
              mode: state.mode,
              jobDescription: state.jobDescription,
              count: 4,
            };

      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate questions");
      }

      const data = await res.json();
      dispatch({ type: "SET_QUESTIONS", payload: data.questions });

      if (state.mode === "practice") {
        setSelectedQuestionIndex(0);
      }
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      dispatch({ type: "SET_LOADING_QUESTIONS", payload: false });
    }
  }

  async function handleSubmitAnswer() {
    if (!activeQuestion || !state.currentAnswer.trim()) return;

    dispatch({ type: "SET_LOADING_FEEDBACK", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const res = await fetch("/api/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: activeQuestion,
          answer: state.currentAnswer,
          answerMode: state.answerMode,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to evaluate answer");
      }

      const data = await res.json();
      dispatch({
        type: "SET_FEEDBACK",
        payload: { feedback: data.feedback, question: activeQuestion },
      });
      router.push("/results");
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      dispatch({ type: "SET_LOADING_FEEDBACK", payload: false });
    }
  }

  const canGenerate =
    state.mode === "practice" ||
    (state.mode === "job-description" && state.jobDescription.trim().length > 0);

  return (
    <main className="flex-1 bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">
          {state.mode === "practice"
            ? "Practice Interview"
            : "Job-Specific Interview"}
        </h1>
        <p className="mb-8 text-slate-600">
          {state.mode === "practice"
            ? "Select a question type and difficulty, then generate a question to practice."
            : "Paste a job description to get tailored interview questions."}
        </p>

        {/* Step 1: Configuration */}
        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {state.mode === "practice" ? (
            <QuestionTypeSelector />
          ) : (
            <JobDescriptionInput />
          )}

          <button
            onClick={handleGenerateQuestions}
            disabled={state.isLoadingQuestions || !canGenerate}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {state.isLoadingQuestions ? (
              <>
                <Spinner /> Generating...
              </>
            ) : (
              "Generate Question" + (state.mode === "job-description" ? "s" : "")
            )}
          </button>
        </div>

        {state.error && (
          <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {state.error}
          </div>
        )}

        {/* Step 2: Question Selection (job description mode) */}
        {state.mode === "job-description" &&
          state.questions.length > 0 &&
          selectedQuestionIndex === null && (
            <div className="mb-8 space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Select a question to answer
              </h2>
              {state.questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuestionIndex(i)}
                  className="w-full text-left"
                >
                  <QuestionCard question={q} />
                </button>
              ))}
            </div>
          )}

        {/* Step 3: Active Question + Answer */}
        {activeQuestion && (
          <div className="space-y-6">
            <QuestionCard question={activeQuestion} />

            {/* Answer mode toggle */}
            <div className="flex gap-2 rounded-lg bg-slate-100 p-1">
              <button
                onClick={() =>
                  dispatch({ type: "SET_ANSWER_MODE", payload: "free-form" })
                }
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  state.answerMode === "free-form"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Write Your Answer
              </button>
              <button
                onClick={() =>
                  dispatch({
                    type: "SET_ANSWER_MODE",
                    payload: "multiple-choice",
                  })
                }
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  state.answerMode === "multiple-choice"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Multiple Choice
              </button>
            </div>

            {state.answerMode === "free-form" ? (
              <FreeFormAnswer />
            ) : (
              <MultipleChoiceAnswer question={activeQuestion} />
            )}

            <button
              onClick={handleSubmitAnswer}
              disabled={
                state.isLoadingFeedback || !state.currentAnswer.trim()
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-8 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {state.isLoadingFeedback ? (
                <>
                  <Spinner /> Analyzing...
                </>
              ) : (
                "Submit Answer"
              )}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
