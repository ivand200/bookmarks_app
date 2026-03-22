# AGENTS.md

## Purpose

Use this file for agent behavior, workflow rules, and high-signal project instructions.

Do not duplicate durable project knowledge here when it already lives in the steering docs:

- `specs/product.md`
- `specs/tech.md`
- `specs/structure.md`

For UI work, also use:

- `docs/frontend-workflow.md`
- `docs/frontend.md`

## Project Snapshot

- App type: personal bookmark manager MVP
- Language: TypeScript
- Package manager: Bun
- Framework: SvelteKit 2 on Svelte 5
- Frontend: DaisyUI + Tailwind CSS 4
- Auth: Logto
- Database: Supabase Postgres

If a project fact here conflicts with `specs/`, update this file only if the fact materially changes agent behavior. Otherwise treat `specs/` as the canonical durable source.

## Working Agreements

- Follow DRY when a shared abstraction makes the code clearer.
- Follow YAGNI and avoid speculative features or abstractions.
- Prefer low coupling between layers and modules.
- Prefer high cohesion within files and domains.
- Choose the simplest design that preserves readability, testability, and maintainability.

## Repo Workflow

Common commands:

- `bun install`
- `bun run dev`
- `bun run check`
- `bun run lint`
- `bun run test`
- `bun run verify`

Supabase workflow:

- `bun run supabase:link`
- `bun run supabase:db:push`
- `bun run supabase:types`

When changing code, prefer running the narrowest relevant checks first, then broader checks before finishing when the change scope warrants it.

## Implementation Expectations

- Keep auth and protected-route enforcement on the server side.
- Use shared validation schemas before business logic or persistence.
- Keep route server modules focused on load/action orchestration and HTTP concerns.
- Keep bookmark and other domain rules in focused server-side modules.
- Keep raw Supabase querying and row mapping in repository-style modules.
- Reuse established UI primitives and documented visual patterns before adding new styling conventions.

## Svelte MCP Instructions

If the agent can use the Svelte MCP server:

1. Run `list-sections` first for Svelte or SvelteKit work.
2. Analyze the returned `use_cases` and fetch all relevant sections with `get-documentation`.
3. Run `svelte-autofixer` whenever writing Svelte code and keep fixing issues until it reports no actionable suggestions.
4. Ask before generating a `playground-link`, and never generate one when code was written directly into this repository.

## DaisyUI Docs

When work involves DaisyUI components, classes, themes, or usage rules:

- treat <https://daisyui.com/llms.txt> as the default compact reference
- check it before guessing component names or modifier classes
- prefer its guidance for DaisyUI 5 + Tailwind CSS 4 usage patterns
- use it to confirm current component syntax, theme rules, and allowed class combinations

Use repository UI docs together with DaisyUI docs:

- `docs/frontend-workflow.md`
- `docs/frontend.md`

Use DaisyUI docs for component and framework facts.
Use repo docs for this product's visual language and design decisions.

## Planning Artifact Sync

For non-trivial work, keep planning artifacts aligned with the agreed approach and the implemented reality.

When requirements, architecture decisions, sequencing, or implementation reality change:

- update the affected planning documents once the divergence is clear
- do not leave `*-context.md`, `*-design.md`, or `*-tasks.md` stale if later work depends on them
- update only the documents affected by the change
- if implementation diverges from prior design, record the new decision and rationale
- prefer small targeted edits over full rewrites
- do not create missing planning artifacts unless the active workflow or skill explicitly requires them

Document roles:

- `<task-name>.md`: agreed requirements and scope
- `<task-name>-context.md`: current-state findings and evidence
- `<task-name>-design.md`: intended solution and key decisions
- `<task-name>-tasks.md`: dependency-ordered implementation plan

Source of truth priority:

1. explicit user decisions in chat
2. actual code and implementation reality
3. `specs/` steering docs
4. design document
5. task breakdown
6. older context notes

Before considering work complete, check whether any related planning document became outdated and refresh it if needed.
