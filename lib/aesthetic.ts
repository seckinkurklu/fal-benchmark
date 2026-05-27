import { InferenceClient } from "@huggingface/inference";

type ClassificationLabel = {
  label: string;
  score: number;
};

function parseAestheticScore(labels: ClassificationLabel[]): number {
  const aesthetic = labels.find(
    (l) =>
      l.label.toLowerCase().includes("aesthetic") &&
      !l.label.toLowerCase().includes("not")
  );

  const probability = aesthetic?.score ?? labels[0]?.score ?? 0;
  return Math.round(probability * 100) / 10;
}

export async function scoreAesthetic(imageUrl: string): Promise<number> {
  const token = process.env.HF_TOKEN?.trim();
  if (!token) {
    throw new Error("HF_TOKEN is not configured");
  }

  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error(`Failed to fetch image: ${imageResponse.status}`);
  }

  const imageBytes = await imageResponse.arrayBuffer();
  const contentType =
    imageResponse.headers.get("content-type") ?? "image/jpeg";
  const blob = new Blob([imageBytes], { type: contentType });

  const client = new InferenceClient(token);
  const labels = await client.imageClassification({
    model: "cafeai/cafe_aesthetic",
    data: blob,
  });

  return parseAestheticScore(labels);
}
