"use client";

import { useEffect, useState } from "react";

const HISTORY_KEY = "fal-benchmark-prompt-history";
const MAX_HISTORY = 10;

type PromptInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export function PromptInput({
  value,
  onChange,
  onSubmit,
  disabled,
}: PromptInputProps) {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
  }, []);

  function saveToHistory(prompt: string) {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    const next = [trimmed, ...history.filter((p) => p !== trimmed)].slice(
      0,
      MAX_HISTORY
    );
    setHistory(next);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    saveToHistory(value);
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe the image you want to benchmark…"
          disabled={disabled}
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="rounded-lg bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Run benchmark
        </button>
      </div>

      {history.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Recent:
          </span>
          {history.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              disabled={disabled}
              className="max-w-xs truncate rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-600 transition hover:border-violet-300 hover:text-violet-700 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-violet-600 dark:hover:text-violet-300"
              title={item}
            >
              {item.length > 48 ? `${item.slice(0, 48)}…` : item}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
