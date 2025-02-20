<script lang="ts">
	import Beehiiv from '$lib/components/ui/Beehiiv.svelte';
	import Footer from '$lib/components/ui/Footer.svelte';
	import JoinSection from '$lib/components/ui/JoinSection.svelte';
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
	<div class="transition-colors duration-300">
		{@render children()}
	</div>
	<div class="flex flex-col grow items-center">
		<!-- <SubscribeSection /> -->
		<Beehiiv />
		<JoinSection />
		<Footer />
		<Toaster />

		{#if showButton}
			<button
				class="flex items-center justify-center gap-1 md:px-4 md:py-2 text-2xl transition group text-[12.667px] size-11 bg-[#19191A] rounded-[43px] text-[#B4B4B4] group fixed bottom-8 md:bottom-11 right-3 md:right-11 font-semibold border border-[#333] z-[999999] hover:bg-white hover:text-black hover:border-white hover:shadow-hover"
				aria-label="Scroll back to the top of the page"
				onclick={handleScrollToTop}
			>
				<ArrowUp
					class="size-4 rounded-full group-hover:-translate-y-[2px] will-change-transform transition group-hover:text-black flex-shrink-0"
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
