import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Missing message" },
        { status: 400 }
      );
    }

    const url = new URL(req.url);
    const origin = `${url.protocol}//${url.host}`;

    let jobsSnippet = "";
    if (message.toLowerCase().includes("job")) {
      try {
        const jobsRes = await fetch(
          `${origin}/api/jobs?search=${encodeURIComponent(message)}`
        );
        const jobsJson = await jobsRes.json();
        const jobs = Array.isArray(jobsJson.jobs) ? jobsJson.jobs : [];

        if (jobs.length > 0) {
          const topJobs = jobs.slice(0, 5);
          jobsSnippet =
            "Here are some matching jobs from your job portal (title – company – link):\n" +
            topJobs
              .map((job: any, index: number) => {
                const title = job.title ?? "Untitled role";
                const company =
                  job.company_name ?? job.company ?? "Unknown company";
                const link =
                  job.url && typeof job.url === "string"
                    ? job.url.startsWith("http")
                      ? job.url
                      : `${origin}${job.url}`
                    : "";
                return `${index + 1}. ${title} – ${company}${
                  link ? ` – ${link}` : ""
                }`;
              })
              .join("\n");
        }
      } catch (err) {
        console.error("Failed to fetch jobs for AI assistant", err);
      }
    }

    const systemPrompt =
      "You are an AI assistant embedded in a job portal. " +
      "Always answer clearly and concisely.\n\n" +
      "If the user asks about jobs, YOU MUST return a short answer followed by a list of concrete job suggestions with clickable links. " +
      "Prefer using the jobs provided to you from the portal. " +
      "Format job suggestions as a markdown list like:\n" +
      "- [Job title – Company](https://example.com/job-link)\n\n" +
      "If no jobs are provided, suggest what keywords the user can try in the search box.";

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
    ];

    if (jobsSnippet) {
      messages.push({
        role: "assistant",
        content:
          "These are job results from the job portal based on the user's query:\n\n" +
          jobsSnippet,
      });
    }

    messages.push({ role: "user", content: message });

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
      max_tokens: 400,
    });

    const answer =
      completion.choices[0]?.message?.content ??
      "I couldn't generate an answer right now.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("AI ASSISTANT ERROR", error);
    return NextResponse.json(
      { error: "Failed to talk to AI" },
      { status: 500 }
    );
  }
}

