import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY,
});

type FluxOutput = {
  images?: Array<{ url: string }>;
};

export async function generateImage(
  modelId: string,
  prompt: string
): Promise<{ url: string; latencyMs: number }> {
  const start = Date.now();

  const result = await fal.subscribe(modelId, {
    input: { prompt },
    logs: false,
  });

  const latencyMs = Date.now() - start;
  const data = result.data as FluxOutput;
  const url = data.images?.[0]?.url;

  if (!url) {
    throw new Error("No image URL in model response");
  }

  return { url, latencyMs };
}
