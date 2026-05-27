# fal Model Benchmark

Compare fal image generation models side by side with the same prompt. Each model card shows latency, estimated cost, and an aesthetic score from [cafeai/cafe_aesthetic](https://huggingface.co/cafeai/cafe_aesthetic).

## Setup

1. Copy environment variables:

```bash
cp .env .env.local
```

2. Add your API keys:

- `FAL_KEY` — [fal.ai dashboard](https://fal.ai/dashboard/keys)
- `HF_TOKEN` — [Hugging Face access token](https://huggingface.co/settings/tokens) with **Inference Providers** permission (free tier works)

3. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Models

Configured in `lib/models.ts`:

- `fal-ai/flux/schnell`
- `fal-ai/flux/dev`
- `fal-ai/flux-pro/v1.1`
- `fal-ai/recraft/v3/text-to-image`
- `fal-ai/ideogram/v3`

Toggle models on each card before running. Cost estimates use per-second rates defined in the registry (adjust as fal pricing changes).

## Deploy (Vercel)

1. Push to GitHub and import the repo in Vercel.
2. Add `FAL_KEY` and `HF_TOKEN` as environment variables.
3. Deploy.

## Not included (yet)

- Nightly auto-benchmark / cached `benchmark-data.json`
- Shareable run permalinks (`/run/[id]`)

See `proposal.md` for the full roadmap.
