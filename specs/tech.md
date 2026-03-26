# Tech Spec

## Stack
- TypeScript across a SvelteKit 2 application running on Svelte 5.
- Bun is the package manager, local script runner, and deployment runtime.
- Vite powers development/build tooling.
- `svelte-adapter-bun` is the active SvelteKit adapter.
- DaisyUI 5 with Tailwind CSS 4 provides the UI foundation.
- Zod is used for request and form validation.
- Vitest provides server-side tests and Biome handles formatting/linting.

## Key Services / Infrastructure
- Logto, via `@logto/sveltekit`, provides authentication and user session handling in server hooks.
- Supabase Postgres stores bookmark data, with schema changes tracked in `supabase/migrations/`.
- `@supabase/supabase-js` is used from server-side code to query and mutate bookmark records.
- Request and action observability uses the local JSON logger in `src/lib/server/observability/`.

## Engineering Conventions
- Resolve auth on the server and pass user state through `locals` and server load functions.
- Validate form inputs with shared Zod schemas before calling business logic or persistence code.
- Keep bookmark business rules in `src/lib/server/bookmarks/`, with route server modules handling HTTP orchestration and repositories owning raw Supabase access.
- Keep shared server integrations in `src/lib/server/` and avoid moving bookmark persistence logic into client-side code.
- Emit structured request or action logs from server workflows instead of ad hoc console output.
- Keep tests close to the modules they verify, using Vitest node tests for business logic, validation, and access-control boundaries rather than browser E2E flows.
- Preserve the repo's documented frontend direction in `specs/frontend.md` when evolving UI.

## Related Steering Docs
- `specs/frontend.md` for the durable UI direction, workflow, and shared page patterns.

## Technical Constraints
- `LOGTO_ENDPOINT`, `LOGTO_APP_ID`, `LOGTO_APP_SECRET`, `LOGTO_COOKIE_ENCRYPTION_KEY`, `SUPABASE_PUBLIC_SUPABASE_URL`, and `SUPABASE_PUBLISHABLE_KEY` must be present for auth and persistence to work.
- The shared Supabase server client disables client-side style session persistence and token refresh behavior.
- Deployment assumptions should remain Bun-compatible unless the adapter/runtime choice changes deliberately.
