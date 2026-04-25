# Project-Real Alpha

Project-Real Alpha is a private Next.js App Router app for an authenticated
personal command dashboard. The current backend supports Rise & Grind entries
and daily AI coach cards backed by MongoDB.

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Keep local values in `.env.local`. Do not commit real secrets.

```bash
MONGODB_URI=
MONGODB_DB=real-alpha
MONGODB_COLLECTION=real-alpha

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

AI_PROVIDER=nvidia
AI_API_BASE_URL=https://integrate.api.nvidia.com/v1
AI_API_KEY=
AI_MODEL=deepseek-ai/deepseek-v4-flash
AI_FALLBACK_MODEL=meta/llama-3.1-8b-instruct
```

Optional AI tuning variables:

```bash
AI_MAX_TOKENS=2048
AI_TEMPERATURE=0.4
AI_TOP_P=0.95
AI_TIMEOUT_MS=18000
```

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```

There is no test script configured yet.
