import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/anthropic";
import { buildEvaluationPrompt } from "@/lib/prompts";
import { EvaluateAnswerRequest, EvaluateAnswerResponse } from "@/lib/types";
import { MODEL, MAX_TOKENS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body: EvaluateAnswerRequest = await req.json();

    if (!body.question || !body.answer?.trim() || !body.answerMode) {
      return NextResponse.json(
        { error: "Question, answer, and answer mode are required" },
        { status: 400 }
      );
    }

    const { system, user } = buildEvaluationPrompt(body);

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system,
      messages: [{ role: "user", content: user }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    const parsed: EvaluateAnswerResponse = { feedback: JSON.parse(text) };

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error evaluating answer:", error);
    return NextResponse.json(
      { error: "Failed to evaluate answer. Please try again." },
      { status: 500 }
    );
  }
}
