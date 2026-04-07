export type QuestionCategory = "behavioral" | "case" | "situational";
export type Difficulty = "easy" | "medium" | "hard";
export type AnswerMode = "free-form" | "multiple-choice";

export interface GenerateQuestionsRequest {
  mode: "practice" | "job-description";
  category?: QuestionCategory;
  difficulty?: Difficulty;
  jobDescription?: string;
  count?: number;
}

export interface Question {
  id: string;
  text: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  multipleChoiceOptions: string[];
  hint?: string;
}

export interface GenerateQuestionsResponse {
  questions: Question[];
}

export interface EvaluateAnswerRequest {
  question: Question;
  answer: string;
  answerMode: AnswerMode;
}

export interface StarEvaluation {
  situation: { present: boolean; feedback: string };
  task: { present: boolean; feedback: string };
  action: { present: boolean; feedback: string };
  result: { present: boolean; feedback: string };
}

export interface Feedback {
  overallScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  starEvaluation?: StarEvaluation;
  suggestedAnswer: string;
}

export interface EvaluateAnswerResponse {
  feedback: Feedback;
}
