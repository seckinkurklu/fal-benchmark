import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY,
});

function extractImageUrl(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;

  const obj = data as Record<string, unknown>;

  const images = obj.images;
  if (Array.isArray(images) && images[0] && typeof images[0] === "object") {
    const url = (images[0] as { url?: string }).url;
    if (url) return url;
  }

  const image = obj.image;
  if (image && typeof image === "object") {
    const url = (image as { url?: string }).url;
    if (url) return url;
  }

  return undefined;
}

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
  const url = extractImageUrl(result.data);

  if (!url) {
    throw new Error("No image URL in model response");
  }

  return { url, latencyMs };
}
