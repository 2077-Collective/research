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

	<!-- Images Preload -->
	<link rel="preload" as="image" href="/HAND_ELEMENT.webp" type="image/webp" fetchpriority="high" />

	<!-- Fonts preload -->
	<link
		rel="preload"
		href="/fonts/Menlo-Regular.woff"
		as="font"
		type="font/woff"
		crossorigin="anonymous"
	/>
	<link
		rel="preload"
		href="/fonts/Soehne-Breit-Kraftig.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
	<link
		rel="preload"
		href="/fonts/ABCFavoritVariable-Trial.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
	<link
		rel="preload"
		href="/fonts/Hubot-Sans.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
	<link
		rel="preload"
		href="/fonts/PowerGrotesk-Variable.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
	<link
		rel="preload"
		href="/fonts/KodeMono-Regular.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>

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
