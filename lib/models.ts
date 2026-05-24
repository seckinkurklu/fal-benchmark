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
    id: "fal-ai/flux-realism",
    name: "FLUX Realism",
    costPerSecond: 0.0025,
  },
  {
    id: "fal-ai/stable-diffusion-v3-medium",
    name: "SD3 Medium",
    costPerSecond: 0.0018,
  },
];

export function getModel(id: string): ModelConfig | undefined {
  return MODELS.find((m) => m.id === id);
}

export function estimateCost(model: ModelConfig, latencyMs: number): number {
  return model.costPerSecond * (latencyMs / 1000);
}
