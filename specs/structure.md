# Structure Spec

## Repository Shape
- `src/routes/` contains SvelteKit pages, layouts, form actions, and API endpoints. `src/routes/(app)/` is the protected bookmark workspace and `src/routes/login/` is the public auth entry.
- `src/lib/server/` contains server-only integrations and domain logic such as auth helpers, request observability, Supabase access, and bookmark services/repositories.
- `src/lib/validators/` contains shared request and form validation helpers.
- `src/lib/types/` contains domain-facing TypeScript types.
- `src/app.css` holds shared theme tokens and repeated `shelf-*` UI primitives.
- `supabase/` holds local Supabase config, migrations, and seed data for the Postgres-backed app.
- `tasks/` holds task-specific planning artifacts and working notes.
- `specs/` holds project-level steering docs and focused steering such as frontend direction.

## Entry Points
- `src/hooks.server.ts` initializes Logto handling, request IDs, and server-side request/error logging.
- `src/routes/+layout.svelte` and `src/routes/+layout.server.ts` establish global shell behavior and user data plumbing.
- `src/routes/login/` is the public sign-in surface.
- `src/routes/(app)/+layout.server.ts` enforces authenticated access for the protected route group.
- `src/routes/(app)/+page.server.ts` loads bookmark data, search state, and form actions for create/delete/sign-out flows.
- `src/routes/api/supabase-test/+server.ts` is a developer-facing connectivity probe for the Supabase setup.

## Architectural Conventions
- Put authentication gates in shared layouts when a route group should be protected, instead of repeating checks in every page.
- Keep route server modules focused on load/action orchestration, response shaping, and error mapping.
- Keep domain rules and normalization in service modules, and isolate raw Supabase queries plus row mapping in repository modules.
- Share validation through `src/lib/validators/` so form parsing and server-side enforcement stay aligned.
- Keep server-only infrastructure concerns such as logging and Supabase client setup under `src/lib/server/`.
- Keep tests next to the route or module they verify so behavior and coverage stay coupled.
- Reuse documented UI primitives and visual rules before adding new ad hoc styling patterns.

## Where To Put New Work
- Add new pages, endpoints, and route-level actions in `src/routes/`, using `src/routes/(app)/` for authenticated bookmark surfaces where appropriate.
- Add new server-side business logic or integrations under `src/lib/server/<domain>/`.
- Add shared schemas and form helpers under `src/lib/validators/`.
- Add or update domain types in `src/lib/types/`.
- Add repeated theme tokens or shared UI primitives in `src/app.css`, and keep one-off styling inside the relevant route/component.
- Add schema changes in `supabase/migrations/` and update `supabase/seed.sql` only when durable local seed data needs to change.
- Add tests alongside the affected route or module.
- Update durable product or UI guidance in `specs/`, and keep task-specific implementation artifacts under `tasks/`.
