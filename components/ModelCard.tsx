"use client";

import type { ModelConfig } from "@/lib/models";
import type { ModelResult, ModelStatus } from "@/lib/types";

type ModelCardProps = {
  model: ModelConfig;
  status: ModelStatus;
  result?: ModelResult;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
};

function formatLatency(ms?: number) {
  if (ms == null) return "—";
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatCost(usd?: number) {
  if (usd == null) return "—";
  return usd < 0.01 ? `$${usd.toFixed(4)}` : `$${usd.toFixed(3)}`;
}

export function ModelCard({
  model,
  status,
  result,
  enabled,
  onToggle,
}: ModelCardProps) {
  const aesthetic = result?.aestheticScore;

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition dark:bg-zinc-900 ${
        enabled
          ? "border-zinc-200 dark:border-zinc-800"
          : "border-zinc-100 opacity-50 dark:border-zinc-900"
      }`}
    >
      <header className="flex items-center justify-between gap-2 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <div>
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
            {model.name}
          </h3>
          <p className="font-mono text-xs text-zinc-500">{model.id}</p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-500">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="rounded border-zinc-300"
          />
          Include
        </label>
      </header>

      <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-950">
        {status === "idle" && (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            Waiting for prompt
          </div>
        )}
        {status === "running" && (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
            <span className="text-sm text-zinc-500">Generating…</span>
          </div>
        )}
        {status === "error" && (
          <div className="flex h-full items-center justify-center p-4 text-center text-sm text-red-600">
            {result?.error ?? "Generation failed"}
          </div>
        )}
        {status === "done" && result?.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={result.imageUrl}
            alt={`${model.name} output`}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="grid grid-cols-3 gap-px border-t border-zinc-100 bg-zinc-100 text-center text-xs dark:border-zinc-800 dark:bg-zinc-800">
        <Metric label="Latency" value={formatLatency(result?.latencyMs)} />
        <Metric
          label="Aesthetic"
          value={aesthetic != null ? `${aesthetic.toFixed(1)}/10` : status === "running" ? "…" : "—"}
        />
        <Metric label="Est. cost" value={formatCost(result?.costEstimate)} />
      </div>

      {aesthetic != null && (
        <div className="px-4 pb-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-violet-500 transition-all"
              style={{ width: `${(aesthetic / 10) * 100}%` }}
            />
          </div>
        </div>
      )}
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white px-2 py-3 dark:bg-zinc-900">
      <div className="text-zinc-500">{label}</div>
      <div className="mt-0.5 font-mono font-medium text-zinc-900 dark:text-zinc-100">
        {value}
      </div>
    </div>
  );
}
