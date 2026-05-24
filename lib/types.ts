export type ModelStatus = "idle" | "running" | "done" | "error";

export type ModelResult = {
  modelId: string;
  imageUrl?: string;
  latencyMs?: number;
  costEstimate?: number;
  aestheticScore?: number;
  error?: string;
};
