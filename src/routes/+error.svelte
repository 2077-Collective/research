<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
	<h1 class="text-9xl font-bold mb-4 font-powerGroteskBold">{$page.status}</h1>
	<p class="text-xl mb-8 font-mono text-neutral-40">
		{#if $page.status === 404}
			Oops! Looks like this page is on a different chain.
		{:else if $page.status === 403}
			Oops! Looks like you don't have access to this page.
		{:else}
			Oops! Looks like something went wrong.
		{/if}
	</p>
	<a
		href="/"
		class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#0BC8D2] text-neutral-80 hover:bg-[#0BC8D2]/90 h-10 px-4 py-2 font-ibm"
	>
		Back to mainnet
	</a>
</div>
