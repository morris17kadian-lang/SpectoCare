# SpectoCare — Web Quickstart

Steps to run the app in a browser (development):

1. Ensure Node.js v18+ is installed.
2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

3. Start Expo web:

```bash
npx expo start --web
```

If you encounter dependency conflicts, use `--legacy-peer-deps` during install. If the dev server shows runtime errors, try clearing caches:

```bash
npx expo start --web --clear
```

## Scripts

- **`npm run web`** — Start Expo for web.
- **`npm run build:web`** — Build static web bundle (requires Metro; see note below).
- **`npm run lint`** — Run ESLint (`npx eslint`).
- **`npm run test`** — Run Jest tests (`npx jest`).

## Auth & state

- **Redux** — Auth state lives in `src/stores` (e.g. `authSlice`). The app is wrapped with `Provider` in `App.tsx`.
- **AuthContext** — Reads from and dispatches to Redux so existing `useAuth()` usage keeps working. Login/register use a demo user and token; replace with `authService` and your API when ready.
- **Token** — Stored via `src/lib/storage.ts` (web: `localStorage`). The `src/api/axios.ts` client attaches the token from storage to requests.

## Build note

If `npx expo export --platform web` fails with `Cannot find module 'react-native-worklets/plugin'`, install the optional dependency or clear Metro cache: `npx expo start --web --clear`. The app runs in development with `npx expo start --web` without a full export.
