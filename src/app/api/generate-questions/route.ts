import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/anthropic";
import { buildQuestionGenerationPrompt } from "@/lib/prompts";
import { GenerateQuestionsRequest, GenerateQuestionsResponse } from "@/lib/types";
import { MODEL, MAX_TOKENS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateQuestionsRequest = await req.json();

    if (body.mode === "practice") {
      if (!body.category || !body.difficulty) {
        return NextResponse.json(
          { error: "Category and difficulty are required for practice mode" },
          { status: 400 }
        );
      }
    } else if (body.mode === "job-description") {
      if (!body.jobDescription?.trim()) {
        return NextResponse.json(
          { error: "Job description is required" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    const { system, user } = buildQuestionGenerationPrompt(body);

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system,
      messages: [{ role: "user", content: user }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    const parsed: GenerateQuestionsResponse = JSON.parse(text);

    // Assign IDs to questions
    parsed.questions = parsed.questions.map((q, i) => ({
      ...q,
      id: `q-${Date.now()}-${i}`,
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { error: "Failed to generate questions. Please try again." },
      { status: 500 }
    );
  }
}
