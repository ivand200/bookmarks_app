# Structure Spec

## Repository Shape
- `src/routes/` contains SvelteKit pages, layouts, form actions, and API endpoints.
- `src/lib/server/` contains server-only integrations and domain logic such as auth helpers, Supabase access, and bookmark services/repositories.
- `src/lib/validators/` contains shared request and form validation helpers.
- `src/lib/types/` contains domain-facing TypeScript types.
- `supabase/migrations/` contains durable schema changes for the Postgres database.
- `docs/` holds long-lived frontend and visual guidance.
- `tasks/` holds task-specific planning artifacts and working notes.
- `specs/` holds project-level steering docs for product, tech, and structure.

## Entry Points
- `src/hooks.server.ts` initializes Logto handling for each request.
- `src/routes/+layout.svelte` and `src/routes/+layout.server.ts` establish global theme and user data plumbing.
- `src/routes/login/` is the public sign-in surface.
- `src/routes/(app)/` is the authenticated bookmark workspace, with the route-group layout enforcing user presence.
- `src/routes/api/supabase-test/+server.ts` is a developer-facing connectivity probe for the Supabase setup.

## Architectural Conventions
- Put authentication gates in shared layouts when a route group should be protected, instead of repeating checks in every page.
- Keep route server modules focused on load/action orchestration, response shaping, and error mapping.
- Keep domain rules and normalization in service modules, and isolate raw Supabase queries plus row mapping in repository modules.
- Keep bookmark organization work close to the bookmark domain unless tags, folders, or saved views become complex enough to deserve their own server-side module.
- Share validation through `src/lib/validators/` so form parsing and server-side enforcement stay aligned.
- Reuse documented UI primitives and visual rules before adding new ad hoc styling patterns.

## Where To Put New Work
- Add new pages, endpoints, and route-level actions in `src/routes/`, using route groups for authenticated surfaces where appropriate.
- Add new server-side business logic or integrations under `src/lib/server/<domain>/`.
- Keep bookmark-specific tags, folders, and collection navigation logic under `src/lib/server/bookmarks/` until the organization model becomes broad enough to split out intentionally.
- Add shared schemas and form helpers under `src/lib/validators/`.
- Add or update domain types in `src/lib/types/`.
- Add schema changes in `supabase/migrations/`.
- Update durable product or UI guidance in `specs/` or `docs/`, and keep task-specific implementation artifacts under `tasks/`.
