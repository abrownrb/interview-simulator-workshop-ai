import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/anthropic";
import { MODEL } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");

    const mediaType = audioFile.type || "audio/webm";

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "input_audio" as "text",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Audio,
              },
            } as unknown as { type: "text"; text: string },
            {
              type: "text",
              text: "Please provide an accurate word-for-word transcription of this audio recording. Return ONLY the transcribed text, with no additional commentary, labels, or formatting. If the audio is unclear or empty, return an empty string.",
            },
          ],
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ transcription: text.trim() });
  } catch (error) {
    console.error("Transcription error:", error);

    const message =
      error instanceof Error ? error.message : "Transcription failed";

    if (message.includes("Could not process") || message.includes("audio")) {
      return NextResponse.json(
        {
          error:
            "Audio format not supported. Please try recording again or type your answer instead.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: "Failed to transcribe audio. Please try again." },
      { status: 500 }
    );
  }
}
