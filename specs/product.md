# Product Spec

## Purpose
- Provide a minimal personal bookmark manager where signed-in users can save and manage links in one protected workspace.

## Users / Actors
- Signed-in end users who maintain their own bookmark collection.
- Logto as the identity provider that authenticates users into the app.
- Supabase Postgres as the backing store for bookmark records.

## Core Workflows
- Unauthenticated visitors are routed to `/login` and begin sign-in through Logto.
- Authenticated users enter the protected app area and view only the bookmarks tied to their account.
- Users add a bookmark from a URL-only form and remove existing bookmarks from the same workspace.

## Scope Boundaries
- The current product scope is a personal bookmark MVP, not a shared or collaborative system.
- The visible bookmark workflow is intentionally limited to `URL + Add`, even though the data model already has `title` and `description` fields for future expansion.
- The app focuses on managing saved links after sign-in; it does not currently expose broader bookmark organization workflows.

## Durable Constraints
- Protected app routes must require authentication before rendering bookmark data.
- Bookmark ownership is enforced per authenticated user, so users only operate on their own records.
- Bookmark creation accepts only `http` and `https` URLs.
- The product should preserve the calm, private "quiet archive" tone documented in the frontend guidance.
