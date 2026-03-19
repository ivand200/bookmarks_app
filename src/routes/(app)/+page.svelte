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

	function getInitials() {
		const source = data.user?.email ?? data.user?.name ?? data.user?.sub ?? "B";
		const segments = source.split(/[\s@._-]+/).filter(Boolean);

		return segments
			.slice(0, 2)
			.map((segment) => segment[0]?.toUpperCase() ?? "")
			.join("") || "B";
	}

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

	const createBookmarkState = $derived(form?.createBookmark ?? null);
	const deleteBookmarkState = $derived(form?.deleteBookmark ?? null);
	const bookmarkCount = $derived(data.bookmarks.length);
	const createBookmarkUrlValue = $derived(getCreateBookmarkUrlValue());
	const createBookmarkUrlError = $derived(getCreateBookmarkUrlError());
	const createBookmarkSucceeded = $derived(
		createBookmarkState?.success === true,
	);
	const deleteBookmarkSucceeded = $derived(
		deleteBookmarkState?.success === true,
	);

	function getHostname(url: string) {
		try {
			return new URL(url).hostname.replace(/^www\./, "");
		} catch {
			return url;
		}
	}

	function getCreatedLabel(bookmark: Bookmark) {
		return new Intl.DateTimeFormat("en", {
			dateStyle: "medium",
		}).format(new Date(bookmark.createdAt));
	}
</script>

<svelte:head>
	<title>Bookmarks</title>
</svelte:head>

