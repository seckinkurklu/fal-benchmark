export type ModelConfig = {
  id: string;
  name: string;
  /** Estimated cost in USD per second of compute */
  costPerSecond: number;
};

export const MODELS: ModelConfig[] = [
  {
    id: "fal-ai/flux/schnell",
    name: "FLUX Schnell",
    costPerSecond: 0.0008,
  },
  {
    id: "fal-ai/flux/dev",
    name: "FLUX Dev",
    costPerSecond: 0.0025,
  },
  {
    id: "fal-ai/flux-pro/v1.1",
    name: "FLUX Pro v1.1",
    costPerSecond: 0.004,
  },
  {
    id: "fal-ai/recraft/v3/text-to-image",
    name: "Recraft V3",
    costPerSecond: 0.003,
  },
  {
    id: "ideogram/v4",
    name: "Ideogram V4",
    costPerSecond: 0.003,
  },
  {
    id: "fal-ai/krea/v2/large/text-to-image",
    name: "KREA 2",
    costPerSecond: 0.006,
  },
];

export function getModel(id: string): ModelConfig | undefined {
  return MODELS.find((m) => m.id === id);
}

export function estimateCost(model: ModelConfig, latencyMs: number): number {
  return model.costPerSecond * (latencyMs / 1000);
}
