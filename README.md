# Travel Map Frontend

A modern travel and route-mapping application built with **Next.js 15**, **React 19**, and **TypeScript**. This frontend communicates with a separate backend API to provide interactive map visualization and route planning features.

## Features

- Interactive map visualization powered by Leaflet and react-leaflet
- Multi-language support (Polish and English)
- Route planning and optimization
- Responsive design with Tailwind CSS
- Static site generation with dynamic routes
- Client-side state management with Zustand

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet with react-leaflet
- **State Management**: Zustand
- **Internationalization**: next-intl
- **Linting**: ESLint
- **Code Formatting**: Prettier with import sorting
- **Build Tool**: Turbopack (development)

## Prerequisites

- Node.js (v18 or higher)
- npm or your preferred package manager

## Setup

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Create environment file from template:
   ```bash
   cp example.env .env
   ```

3. Configure `NEXT_PUBLIC_API_URL` in `.env` to point to your backend API

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The application will redirect to `/pl` by default.

The app supports hot module reloading—changes will be reflected immediately.

## Building

Create an optimized production build:

```bash
npm run build
```

**Note**: The build process injects `NEXT_PUBLIC_GIT_COMMIT` from git, so it must run inside a git checkout.

## Linting & Type Checking

Format and lint code:

```bash
npm run lint
```

Check TypeScript types:

```bash
npx tsc --noEmit
```

## Project Structure

- `app/[locale]/` — App Router routes with locale support (`pl`, `en`)
- `components/` — Reusable React components
- `src/store/` — Zustand state management (mapStore, tokenStore)
- `src/services/` — API client (api.ts, auth.ts)
- `messages/` — Translation files per locale
- `deployment/` — Docker and deployment configuration
- `i18n/` — Internationalization setup

## Architecture Notes

- **Localization**: Routes use `app/[locale]/` structure. The layout is `force-static` and loads messages via `NextIntlClientProvider`.
- **Maps**: Leaflet is loaded dynamically with SSR disabled to keep it client-only.
- **State**: Single Zustand store with slices for maps, generation, and route options.
- **API**: All backend calls use `ApiService` and `AuthService` from `src/services/`.

## Deployment

The application includes Docker support for production deployment:

```bash
cd deployment
./deploy.sh
```

See `deployment/` for Docker configuration and deployment scripts.

## Code Conventions

- **Path Alias**: `@/*` maps to repository root (e.g., `@/components/`, `@/src/`)
- **Imports**: Organized by `@/*` first, then relative imports (enforced by Prettier)
- **Language**: UI strings, comments, and labels often use Polish to match the surrounding codebase
- **ESLint**: Legacy `.eslintrc.json` format (not flat config)
- **Prettier**: Single quotes, printWidth 120, trailing commas enabled

## Contributing

Follow the established code conventions and ensure tests pass before submitting changes.
