# Code Flow# Code Flow

Collaborative Q&A platform built with the Next.js App Router, MongoDB, and NextAuth. Users can ask questions in a rich-text editor, explore community answers, follow tags, curate collections, and even pull in job listings powered by the RapidAPI JSearch endpoint. Dark/light theming, real-time validation, and AI-assisted drafting keep contributors productive across devices.Collaborative Q&A platform built with the Next.js App Router, MongoDB, and NextAuth. Users can ask questions in a rich-text editor, explore community answers, follow tags, curate collections, and even pull in job listings powered by the RapidAPI JSearch endpoint. Dark/light theming, real-time validation, and AI assisted drafting help keep the experience smooth for contributors.

## Table of contents## Table of contents

- [Features](#features)

- [Tech stack](#tech-stack)

- [Project structure](#project-structure)

- [Available scripts](#available-scripts)

- [Core workflows](#core-workflows)

- [Deployment notes](#deployment-notes)

- [Contributing](#contributing)

## Features

- Full Q&A workflow: authenticate, compose questions with MDX-powered rich text, publish answers, vote, and bookmark into personal collections.- Q&A workflow: authenticate, ask questions with MDX powered rich text, browse answers, vote, and bookmark into personal collections.

- Tag-driven discovery with home, community, and global search filters for fast content triage.- Tag driven discovery with quick filters, global search, and community leaderboards.

- Inline AI assistant for suggested answers via the `/api/ai/answer` endpoint.

- Job marketplace that queries RapidAPI's JSearch feed with location-aware filters.## Tech stack

- Responsive layouts for mobile and desktop, plus persisted dark/light mode toggle.- **Framework**: Next.js 15 (App Router, Server Actions, Turbopack dev server)

- Authentication via NextAuth supporting credentials, GitHub OAuth, and Google OAuth providers.- **Language**: TypeScript + React 19

- Centralized logging with Pino, schema validation via Zod, and consistent error handling across server actions.- **UI**: Tailwind CSS 4 alpha utilities, shadcn/ui primitives, MDX Editor

- **Forms & Validation**: React Hook Form, Zod

## Tech stack- **Auth**: NextAuth v5 beta (GitHub, Google, credentials)

- **Framework**: Next.js 15 (App Router, Server Actions, Turbopack dev server)- **Database**: MongoDB with Mongoose ODM

- **Language**: TypeScript + React 19- **Logging**: Pino + pino-pretty

- **UI**: Tailwind CSS v4 (alpha utilities), shadcn/ui primitives, MDX Editor- **Tooling**: ESLint 9, Turbopack, npm scripts

- **Forms & Validation**: React Hook Form, Zod

- **Auth**: NextAuth v5 beta (GitHub, Google, credentials)

- **Database**: MongoDB with Mongoose ODM

- **Logging**: Pino + pino-prettycode-flow

- **Tooling**: ESLint 9, Turbopack

Build and launch production assets locally:> Tip: when deploying, mirror these variables in your hosting provider (Vercel, Docker secrets, etc.).

```bash
npm run build
npm run start
```

## Available scripts

- `npm run dev` – start Next.js in development mode with Turbopack
- `npm run build` – create an optimized production build
- `npm run start` – serve the production build locally
- `npm run lint` – run ESLint across the project (consider excluding `.next/` artifacts)

## Core workflows

- **Authentication** – Routes under `src/app/(auth)` wrap the shared `AuthForm`, combining React Hook Form with Zod schemas. Credentials flow persist hashes via bcrypt, while GitHub/Google rely on NextAuth providers.
- **Asking questions** – `QuestionForm` leverages `@mdxeditor/editor` for rich content. Server actions in `src/lib/actions/question.action.ts` validate with Zod and persist to MongoDB, updating tag counts transactionally.
- **Answering** – The answer form reuses the editor, supports manual drafts, and can request AI suggestions from `/api/ai/answer` before submission.
- **Tags & collections** – Users browse tags, see community metrics, and build personal collections via dedicated routes within `src/app/(root)`.
- **Job board** – `src/lib/actions/job.action.ts` hits RapidAPI JSearch; ensure `NEXT_PUBLIC_RAPID_API_KEY` is set or short-circuit the feature.

## Deployment notes

- Configure every environment variable in the target platform (Vercel, Render, Docker, etc.).
- Ensure the MongoDB connection string is accessible from the deployed environment (Atlas IP allowlist or VPC).
- Register OAuth callback URLs such as `https://your-domain.com/api/auth/callback/github` for each provider.
- Consider enabling production logging sinks (e.g., Logflare, Datadog) using Pino transports if needed.
- Review files under `public/` (robots, icons, metadata) before launch.

## Contributing

1. Fork the repository and create a feature branch.
2. Keep changes scoped; run `npm run lint` (and relevant tests) before committing.
3. Submit a pull request describing the motivation, implementation details, and testing notes. Screenshots or clips are appreciated for UI work.

Found a bug or have an idea? Open an issue or start a discussion—contributions are always welcome!
