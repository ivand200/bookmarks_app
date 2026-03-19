# Bookmark MVP

Minimal bookmark manager MVP built with SvelteKit, Logto authentication, DaisyUI, and Supabase Postgres.

## Stack

- SvelteKit 2 + Svelte 5
- TypeScript
- Bun
- Logto for authentication
- Supabase Postgres for persistence
- DaisyUI + Tailwind CSS 4 for UI
- Vitest for unit tests

## MVP behavior

- Unauthenticated users are redirected to `/login`
- Authenticated users can view only their own bookmarks
- The main app page supports list, create, and delete bookmark flows
- Bookmark creation currently accepts only `http` / `https` URLs
- The visible MVP form is intentionally limited to `URL + Add`

## Prerequisites

- Bun installed
- A Logto app configured for this project
- A Supabase project with the `bookmarks` migration applied
- Supabase CLI installed if you want to push migrations from this repo

## Environment setup

1. Copy `.env.example` to `.env`
2. Fill in all required Logto and Supabase values
3. Configure the Logto application redirect URIs for the origin you use locally

For local development with the default Vite port, register:

- sign-in redirect URI: `http://localhost:5173/callback`
- post-logout redirect URI: `http://localhost:5173/login`

If you use a different origin in development or preview, keep the same paths and update the origin accordingly.

## Install dependencies

```sh
bun install
```

## Database workflow

This repo keeps schema changes in `supabase/migrations/`.

If you are working against the linked Supabase project:

```sh
bun run supabase:link
bun run supabase:db:push
```

The current MVP migration creates the `bookmarks` table and its `updated_at` trigger.

## Run the app

```sh
bun run dev
```

Useful commands:

```sh
bun run check
bun run lint
bun run test
bun run test:watch
```

## Tests

The project currently keeps unit tests colocated with the code they verify:

- `src/lib/server/bookmarks/service.test.ts`
- `src/lib/validators/bookmark.test.ts`
- `src/lib/server/auth.test.ts`

These tests focus on business logic and access-control boundaries, not browser or end-to-end flows.

## Project notes

- Bookmark ownership is enforced in server-side application code using `locals.user.sub`
- Supabase access currently uses `SUPABASE_PUBLIC_SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` from the server
- `title` and `description` exist in the model for future use, but are intentionally kept out of the visible MVP form and list
