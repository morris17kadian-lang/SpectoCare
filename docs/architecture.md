# SpectoCare — Architecture Overview

This document outlines the recommended production architecture for SpectoCare (Expo + React Native Web).

Folders added in scaffold:

- `src/api` — API client(s) and network interceptors.
- `src/components` — Shared presentational components.
- `src/hooks` — Reusable React hooks.
- `src/services` — Service wrappers for backend endpoints.
- `src/validations` — Zod schemas for payload validation.

Run instructions (web):

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Start Expo web:
   ```bash
   npx expo start --web
   ```

Notes:
- Keep platform-specific shims in `src/lib` when needed.
- Validate inputs server-side and client-side using schemas in `src/validations`.
