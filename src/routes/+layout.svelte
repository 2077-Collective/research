<script lang="ts">
	import Footer from '$lib/components/ui/Footer.svelte';
	import JoinSection from '$lib/components/ui/JoinSection.svelte';
	import Nav from '$lib/components/ui/Nav.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import SubscribeSection from '$lib/components/ui/SubscribeSection.svelte';
	import { cn } from '$lib/utils/ui-components';
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
		fetchpriority="high"
	/>
	<link
		rel="preload"
		href="/fonts/Soehne-Breit-Kraftig.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
		fetchpriority="high"
	/>
	<link
		rel="preload"
		href="/fonts/ABCFavoritVariable-Trial.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
		fetchpriority="high"
	/>
	<link
		rel="preload"
		href="/fonts/Hubot-Sans.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
		fetchpriority="high"
	/>
	<link
		rel="preload"
		href="/fonts/PowerGrotesk-Variable.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
		fetchpriority="high"
	/>
	<link
		rel="preload"
		href="/fonts/KodeMono-Regular.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
		fetchpriority="high"
	/>

	<meta name="msapplication-TileColor" content="#da532c" />
	<meta name="theme-color" content="#ffffff" />
</svelte:head>

<svelte:window on:scroll={handleScroll} />

<div>
	<Nav />
	<div class="transition-colors duration-300">
		{@render children()}
	</div>
	<div class="flex flex-col grow items-center">
		<SubscribeSection />
		<!-- <Beehiiv /> -->
		<JoinSection />
		<Footer />
		<Toaster richColors position="top-center" />

		<div class="container flex items-center justify-end">
			<button
				class={cn(
					'flex items-center justify-center gap-1 text-2xl group text-[12.667px] size-10 bg-[#19191A] rounded-full text-[#B4B4B4] group fixed bottom-8 md:bottom-11 font-semibold shadow-2xl hover:shadow-hover hover:bg-white border border-[#333] -z-50 transition opacity-0',
					showButton && 'opacity-100 z-[999999]'
				)}
				aria-label="Scroll back to the top of the page"
				onclick={handleScrollToTop}
			>
				<!-- <span class="max-md:hidden">Back to the Top</span> -->
				<ArrowUp
					class="size-4 rounded-full group-hover:-translate-y-[2px] will-change-transform transition group-hover:text-black flex-shrink-0"
					style="stroke-width: 1.4"
				/>
			</button>
		</div>
	</div>
</div>

<style>
	:global(html) {
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}
</style>