<main class="relative min-h-screen overflow-hidden bg-base-200">
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div class="absolute left-[-10rem] top-[-8rem] h-72 w-72 rounded-full bg-primary/18 blur-3xl"></div>
		<div class="absolute right-[-8rem] top-24 h-64 w-64 rounded-full bg-secondary/18 blur-3xl"></div>
		<div class="absolute bottom-[-10rem] left-1/3 h-72 w-72 rounded-full bg-accent/12 blur-3xl"></div>
	</div>

	<div class="archive-shell relative mx-auto flex min-h-screen flex-col px-4 py-6 sm:px-6 lg:px-8">
		<header class="archive-soft-surface navbar relative z-20 rounded-[2rem] px-5 md:px-7">
			<div class="navbar-start gap-4">
				<div class="flex items-center gap-3">
					<div class="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-content shadow-lg shadow-primary/20 ring-1 ring-base-100/40">
						<span class="text-lg font-semibold">BM</span>
					</div>

					<div>
						<p class="archive-kicker">Bookmark MVP</p>
						<h1 class="text-xl font-semibold text-base-content">Personal archive</h1>
					</div>
				</div>
			</div>

			<div class="navbar-end gap-2">
				<button
					type="button"
					class="btn btn-ghost rounded-full border border-base-300/70 bg-base-100/70 px-3 text-sm shadow-sm shadow-base-content/5"
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
					<span aria-hidden="true" class="text-lg">{isDarkTheme ? "Moon" : "Sun"}</span>
					<span class="hidden text-sm sm:inline">{isDarkTheme ? "Dark" : "Light"}</span>
				</button>

				<div class="dropdown dropdown-end">
					<button
						type="button"
						tabindex="0"
						class="btn btn-ghost h-auto rounded-full border border-base-300/70 bg-base-100/70 px-2 py-1 shadow-sm shadow-base-content/5"
						aria-label="Open account menu"
					>
						<div class="avatar avatar-placeholder">
							<div class="w-11 rounded-full bg-neutral text-neutral-content">
								<span class="text-sm font-semibold">{getInitials()}</span>
							</div>
						</div>
					</button>

					<div class="dropdown-content z-30 mt-3 w-72 rounded-3xl border border-base-300/80 bg-base-100 p-2 shadow-xl shadow-base-content/10">
						<div class="rounded-[1.5rem] bg-base-200/80 px-4 py-3">
							<p class="archive-kicker">Signed in</p>
							<p class="mt-2 break-all text-sm font-medium text-base-content">
								{data.user?.email ?? data.user?.sub}
							</p>
						</div>

						<form method="POST" action="?/signOut" class="mt-2">
							<button type="submit" class="btn btn-ghost btn-block justify-start rounded-2xl">
								Logout
							</button>
						</form>
					</div>
				</div>
			</div>
		</header>

		<section class="flex-1 py-6">
			<div class="archive-surface rounded-[2.2rem] p-5 sm:p-6 lg:p-8">
				<div class="border-b border-base-300/70 pb-6">
					<div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
						<div class="space-y-3">
							<p class="archive-kicker">Collection</p>
							<div class="flex flex-wrap items-center gap-3">
								<h2 class="text-3xl font-semibold tracking-[-0.02em] text-base-content sm:text-4xl">
									Saved links
								</h2>
								<div class="archive-chip">
									{bookmarkCount} total
								</div>
							</div>
							<p class="max-w-3xl text-sm leading-7 text-base-content/70 sm:text-base">
								Save a link fast, keep it tied to your account, and manage everything from one clean collection workspace.
							</p>
						</div>

						<div class="badge badge-outline rounded-full border-base-300/70 bg-base-100/70 px-3 py-3 text-base-content/70">
							URL only
						</div>
					</div>

					<form
						id="bookmark-form"
						method="POST"
						action="?/createBookmark"
						use:enhance
						class="mt-6 space-y-3"
					>
						<div class="flex flex-col gap-3 lg:flex-row lg:items-start">
							<label class="form-control flex-1">
								<div class="label pb-2">
									<span class="label-text text-sm font-medium text-base-content">URL</span>
								</div>
								<input
									type="url"
									name="url"
									placeholder="https://example.com/article"
									value={createBookmarkUrlValue}
									class={`input input-lg w-full rounded-2xl border-base-300 bg-base-100 ${
										createBookmarkUrlError ? "input-error" : ""
									}`}
									aria-invalid={createBookmarkUrlError ? "true" : "false"}
									aria-describedby={createBookmarkUrlError ? "bookmark-url-error" : undefined}
									required
								/>
								{#if createBookmarkUrlError}
									<div class="label pt-2">
										<span id="bookmark-url-error" class="label-text-alt text-error">
											{createBookmarkUrlError}
										</span>
									</div>
								{/if}
							</label>

							<div class="pt-0 lg:pt-9">
								<button
									type="submit"
									class="btn btn-primary btn-lg w-full rounded-[1.2rem] px-8 shadow-lg shadow-primary/15 sm:w-auto lg:min-w-32"
								>
									Add
								</button>
							</div>
						</div>

						{#if createBookmarkState?.message}
							<div
								class={`alert rounded-2xl text-sm ${
									createBookmarkSucceeded ? "alert-success" : "alert-error"
								}`}
							>
								<span>{createBookmarkState.message}</span>
							</div>
						{/if}
					</form>
				</div>

				<div class="pt-6">
					{#if deleteBookmarkState?.message}
						<div
							class={`mb-4 alert rounded-2xl text-sm ${
								deleteBookmarkSucceeded ? "alert-success" : "alert-error"
							}`}
						>
							<span>{deleteBookmarkState.message}</span>
						</div>
					{/if}

					{#if data.bookmarks.length === 0}
						<div class="grid min-h-[24rem] place-items-center rounded-[1.8rem] border border-dashed border-base-300 bg-base-200/55 p-8 text-center">
							<div class="max-w-sm space-y-4">
								<div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-primary/12 text-primary">
									<span class="text-2xl">+</span>
								</div>
								<div>
									<h3 class="text-2xl font-semibold text-base-content">No bookmarks yet</h3>
									<p class="mt-2 leading-7 text-base-content/70">
										Add your first link above to start building a private reference shelf you can actually find later.
									</p>
								</div>
								<a href="#bookmark-form" class="btn btn-primary rounded-2xl px-8">Add bookmark</a>
							</div>
						</div>
					{:else}
						<div class="hidden overflow-hidden rounded-[1.8rem] border border-base-300 lg:block">
							<div class="overflow-x-auto">
								<table class="archive-table table table-zebra">
									<thead>
										<tr class="text-xs uppercase tracking-[0.24em] text-base-content/45">
											<th class="pl-6">URL</th>
											<th class="w-36 pr-6 text-right">Delete</th>
										</tr>
									</thead>
									<tbody>
										{#each data.bookmarks as bookmark (bookmark.id)}
											<tr>
												<td class="pl-6">
													<div class="space-y-2 py-2">
														<a
															href={bookmark.url}
															target="_blank"
															rel="noreferrer"
															class="link link-hover break-all text-base font-medium text-base-content"
														>
															{bookmark.url}
														</a>
														<div class="flex flex-wrap items-center gap-2 text-xs text-base-content/55">
															<span class="badge badge-ghost rounded-full border border-base-300/60 bg-base-100/60">
																{getHostname(bookmark.url)}
															</span>
															<span>Saved {getCreatedLabel(bookmark)}</span>
														</div>
													</div>
												</td>
												<td class="pr-6 text-right">
													<form method="POST" action="?/deleteBookmark" use:enhance>
														<input type="hidden" name="bookmarkId" value={bookmark.id} />
														<button type="submit" class="btn btn-error btn-soft rounded-2xl">
															Delete
														</button>
													</form>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>

						<div class="space-y-3 lg:hidden">
							{#each data.bookmarks as bookmark (bookmark.id)}
								<article class="rounded-[1.6rem] border border-base-300 bg-base-200/60 p-4 shadow-sm">
									<div class="space-y-4">
										<div class="space-y-3">
											<a
												href={bookmark.url}
												target="_blank"
												rel="noreferrer"
												class="link link-hover block break-all text-base font-medium text-base-content"
											>
												{bookmark.url}
											</a>

											<div class="flex flex-wrap items-center gap-2 text-xs text-base-content/55">
												<span class="badge badge-ghost rounded-full border border-base-300/60 bg-base-100/60">
													{getHostname(bookmark.url)}
												</span>
												<span>Saved {getCreatedLabel(bookmark)}</span>
											</div>
										</div>

										<form method="POST" action="?/deleteBookmark" use:enhance class="w-full">
											<input type="hidden" name="bookmarkId" value={bookmark.id} />
											<button type="submit" class="btn btn-error btn-soft btn-block rounded-2xl">
												Delete
											</button>
										</form>
									</div>
								</article>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</section>
	</div>
</main>
