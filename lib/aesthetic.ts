const HF_MODEL = "cafeai/cafe_aesthetic";
const HF_ENDPOINT = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

type ClassificationLabel = {
  label: string;
  score: number;
};

export async function scoreAesthetic(imageUrl: string): Promise<number> {
  const token = process.env.HF_TOKEN;
  if (!token) {
    throw new Error("HF_TOKEN is not configured");
  }

  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error(`Failed to fetch image: ${imageResponse.status}`);
  }

  const imageBytes = await imageResponse.arrayBuffer();

  const response = await fetch(HF_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/octet-stream",
    },
    body: imageBytes,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HF aesthetic scorer failed (${response.status}): ${text}`);
  }

  const labels = (await response.json()) as ClassificationLabel[];
  const aesthetic = labels.find(
    (l) =>
      l.label.toLowerCase().includes("aesthetic") &&
      !l.label.toLowerCase().includes("not")
  );

  const score = aesthetic?.score ?? labels[0]?.score ?? 0;
  return Math.round(score * 100) / 10;
}
