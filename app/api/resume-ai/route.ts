import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Simple placeholder AI resume endpoint so TypeScript sees this as a valid module.
export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY server configuration" },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey });

    const body = await req.json().catch(() => ({}));
    const prompt =
      typeof body?.prompt === "string" && body.prompt.trim().length > 0
        ? body.prompt
        : "You are a helpful assistant that gives short resume improvement tips.";

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a resume improvement assistant." },
        { role: "user", content: prompt },
      ],
      max_tokens: 200,
    });

    const answer =
      completion.choices[0]?.message?.content ??
      "I couldn't generate suggestions right now.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("RESUME-AI ERROR", error);
    return NextResponse.json(
      { error: "Failed to talk to Resume AI" },
      { status: 500 }
    );
  }
}

