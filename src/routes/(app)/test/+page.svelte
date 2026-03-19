<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h1>Test</h1>
{#if data.user}
	<ul>
		{#each Object.entries(data.user) as [key, value] (key)}
			<li>{key}: {value}</li>
		{/each}
	</ul>
{:else}
	<p>Not authenticated</p>
{/if}
