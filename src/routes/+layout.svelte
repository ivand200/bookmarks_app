<script lang="ts">
	import { browser } from "$app/environment";
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";

	const THEME_STORAGE_KEY = "bookmark-theme";

	let { children } = $props();

	function getPreferredTheme() {
		if (!browser) {
			return "light";
		}

		const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

		if (savedTheme === "light" || savedTheme === "dark") {
			return savedTheme;
		}

		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	}

	if (browser) {
		const theme = getPreferredTheme();
		document.documentElement.setAttribute("data-theme", theme);
		document.documentElement.style.colorScheme = theme;
		localStorage.setItem(THEME_STORAGE_KEY, theme);
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
