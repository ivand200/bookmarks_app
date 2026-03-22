# Tech Spec

## Stack
- TypeScript across a SvelteKit 2 application running on Svelte 5.
- Bun is the package manager and script runner.
- Vite powers development/build tooling.
- DaisyUI 5 with Tailwind CSS 4 provides the UI foundation.
- Zod is used for request and form validation.

## Key Services / Infrastructure
- Logto, via `@logto/sveltekit`, provides authentication and user session handling in server hooks.
- Supabase Postgres stores bookmark data, with schema changes tracked in `supabase/migrations/`.
- `@supabase/supabase-js` is used from server-side code to query and mutate bookmark records.

## Engineering Conventions
- Resolve auth on the server and pass user state through `locals` and server load functions.
- Validate form inputs with shared Zod schemas before calling business logic or persistence code.
- Keep bookmark business rules in `src/lib/server/bookmarks/`, with route actions coordinating HTTP concerns and the repository layer owning raw Supabase access.
- Keep tests close to the modules they verify, using Vitest node tests for business logic, validation, and access-control boundaries rather than browser E2E flows.
- Preserve the repo's documented frontend direction in `docs/frontend.md` and `docs/frontend-workflow.md` when evolving UI.

## Technical Constraints
- Server-side Logto and Supabase environment variables are required for the app to boot correctly.
- The shared Supabase server client disables client-side style session persistence and token refresh behavior.
- The project currently uses `@sveltejs/adapter-auto`, so deployment-specific assumptions should stay out of app code until a concrete target is chosen.
