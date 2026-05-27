"use client";

import { useCallback, useMemo, useState } from "react";
import { ModelCard } from "@/components/ModelCard";
import { PromptInput } from "@/components/PromptInput";
import { SummaryBar } from "@/components/SummaryBar";
import { MODELS } from "@/lib/models";
import type { ModelResult, ModelStatus } from "@/lib/types";

type CardState = {
  status: ModelStatus;
  result?: ModelResult;
};

export function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [enabledModels, setEnabledModels] = useState<Record<string, boolean>>(
    () => Object.fromEntries(MODELS.map((m) => [m.id, true]))
  );
  const [cards, setCards] = useState<Record<string, CardState>>(() =>
    Object.fromEntries(
      MODELS.map((m) => [m.id, { status: "idle" as ModelStatus }])
    )
  );

  const activeModels = useMemo(
    () => MODELS.filter((m) => enabledModels[m.id]),
    [enabledModels]
  );

  const runningCount = useMemo(
    () => Object.values(cards).filter((c) => c.status === "running").length,
    [cards]
  );

  const results = useMemo(
    () =>
      MODELS.map((m) => cards[m.id]?.result).filter(
        (r): r is ModelResult => r != null
      ),
    [cards]
  );

  const updateCard = useCallback((modelId: string, patch: Partial<CardState>) => {
    setCards((prev) => ({
      ...prev,
      [modelId]: { ...prev[modelId], ...patch },
    }));
  }, []);

  const runModel = useCallback(
    async (modelId: string, runPrompt: string) => {
      updateCard(modelId, {
        status: "running",
        result: { modelId },
      });

      try {
        const genRes = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ modelId, prompt: runPrompt }),
        });
        const genData = await genRes.json();

        if (!genRes.ok) {
          throw new Error(genData.error ?? "Generation failed");
        }

        updateCard(modelId, {
          status: "running",
          result: {
            modelId,
            imageUrl: genData.imageUrl,
            latencyMs: genData.latencyMs,
            costEstimate: genData.costEstimate,
          },
        });

        let aestheticScore: number | undefined;
        let aestheticError: string | undefined;
        try {
          const scoreRes = await fetch("/api/score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl: genData.imageUrl }),
          });
          const scoreData = await scoreRes.json();
          if (scoreRes.ok) {
            aestheticScore = scoreData.score;
          } else {
            aestheticError = scoreData.error ?? "Scoring failed";
          }
        } catch (err) {
          aestheticError =
            err instanceof Error ? err.message : "Scoring failed";
        }

        updateCard(modelId, {
          status: "done",
          result: {
            modelId,
            imageUrl: genData.imageUrl,
            latencyMs: genData.latencyMs,
            costEstimate: genData.costEstimate,
            aestheticScore,
            aestheticError,
          },
        });
      } catch (err) {
        updateCard(modelId, {
          status: "error",
          result: {
            modelId,
            error: err instanceof Error ? err.message : "Unknown error",
          },
        });
      }
    },
    [updateCard]
  );

  const runBenchmark = useCallback(async () => {
    const runPrompt = prompt.trim();
    if (!runPrompt || activeModels.length === 0) return;

    setIsRunning(true);

    setCards((prev) => {
      const next = { ...prev };
      for (const model of MODELS) {
        if (enabledModels[model.id]) {
          next[model.id] = { status: "idle" };
        }
      }
      return next;
    });

    await Promise.all(
      activeModels.map((model) => runModel(model.id, runPrompt))
    );

    setIsRunning(false);
  }, [prompt, activeModels, enabledModels, runModel]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6">
      <header className="space-y-2">
        <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
          fal model benchmark
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Compare image models side by side
        </h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          Run the same prompt across multiple fal models in parallel. See
          latency, estimated cost, and aesthetic scores for each output.
        </p>
      </header>

      <PromptInput
        value={prompt}
        onChange={setPrompt}
        onSubmit={runBenchmark}
        disabled={isRunning}
      />

      <SummaryBar results={results} runningCount={runningCount} />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {MODELS.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            status={cards[model.id]?.status ?? "idle"}
            result={cards[model.id]?.result}
            enabled={enabledModels[model.id] ?? true}
            onToggle={(on) =>
              setEnabledModels((prev) => ({ ...prev, [model.id]: on }))
            }
          />
        ))}
      </div>
    </div>
  );
}
