# Product Spec

## Purpose
- Provide a private bookmark manager where signed-in users can save, find, and manage links in one protected workspace.

## Users / Actors
- Signed-in end users who maintain their own bookmark collection.
- Logto as the identity provider that authenticates users into the app.
- Supabase Postgres as the backing store for bookmark records.

## Core Workflows
- Unauthenticated visitors are routed to `/login` and begin sign-in through Logto.
- Authenticated users enter the protected app area and view only the bookmarks tied to their account.
- Users add a bookmark from the URL-only form and remove existing bookmarks from the same workspace.
- Users search saved links by URL without leaving the main bookmark workspace.
- Signed-in users can end their session from the protected app shell.

## Core Domain Concepts
- A bookmark is a user-owned saved link with a canonical URL, optional title/description fields, and created/updated timestamps.
- The product centers on one personal workspace per signed-in user rather than multiple shared collections.

## Scope Boundaries
- The current product scope is a personal bookmark MVP, not a shared or collaborative system.
- The visible bookmark workflow is intentionally limited to `URL + Add`, even though the data model already has `title` and `description` fields for future expansion.
- Search is part of the core workflow, but richer organization such as tags, folders, or curated collections is not yet a primary product surface.

## Durable Constraints
- Protected app routes must require authentication before rendering bookmark data.
- Bookmark ownership is enforced per authenticated user, so users only operate on their own records.
- Bookmark creation accepts only `http` and `https` URLs.
- The product should preserve the calm, private "quiet archive" tone documented in the frontend guidance.
- If the UI introduces organization, it should still preserve one dominant bookmark workspace rather than turning the app into a dashboard of competing panels.
