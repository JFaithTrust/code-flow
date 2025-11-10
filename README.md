# Code Flow# Code Flow

Collaborative Q&A platform built with the Next.js App Router, MongoDB, and NextAuth. Users can ask questions in a rich-text editor, explore community answers, follow tags, curate collections, and even pull in job listings powered by the RapidAPI JSearch endpoint. Dark/light theming, real-time validation, and AI-assisted drafting keep contributors productive across devices.Collaborative Q&A platform built with the Next.js App Router, MongoDB, and NextAuth. Users can ask questions in a rich-text editor, explore community answers, follow tags, curate collections, and even pull in job listings powered by the RapidAPI JSearch endpoint. Dark/light theming, real-time validation, and AI assisted drafting help keep the experience smooth for contributors.

## Table of contents## Table of contents

- [Features](#features)- [Features](#features)

- [Tech stack](#tech-stack)- [Tech stack](#tech-stack)

- [Project structure](#project-structure)- [Project structure](#project-structure)

- [Getting started](#getting-started)- [Getting started](#getting-started)

  - [Prerequisites](#prerequisites) - [Prerequisites](#prerequisites)

  - [Environment variables](#environment-variables) - [Environment variables](#environment-variables)

  - [Install and run](#install-and-run) - [Install and run](#install-and-run)

- [Available scripts](#available-scripts)- [Available scripts](#available-scripts)

- [Core workflows](#core-workflows)- [Core workflows](#core-workflows)

- [Deployment notes](#deployment-notes)- [Deployment notes](#deployment-notes)

- [Contributing](#contributing)- [Contributing](#contributing)

## Features## Features

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

- **Auth**: NextAuth v5 beta (GitHub, Google, credentials)## Project structure

- **Database**: MongoDB with Mongoose ODM```

- **Logging**: Pino + pino-prettycode-flow/

- **Tooling**: ESLint 9, Turbopack, npm scripts├── src/

│ ├── app/ # App Router routes (auth, dashboard, API)

## Project structure│ ├── components/ # Reusable UI, forms, editor integrations

````│ ├── constants/           # Static route, filter, and state definitions

code-flow/│   ├── database/            # Mongoose schemas & models

├── public/                  # Static assets (icons, images, robots.txt)│   ├── lib/                 # Server actions, utilities, API clients

├── src/│   ├── types/               # Shared TypeScript contracts

│   ├── app/                 # App Router routes (auth, root pages, API)│   └── auth.ts              # NextAuth configuration

│   ├── components/          # Reusable UI, forms, editor integrations├── public/                  # Static assets (icons, images, robots.txt)

│   ├── constants/           # Static route, filter, and state definitions├── eslint.config.mjs        # ESLint 9 flat config

│   ├── database/            # Mongoose schemas & models├── next.config.ts           # Next.js configuration (Turbopack enabled)

│   ├── lib/                 # Server actions, utilities, API clients├── postcss.config.mjs       # Tailwind/PostCSS pipeline

│   ├── types/               # Shared TypeScript contracts

│   └── auth.ts              # NextAuth configuration### Install and run

├── eslint.config.mjs        # ESLint 9 flat config

├── next.config.ts           # Next.js configuration (Turbopack enabled)```bash

├── postcss.config.mjs       # Tailwind/PostCSS pipeline# Install dependencies

├── tsconfig.json            # TypeScript compiler settingsnpm install

└── package.json             # Scripts and dependency manifest

```# Start the dev server (http://localhost:3000)

npm run dev

## Getting started

# Run lint checks (optional but recommended)

### Prerequisitesnpm run lint

- Node.js 20+ (Next.js 15 and React 19 require modern Node versions)```

- npm 10+ (or yarn/pnpm/bun if you prefer, adjust commands accordingly)

- MongoDB instance (Atlas or local) reachable from your dev machineBuild and launch production assets locally:

- RapidAPI account with access to JSearch (for job listings)

- OAuth apps for GitHub and Google if you plan to support social sign-in```bash

npm run build

### Environment variablesnpm run start

Create a `.env.local` file at the repository root and provide the following values:```

├── tsconfig.json            # TypeScript compiler settings

```ini└── package.json             # Scripts and dependency manifest

# Application URLs```

NEXTAUTH_URL=http://localhost:3000

NEXT_PUBLIC_BASE_URL=http://localhost:3000/api## Getting started



# Database### Prerequisites

NEXT_PUBLIC_MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>- Node.js 20+ (Next.js 15 and React 19 require modern Node versions)

- npm 10+ (or yarn/pnpm/bun if you prefer, update commands accordingly)

# NextAuth- MongoDB instance (Atlas or local) reachable from your dev machine

NEXTAUTH_SECRET=replace-with-long-random-string- RapidAPI account with access to JSearch (for job listings)

AUTH_GITHUB_ID=your-github-oauth-client-id- OAuth apps for GitHub and Google if you plan to support social sign-in

AUTH_GITHUB_SECRET=your-github-oauth-client-secret

AUTH_GOOGLE_ID=your-google-oauth-client-id### Environment variables

AUTH_GOOGLE_SECRET=your-google-oauth-client-secretCreate a `.env.local` file at the repository root and provide the following values:



# Third-party APIs```ini

NEXT_PUBLIC_RAPID_API_KEY=your-rapidapi-key# Application URLs

NEXTAUTH_URL=http://localhost:3000

# Optional logging tweaksNEXT_PUBLIC_BASE_URL=http://localhost:3000/api

LOG_LEVEL=info

```# Database

NEXT_PUBLIC_MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>

> Tip: when deploying, mirror these variables in your hosting provider (Vercel, Render, Docker secrets, etc.).

# NextAuth

### Install and runNEXTAUTH_SECRET=replace-with-long-random-string

AUTH_GITHUB_ID=your-github-oauth-client-id

```bashAUTH_GITHUB_SECRET=your-github-oauth-client-secret

# Install dependenciesAUTH_GOOGLE_ID=your-google-oauth-client-id

npm installAUTH_GOOGLE_SECRET=your-google-oauth-client-secret



# Start the dev server (http://localhost:3000)# Third-party APIs

npm run devNEXT_PUBLIC_RAPID_API_KEY=your-rapidapi-key



# Run lint checks (optional but recommended)# Optional logging tweaks

npm run lintLOG_LEVEL=info

````

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
