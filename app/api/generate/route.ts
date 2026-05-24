import { NextResponse } from "next/server";
import { generateImage } from "@/lib/fal";
import { estimateCost, getModel } from "@/lib/models";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { modelId, prompt } = body as { modelId?: string; prompt?: string };

    if (!modelId || !prompt?.trim()) {
      return NextResponse.json(
        { error: "modelId and prompt are required" },
        { status: 400 }
      );
    }

    if (!process.env.FAL_KEY) {
      return NextResponse.json(
        { error: "FAL_KEY is not configured on the server" },
        { status: 500 }
      );
    }

    const model = getModel(modelId);
    if (!model) {
      return NextResponse.json({ error: "Unknown model" }, { status: 400 });
    }

    const { url, latencyMs } = await generateImage(modelId, prompt.trim());
    const costEstimate = estimateCost(model, latencyMs);

    return NextResponse.json({ imageUrl: url, latencyMs, costEstimate });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
