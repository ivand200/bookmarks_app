# Product Spec

## Purpose
- Provide a personal bookmark manager where signed-in users can save, organize, and manage links in one protected workspace.

## Users / Actors
- Signed-in end users who maintain their own bookmark collection.
- Logto as the identity provider that authenticates users into the app.
- Supabase Postgres as the backing store for bookmark records.

## Core Workflows
- Unauthenticated visitors are routed to `/login` and begin sign-in through Logto.
- Authenticated users enter the protected app area and view only the bookmarks tied to their account.
- Users add a bookmark from a URL-only form and remove existing bookmarks from the same workspace.
- The near-term product direction includes lightweight bookmark organization through tags and likely folder-style collections.

## Scope Boundaries
- The current product scope is a personal bookmark MVP, not a shared or collaborative system.
- The visible bookmark workflow is intentionally limited to `URL + Add`, even though the data model already has `title` and `description` fields for future expansion.
- The app still focuses on managing saved links after sign-in, but bookmark organization workflows are now part of the near-term roadmap.
- Category-style navigation is now a valid product direction when it reflects real bookmark organization, especially folders or curated top-level collections.
- Tags and folders are not interchangeable: folders should be treated as stronger navigation candidates, while tags should remain lightweight metadata and filtering tools unless a later product decision says otherwise.

## Durable Constraints
- Protected app routes must require authentication before rendering bookmark data.
- Bookmark ownership is enforced per authenticated user, so users only operate on their own records.
- Bookmark creation accepts only `http` and `https` URLs.
- The product should preserve the calm, private "quiet archive" tone documented in the frontend guidance.
- If the UI introduces organization, it should still preserve one dominant bookmark workspace rather than turning the app into a dashboard of competing panels.
