"use client";

import type { ModelResult } from "@/lib/types";

type SummaryBarProps = {
  results: ModelResult[];
  runningCount: number;
};

export function SummaryBar({ results, runningCount }: SummaryBarProps) {
  const completed = results.filter((r) => r.imageUrl && r.latencyMs != null);

  if (completed.length === 0 && runningCount === 0) {
    return null;
  }

  const fastest = completed.reduce<ModelResult | null>((best, r) => {
    if (!best || (r.latencyMs ?? Infinity) < (best.latencyMs ?? Infinity)) {
      return r;
    }
    return best;
  }, null);

  const bestAesthetic = completed.reduce<ModelResult | null>((best, r) => {
    if (r.aestheticScore == null) return best;
    if (!best || (r.aestheticScore ?? 0) > (best.aestheticScore ?? 0)) {
      return r;
    }
    return best;
  }, null);

  const avgLatency =
    completed.length > 0
      ? completed.reduce((sum, r) => sum + (r.latencyMs ?? 0), 0) /
        completed.length
      : null;

  return (
    <div className="flex flex-wrap gap-4 rounded-xl border border-violet-200 bg-violet-50 px-5 py-4 text-sm dark:border-violet-900/50 dark:bg-violet-950/30">
      {runningCount > 0 && (
        <Stat
          label="Status"
          value={`${runningCount} model${runningCount === 1 ? "" : "s"} running`}
        />
      )}
      {fastest && (
        <Stat
          label="Fastest"
          value={`${fastest.modelId.split("/").pop()} · ${((fastest.latencyMs ?? 0) / 1000).toFixed(2)}s`}
        />
      )}
      {bestAesthetic && bestAesthetic.aestheticScore != null && (
        <Stat
          label="Best aesthetic"
          value={`${bestAesthetic.modelId.split("/").pop()} · ${bestAesthetic.aestheticScore.toFixed(1)}/10`}
        />
      )}
      {avgLatency != null && (
        <Stat
          label="Avg latency"
          value={`${(avgLatency / 1000).toFixed(2)}s`}
        />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-violet-600 dark:text-violet-400">
        {label}
      </div>
      <div className="font-mono font-medium text-violet-950 dark:text-violet-100">
        {value}
      </div>
    </div>
  );
}
