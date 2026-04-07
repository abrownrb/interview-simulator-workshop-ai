import { GenerateQuestionsRequest, EvaluateAnswerRequest } from "./types";

export function buildQuestionGenerationPrompt(req: GenerateQuestionsRequest) {
  const count = req.count ?? (req.mode === "job-description" ? 4 : 1);

  const system = `You are an expert interview coach who creates realistic, challenging interview questions. Always respond with valid JSON only, no markdown or extra text.`;

  let user: string;

  if (req.mode === "job-description") {
    user = `Given this job description, generate ${count} interview questions that are highly relevant to the role. Include a mix of behavioral, case, and situational questions appropriate for this position.

Job Description:
${req.jobDescription}

For each question, assign an appropriate difficulty level (easy, medium, or hard) and category (behavioral, case, or situational).

Respond with this exact JSON structure:
{
  "questions": [
    {
      "text": "The interview question",
      "category": "behavioral" | "case" | "situational",
      "difficulty": "easy" | "medium" | "hard",
      "multipleChoiceOptions": ["Option A (best answer)", "Option B (decent)", "Option C (weak)", "Option D (poor)"],
      "hint": "Brief guidance for approaching this question"
    }
  ]
}

For behavioral questions, ensure they naturally invite a STAR-format response (Situation, Task, Action, Result).
For multiple choice options, make one clearly the best answer, one decent, and two weaker options. Shuffle their order randomly.`;
  } else {
    const categoryLabels = {
      behavioral: "behavioral (STAR method)",
      case: "open-ended case",
      situational: "situational judgment",
    };
    const categoryLabel = categoryLabels[req.category!];
    const difficulty = req.difficulty!;

    user = `Generate ${count} ${difficulty}-difficulty ${categoryLabel} interview question${count > 1 ? "s" : ""}.

${req.category === "behavioral" ? "The question should naturally invite a STAR-format response (Situation, Task, Action, Result). Start with phrases like 'Tell me about a time when...' or 'Describe a situation where...'" : ""}
${req.category === "case" ? "The question should present an open-ended business or technical scenario that requires structured thinking. Start with phrases like 'How would you approach...' or 'Walk me through how you would...'" : ""}
${req.category === "situational" ? "The question should present a hypothetical workplace scenario and ask what the candidate would do. Start with phrases like 'What would you do if...' or 'Imagine you are in a situation where...'" : ""}

Difficulty guidelines:
- Easy: Common scenarios, straightforward situations
- Medium: More complex scenarios requiring nuanced thinking
- Hard: Challenging scenarios with competing priorities, ambiguity, or high stakes

Respond with this exact JSON structure:
{
  "questions": [
    {
      "text": "The interview question",
      "category": "${req.category}",
      "difficulty": "${difficulty}",
      "multipleChoiceOptions": ["Option A", "Option B", "Option C", "Option D"],
      "hint": "Brief guidance for approaching this question"
    }
  ]
}

For multiple choice options, make one clearly the best answer, one decent, and two weaker options. Shuffle their order randomly.`;
  }

  return { system, user, count };
}

export function buildEvaluationPrompt(req: EvaluateAnswerRequest) {
  const isBehavioral = req.question.category === "behavioral";

  const system = `You are an expert interview coach who provides constructive, actionable feedback on interview answers. Always respond with valid JSON only, no markdown or extra text.`;

  const user = `Evaluate the following interview answer.

Question: ${req.question.text}
Question type: ${req.question.category}
Difficulty: ${req.question.difficulty}
Answer mode: ${req.answerMode}
User's answer: ${req.answer}

Provide your evaluation as JSON with this exact structure:
{
  "overallScore": <number 1-10>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<specific strength 1>", "<specific strength 2>", ...],
  "improvements": ["<specific improvement area 1>", "<specific improvement area 2>", ...]${isBehavioral ? `,
  "starEvaluation": {
    "situation": { "present": <boolean>, "feedback": "<Was the context/background clearly set? What was good or missing?>" },
    "task": { "present": <boolean>, "feedback": "<Was the specific responsibility/challenge clearly stated? What was good or missing?>" },
    "action": { "present": <boolean>, "feedback": "<Were the specific steps taken clearly described? What was good or missing?>" },
    "result": { "present": <boolean>, "feedback": "<Were the outcomes/impact clearly stated with metrics if possible? What was good or missing?>" }
  }` : ""},
  "suggestedAnswer": "<A strong example answer that demonstrates best practices for this type of question>"
}

Scoring guidelines:
- 9-10: Exceptional answer covering all key points with specific examples
- 7-8: Strong answer with good structure and relevant details
- 5-6: Adequate answer but missing important elements
- 3-4: Weak answer lacking specifics or structure
- 1-2: Very poor or off-topic answer

${isBehavioral ? "For this behavioral question, pay special attention to the STAR framework. A great answer should clearly present the Situation, Task, Action, and Result." : ""}
${req.answerMode === "multiple-choice" ? "The user selected from multiple choice options. Evaluate whether they chose the best option and explain why it is or isn't the strongest choice." : "Evaluate the free-form response for completeness, specificity, structure, and relevance."}`;

  return { system, user };
}
