<script lang="ts">
	import Footer from '$lib/components/ui/Footer.svelte';
	import JoinSection from '$lib/components/ui/JoinSection.svelte';
	import Nav from '$lib/components/ui/Nav.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import SubscribeSection from '$lib/components/ui/SubscribeSection.svelte';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import '../app.css';

	injectAnalytics();

	const { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/svg" href="/favicon.svg" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
	<meta name="msapplication-TileColor" content="#da532c" />
	<meta name="theme-color" content="#ffffff" />
</svelte:head>

<div>
	<Nav />
	<div class="transition-colors duration-300">
		{@render children()}
	</div>
	<div class="flex flex-col grow items-center">
		<SubscribeSection />
		<JoinSection />
		<Footer />
		<Toaster richColors position="top-center" />
	</div>
</div>

<style>
	:global(html) {
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}
</style>
