<script lang="ts">
	import Beehiiv from '$lib/components/ui/Beehiiv.svelte';
	import Footer from '$lib/components/ui/Footer.svelte';
	import Nav from '$lib/components/ui/Nav.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import '../app.css';

	injectAnalytics();

	const { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/svg" href="/favicon.svg" />
</svelte:head>

<div>
	<Nav />
	<div class="transition-colors duration-300 mx-auto">
		{@render children()}
	</div>
	<div class="flex flex-col grow items-center">
		<Beehiiv variant="home" />
		<Footer />
		<Toaster />
	</div>
</div>

<style>
	:global(html) {
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}
</style>
