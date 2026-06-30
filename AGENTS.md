# AGENTS.md

Next.js 15 (App Router, React 19) frontend for a travel/route-mapping app. Talks to a separate backend over HTTP.

## Commands

- `npm run dev` — dev server (uses `--turbopack`)
- `npm run build` — production build; injects `NEXT_PUBLIC_GIT_COMMIT` from `git rev-parse`, so it must run inside a git checkout
- `npm run lint` — `next lint` (ESLint)
- Typecheck: `npx tsc --noEmit` (no dedicated script; `noEmit` is set in tsconfig)
- No test suite exists. Do not invent `npm test`.

## Conventions that differ from defaults

- ESLint uses legacy `.eslintrc.json` (not flat config) despite ESLint 9.
- Prettier: single quotes, `printWidth: 120`, trailing commas. Import ordering is enforced by `@trivago/prettier-plugin-sort-imports`: `@/*` imports first, then relative, with a blank line between groups. Run lint/format before considering work done.
- Path alias `@/*` maps to the **repo root**, so imports are `@/components/...`, `@/src/...`, `@/app/...` (note `@/src`, not `@/`).
- UI strings, comments, and `aria-label`s are frequently in Polish — match the surrounding language.

## Architecture / non-obvious wiring

- Routes live under `app/[locale]/`; `locales` = `['pl', 'en']` (`app/locales.ts`). `middleware.ts` redirects `/` → `/pl`.
- `app/[locale]/layout.tsx` is `force-static` with `generateStaticParams`; it loads `messages/{locale}.json` and supplies them via `NextIntlClientProvider`.
- next-intl quirk: `i18n/request.ts` hardcodes `locale = 'en'`. Messages actually rendered come from the layout's provider (param-based), not from `request.ts`. Edit the layout/messages, not `request.ts`, to change UI copy.
- Leaflet/react-leaflet are **client-only**. `Map` is loaded via `dynamic(..., { ssr: false })` in `components/Map/MapWithSidebar.tsx`. Keep map code out of server components and never import leaflet at module top level in SSR paths.
- State: single Zustand store in `src/store/useMapStore.ts` composed from slices (`mapStore`, `generationSlice`, `routeOptionsSlice`); `tokenStore.ts` holds the auth token.
- Backend calls: `src/services/api.ts` (`ApiService`, static methods) and `auth.ts`, all hitting `process.env.NEXT_PUBLIC_API_URL`.

## Setup / env

- Copy `example.env` → `.env`. `NEXT_PUBLIC_API_URL` (backend) is required.

## Deployment

- `deployment/` holds the prod `Dockerfile`, `docker-compose.yml`, and `deploy.sh` (copies `/root/pp/.env.<dir>` → `./.env` then builds/runs via compose). The root `Dockerfile`/`docker-compose.yml` are separate; deployment uses the ones in `deployment/`.
