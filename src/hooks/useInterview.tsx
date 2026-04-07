"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";
import {
  QuestionCategory,
  Difficulty,
  AnswerMode,
  Question,
  Feedback,
} from "@/lib/types";

interface InterviewState {
  mode: "practice" | "job-description";
  category: QuestionCategory;
  difficulty: Difficulty;
  jobDescription: string;
  questions: Question[];
  currentQuestionIndex: number;
  answerMode: AnswerMode;
  currentAnswer: string;
  feedback: Feedback | null;
  currentQuestion: Question | null;
  isLoadingQuestions: boolean;
  isLoadingFeedback: boolean;
  error: string | null;
}

type Action =
  | { type: "SET_MODE"; payload: "practice" | "job-description" }
  | { type: "SET_CATEGORY"; payload: QuestionCategory }
  | { type: "SET_DIFFICULTY"; payload: Difficulty }
  | { type: "SET_JOB_DESCRIPTION"; payload: string }
  | { type: "SET_QUESTIONS"; payload: Question[] }
  | { type: "SELECT_QUESTION"; payload: number }
  | { type: "SET_ANSWER_MODE"; payload: AnswerMode }
  | { type: "SET_CURRENT_ANSWER"; payload: string }
  | { type: "SET_FEEDBACK"; payload: { feedback: Feedback; question: Question } }
  | { type: "SET_LOADING_QUESTIONS"; payload: boolean }
  | { type: "SET_LOADING_FEEDBACK"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET" };

const initialState: InterviewState = {
  mode: "practice",
  category: "behavioral",
  difficulty: "medium",
  jobDescription: "",
  questions: [],
  currentQuestionIndex: 0,
  answerMode: "free-form",
  currentAnswer: "",
  feedback: null,
  currentQuestion: null,
  isLoadingQuestions: false,
  isLoadingFeedback: false,
  error: null,
};

function reducer(state: InterviewState, action: Action): InterviewState {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload, questions: [], feedback: null, error: null };
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    case "SET_DIFFICULTY":
      return { ...state, difficulty: action.payload };
    case "SET_JOB_DESCRIPTION":
      return { ...state, jobDescription: action.payload };
    case "SET_QUESTIONS":
      return { ...state, questions: action.payload, currentQuestionIndex: 0, feedback: null, currentAnswer: "", error: null };
    case "SELECT_QUESTION":
      return { ...state, currentQuestionIndex: action.payload, feedback: null, currentAnswer: "" };
    case "SET_ANSWER_MODE":
      return { ...state, answerMode: action.payload, currentAnswer: "" };
    case "SET_CURRENT_ANSWER":
      return { ...state, currentAnswer: action.payload };
    case "SET_FEEDBACK":
      return { ...state, feedback: action.payload.feedback, currentQuestion: action.payload.question };
    case "SET_LOADING_QUESTIONS":
      return { ...state, isLoadingQuestions: action.payload };
    case "SET_LOADING_FEEDBACK":
      return { ...state, isLoadingFeedback: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "RESET":
      return { ...initialState };
    default:
      return state;
  }
}

const InterviewContext = createContext<{
  state: InterviewState;
  dispatch: Dispatch<Action>;
} | null>(null);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <InterviewContext.Provider value={{ state, dispatch }}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }
  return context;
}
