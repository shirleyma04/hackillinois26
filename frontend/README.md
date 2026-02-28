# Crash Out Frontend

Frontend-only React app built with Vite + TypeScript.

## Scripts

- `npm run dev` starts the development server
- `npm run build` builds for production
- `npm run preview` previews the production build
- `npm run lint` runs ESLint

## Environment

Copy `.env.example` to `.env` and update values as needed.

## App Structure

The app is organized as a single page (`CrashOutPage`) composed of vertical sections under `src/sections`, with reusable pieces in `src/components`, state in `src/store`, API calls in `src/services`, and shared helpers/types under `src/lib` and `src/types`.
