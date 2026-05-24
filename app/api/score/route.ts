import { NextResponse } from "next/server";
import { scoreAesthetic } from "@/lib/aesthetic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl } = body as { imageUrl?: string };

    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl is required" },
        { status: 400 }
      );
    }

    if (!process.env.HF_TOKEN) {
      return NextResponse.json(
        { error: "HF_TOKEN is not configured on the server" },
        { status: 500 }
      );
    }

    const score = await scoreAesthetic(imageUrl);
    return NextResponse.json({ score });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Scoring failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
