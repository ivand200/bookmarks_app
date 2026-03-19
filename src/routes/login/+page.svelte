<svelte:head>
	<title>Login</title>
</svelte:head>

<main class="min-h-screen bg-base-200">
	<section class="mx-auto flex min-h-screen max-w-5xl items-center justify-center p-6">
		<div class="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
			<div class="card border border-base-300 bg-base-100 shadow-xl">
				<div class="card-body gap-6">
					<div class="badge badge-outline badge-lg">Bookmark MVP</div>

					<div class="space-y-3">
						<h1 class="text-4xl font-semibold leading-tight text-base-content">
							Save links in one protected place.
						</h1>
						<p class="max-w-xl text-base text-base-content/70">
							Sign in to access your personal bookmark workspace. Unauthenticated users are redirected here before protected pages render.
						</p>
					</div>

					<div class="grid gap-3 text-sm text-base-content/70 sm:grid-cols-3">
						<div class="rounded-box bg-base-200 p-4">
							<p class="font-medium text-base-content">Protected routes</p>
							<p class="mt-1">The main app area only renders for authenticated users.</p>
						</div>
						<div class="rounded-box bg-base-200 p-4">
							<p class="font-medium text-base-content">Server-side auth</p>
							<p class="mt-1">Logto user state is resolved on the server through `locals`.</p>
						</div>
						<div class="rounded-box bg-base-200 p-4">
							<p class="font-medium text-base-content">Ready for bookmarks</p>
							<p class="mt-1">The app shell is prepared for the next bookmark-focused tasks.</p>
						</div>
					</div>
				</div>
			</div>

			<div class="card bg-base-100 shadow-xl">
				<div class="card-body gap-5">
					<div>
						<h2 class="text-2xl font-semibold text-base-content">Sign in</h2>
						<p class="mt-2 text-sm text-base-content/70">
							Use Logto to continue into the protected bookmarks area.
						</p>
					</div>

					<form method="POST" action="?/signIn" class="space-y-4">
						<button type="submit" class="btn btn-primary btn-block">
							Continue with Logto
						</button>
					</form>
				</div>
			</div>
		</div>
	</section>
</main>
