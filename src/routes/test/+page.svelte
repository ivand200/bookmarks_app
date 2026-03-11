<script>
  export let data;
</script>

<h1>Test</h1>
{#if data.user}
  <ul>
    {#each Object.entries(data.user) as [key, value]}
      <li>{key}: {value}</li>
    {/each}
  </ul>
{:else}
  <p>Not authenticated</p>
{/if}
