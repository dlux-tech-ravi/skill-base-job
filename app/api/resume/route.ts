import { NextRequest, NextResponse } from "next/server";

// Simple placeholder Resume API so this route is a valid module.
// You can replace this with real logic later (e.g. saving or analyzing resumes).
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    return NextResponse.json(
      {
        message: "Resume API placeholder response",
        received: body,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("RESUME API ERROR", error);
    return NextResponse.json(
      { error: "Failed to process resume request" },
      { status: 500 }
    );
  }
}

