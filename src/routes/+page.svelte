<script>
  let { data } = $props();
</script>

<h1>Welcome to SvelteKit</h1>

<form method="POST" action="?/{data.user ? 'signOut' : 'signIn'}">
  <button type="submit">Sign {data.user ? "out" : "in"}</button>
</form>
