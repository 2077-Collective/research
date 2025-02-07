<script lang="ts">
	import Beehiiv from '$lib/components/ui/Beehiiv.svelte';
	import Footer from '$lib/components/ui/Footer.svelte';
	import Nav from '$lib/components/ui/Nav.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { ArrowUp } from 'lucide-svelte';
	import '../app.css';

	injectAnalytics();

	let showButton = $state(false);

	function scrollContainer() {
		return document.documentElement || document.body;
	}

	function handleScroll() {
		showButton = scrollContainer().scrollTop > 600;
	}

	function handleScrollToTop() {
		document.body.scrollIntoView({ behavior: 'smooth' });
	}

	const { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/svg" href="/favicon.svg" />
</svelte:head>

<svelte:window on:scroll={handleScroll} />

<div>
	<Nav />
	<div class="transition-colors duration-300 max-w-screen-2xl mx-auto">
		{@render children()}
	</div>
	<div
		class="flex flex-col grow items-center px-3 md:px-12 py-4 md:py-6 mt-8 max-w-screen-2xl mx-auto"
	>
		<Beehiiv variant="home" />
		<Footer />
		<Toaster />

		{#if showButton}
			<button
				class="flex items-center gap-1 px-4 py-2 text-2xl transition-colors duration-300 group text-[12.667px] h-10 bg-[#19191A] rounded-[43px] text-[#B4B4B4] group fixed bottom-12 md:bottom-11 right-3 md:right-11 font-semibold shadow-2xl border border-[#333] z-[999999]"
				aria-label="Scroll back to the top of the page"
				onclick={handleScrollToTop}
			>
				<span class="max-md:hidden">Back to the Top</span>

				<ArrowUp
					class="size-5 rounded-full group-hover:-translate-y-[2px] transition"
					style="stroke-width: 1.4"
				/>
			</button>
		{/if}
	</div>
</div>

<style>
	:global(html) {
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}
</style>
