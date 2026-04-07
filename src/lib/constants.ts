export const CATEGORIES = [
  {
    value: "behavioral" as const,
    label: "Behavioral (STAR)",
    description: "Tell me about a time when...",
  },
  {
    value: "case" as const,
    label: "Open-Ended Case",
    description: "How would you approach...",
  },
  {
    value: "situational" as const,
    label: "Situational Judgment",
    description: "What would you do if...",
  },
];

export const DIFFICULTIES = [
  { value: "easy" as const, label: "Easy" },
  { value: "medium" as const, label: "Medium" },
  { value: "hard" as const, label: "Hard" },
];

export const MODEL = "claude-sonnet-4-20250514";
export const MAX_TOKENS = 2048;
