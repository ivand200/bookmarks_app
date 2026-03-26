<script lang="ts">
	import { browser } from "$app/environment";
	import { enhance } from "$app/forms";
	import type { Bookmark } from "$lib/types/bookmark";

	import type { PageProps } from "./$types";

	const THEME_STORAGE_KEY = "bookmark-theme";

	type CreateBookmarkFormState = {
		success?: boolean;
		message?: string;
		values?: {
			url?: string;
		};
		fieldErrors?: {
			url?: string[];
		};
	};

	let { data, form }: PageProps = $props();

	function getInitialTheme() {
		if (!browser) {
			return false;
		}

		const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

		if (savedTheme === "light" || savedTheme === "dark") {
			return savedTheme === "dark";
		}

		return window.matchMedia("(prefers-color-scheme: dark)").matches;
	}

	let isDarkTheme = $state(getInitialTheme());

	function getCreateBookmarkUrlValue() {
		const state = createBookmarkState as CreateBookmarkFormState | null;

		if (state?.values) {
			return state.values.url ?? "";
		}

		return "";
	}

	function getCreateBookmarkUrlError() {
		const state = createBookmarkState as CreateBookmarkFormState | null;

		if (state?.fieldErrors?.url?.[0]) {
			return state.fieldErrors.url[0];
		}

		return null;
	}

	function getAccountLabel() {
		return data.user?.email ?? data.user?.name ?? data.user?.sub ?? "Account";
	}

	function getHostname(url: string) {
		try {
			return new URL(url).hostname.replace(/^www\./, "");
		} catch {
			return url;
		}
	}

	function getReadableUrl(value: string) {
		try {
			const url = new URL(value);
			const hostname = url.hostname.replace(/^www\./, "");
			const pathname = decodeURIComponent(url.pathname).replace(/\/$/, "");
			const search = url.search;
			const readable = `${hostname}${pathname}${search}`;

			return readable || hostname;
		} catch {
			return value.replace(/^https?:\/\//, "");
		}
	}

	function getBookmarkTitle(bookmark: Bookmark) {
		const title = bookmark.title?.trim();

		if (title) {
			return title;
		}

		return getReadableUrl(bookmark.url);
	}

	function getBookmarkSummary(bookmark: Bookmark) {
		const description = bookmark.description?.trim();

		return description && description.length > 0 ? description : null;
	}

	function getBookmarkSource(bookmark: Bookmark) {
		if (bookmark.title?.trim()) {
			return getReadableUrl(bookmark.url);
		}

		return getHostname(bookmark.url);
	}

	function getCreatedLabel(bookmark: Bookmark) {
		return new Intl.DateTimeFormat("en", {
			dateStyle: "medium",
		}).format(new Date(bookmark.createdAt));
	}

	const createBookmarkState = $derived(form?.createBookmark ?? null);
	const deleteBookmarkState = $derived(form?.deleteBookmark ?? null);
	const bookmarkCount = $derived(data.bookmarks.length);
	const hasBookmarks = $derived(data.totalBookmarks > 0);
	const showSearchEmptyState = $derived(
		data.hasActiveSearch && hasBookmarks && bookmarkCount === 0,
	);
	const currentShelfTitle = $derived(data.hasActiveSearch ? "Search" : "All");
	const searchStatusLabel = $derived(
		data.hasActiveSearch
			? `${bookmarkCount} of ${data.totalBookmarks} shown for "${data.searchQuery}".`
			: null,
	);
	const createBookmarkUrlValue = $derived(getCreateBookmarkUrlValue());
	const createBookmarkUrlError = $derived(getCreateBookmarkUrlError());
	const createBookmarkSucceeded = $derived(
		createBookmarkState?.success === true,
	);
	const deleteBookmarkSucceeded = $derived(
		deleteBookmarkState?.success === true,
	);
</script>

<svelte:head>
	<title>The Shelf</title>
</svelte:head>

<main class="shelf-page">
	<header class="shelf-sitebar">
		<div>
			<p class="shelf-kicker">Bookmark archive</p>
			<h1 class="shelf-site-title">The Shelf</h1>
		</div>

		<div class="shelf-site-actions">
			<span class="hidden max-w-56 truncate text-base-content/38 lg:block">
				{getAccountLabel()}
			</span>

			<button
				type="button"
				class="shelf-utility-button"
				aria-label={isDarkTheme ? "Switch to light theme" : "Switch to dark theme"}
				onclick={() => {
					isDarkTheme = !isDarkTheme;

					if (!browser) {
						return;
					}

					const nextTheme = isDarkTheme ? "dark" : "light";
					document.documentElement.setAttribute("data-theme", nextTheme);
					document.documentElement.style.colorScheme = nextTheme;
					localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
				}}
			>
				{isDarkTheme ? "Light" : "Dark"}
			</button>

			<form method="POST" action="?/signOut">
				<button type="submit" class="shelf-utility-button">Logout</button>
			</form>
		</div>
	</header>

	<div class="shelf-frame">
		<aside class="shelf-sidebar" aria-label="Shelf navigation">
			<p class="shelf-nav-label">Shelf</p>

			<a
				href="?"
				class="shelf-sidebar-link"
				aria-current={data.hasActiveSearch ? undefined : "page"}
			>
				All
			</a>

			{#if data.hasActiveSearch}
				<a
					href={`?q=${encodeURIComponent(data.searchQuery)}`}
					class="shelf-sidebar-link"
					aria-current="page"
				>
					Search
				</a>
			{:else}
				<span class="shelf-sidebar-link shelf-sidebar-link-muted">Search</span>
			{/if}

			<a href="#bookmark-form" class="shelf-sidebar-link">Add</a>

			<div class="shelf-sidebar-note">
				<p class="shelf-nav-label">Current mode</p>
				<p class="mt-3 text-base leading-7 text-base-content/76">
					{data.hasActiveSearch ? "Filtered shelf." : "Full shelf."}
				</p>
				<p class="mt-2 text-sm leading-6 text-base-content/46">
					URL-first capture, one quiet workspace, and real data only.
				</p>
			</div>
		</aside>

		<section class="shelf-workspace">
			<div class="shelf-band">
				<div class="shelf-title-row">
					<div>
						<p class="shelf-kicker">Shelf</p>
						<div class="shelf-title-line">
							<h2 class="shelf-title">{currentShelfTitle}</h2>
							<span class="shelf-count">{bookmarkCount}</span>
						</div>
					</div>

					<form method="GET" class="shelf-search-form">
						<label class="shelf-search-field">
							<span class="sr-only">Search bookmarks by URL</span>
							<input
								type="search"
								name="q"
								value={data.searchQuery}
								placeholder="Search saved URLs"
								class="shelf-search-input"
							/>
						</label>

						<div class="shelf-search-actions">
							<button type="submit" class="shelf-quiet-button">Search</button>

							{#if data.hasActiveSearch}
								<a href="?" class="shelf-quiet-button">Clear</a>
							{/if}
						</div>
					</form>
				</div>

				<form
					id="bookmark-form"
					method="POST"
					action="?/createBookmark"
					use:enhance
					class="shelf-add-row"
				>
					<label class="shelf-add-field">
						<span class="sr-only">Bookmark URL</span>
						<input
							type="url"
							name="url"
							placeholder="paste a URL..."
							value={createBookmarkUrlValue}
							class={[
								"shelf-inline-input",
								createBookmarkUrlError && "text-error placeholder:text-error/55",
							]}
							aria-invalid={createBookmarkUrlError ? "true" : "false"}
							aria-describedby={createBookmarkUrlError ? "bookmark-url-error" : undefined}
							autocomplete="url"
							autocapitalize="off"
							spellcheck="false"
							required
						/>
					</label>

					<button type="submit" class="shelf-add-button">Add</button>
				</form>

				<div class="shelf-band-notes">
					{#if searchStatusLabel}
						<p class="shelf-status-line">{searchStatusLabel}</p>
					{/if}

					{#if createBookmarkUrlError}
						<p id="bookmark-url-error" class="shelf-feedback shelf-feedback-error">
							{createBookmarkUrlError}
						</p>
					{/if}

					{#if createBookmarkState?.message}
						<p
							class={`shelf-feedback ${
								createBookmarkSucceeded
									? "shelf-feedback-success"
									: "shelf-feedback-error"
							}`}
						>
							{createBookmarkState.message}
						</p>
					{/if}
				</div>
			</div>

			<div class="shelf-content">
				{#if deleteBookmarkState?.message}
					<p
						class={`mb-5 shelf-feedback ${
							deleteBookmarkSucceeded
								? "shelf-feedback-success"
								: "shelf-feedback-error"
						}`}
					>
						{deleteBookmarkState.message}
					</p>
				{/if}

				{#if data.bookmarks.length === 0}
					<div class="shelf-empty-state">
						<p class="shelf-nav-label">{showSearchEmptyState ? "Search" : "Shelf"}</p>

						<h3 class="mt-4 text-3xl leading-tight text-base-content">
							{#if showSearchEmptyState}
								No matches for "{data.searchQuery}"
							{:else}
								Nothing on the shelf yet
							{/if}
						</h3>

						<p class="mt-3 max-w-xl text-base leading-7 text-base-content/58">
							{#if showSearchEmptyState}
								Try a shorter URL fragment, adjust the query, or clear the filter to return to your full list.
							{:else}
								Paste a link above to start a calm, searchable shelf for the links you want to keep close.
							{/if}
						</p>

						<div class="mt-6 flex flex-col gap-3 sm:flex-row">
							{#if showSearchEmptyState}
								<a href="?" class="shelf-add-button">Clear search</a>
							{/if}

							<a href="#bookmark-form" class="shelf-quiet-button shelf-quiet-button-strong">
								Add bookmark
							</a>
						</div>
					</div>
				{:else}
					<div class="hidden md:block">
						<div class="shelf-rule-list">
							{#each data.bookmarks as bookmark (bookmark.id)}
								<article class="shelf-entry">
									<div class="min-w-0">
										<a
											href={bookmark.url}
											target="_blank"
											rel="noreferrer"
											class="shelf-entry-title"
										>
											{getBookmarkTitle(bookmark)}
										</a>

										{#if getBookmarkSummary(bookmark)}
											<p class="shelf-entry-summary">{getBookmarkSummary(bookmark)}</p>
										{/if}

										<p class="shelf-entry-source">{getBookmarkSource(bookmark)}</p>
									</div>

									<time class="shelf-entry-time">{getCreatedLabel(bookmark)}</time>

									<form method="POST" action="?/deleteBookmark" use:enhance>
										<input type="hidden" name="bookmarkId" value={bookmark.id} />
										<button type="submit" class="shelf-delete-button">Remove</button>
									</form>
								</article>
							{/each}
						</div>
					</div>

					<div class="shelf-mobile-list md:hidden">
						{#each data.bookmarks as bookmark (bookmark.id)}
							<article class="shelf-mobile-entry">
								<div class="flex items-start justify-between gap-4">
									<a
										href={bookmark.url}
										target="_blank"
										rel="noreferrer"
										class="shelf-entry-title"
									>
										{getBookmarkTitle(bookmark)}
									</a>

									<time class="shelf-entry-time shrink-0">{getCreatedLabel(bookmark)}</time>
								</div>

								{#if getBookmarkSummary(bookmark)}
									<p class="shelf-entry-summary">{getBookmarkSummary(bookmark)}</p>
								{/if}

								<p class="shelf-entry-source">{getBookmarkSource(bookmark)}</p>

								<form method="POST" action="?/deleteBookmark" use:enhance class="mt-4">
									<input type="hidden" name="bookmarkId" value={bookmark.id} />
									<button type="submit" class="shelf-delete-button">Remove</button>
								</form>
							</article>
						{/each}
					</div>
				{/if}
			</div>
		</section>
	</div>
</main>
