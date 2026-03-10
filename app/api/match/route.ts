import { NextRequest, NextResponse } from "next/server";

// Placeholder match API to satisfy TypeScript and route config.
// You can extend this later with real matching logic.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    return NextResponse.json(
      {
        message: "Match API placeholder response",
        received: body,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process match request" },
      { status: 500 }
    );
  }
}

