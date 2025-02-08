<script lang="ts">
	import BaseHead from '$lib/components/server/BaseHead.svelte';
	import ArticleSpotlight from '$lib/components/ui/ArticleSpotlight.svelte';
	import RecentCategoryArticles from '$lib/components/ui/RecentCategoryArticles.svelte';
	import Testimonials from '$lib/components/ui/Testimonials.svelte';
	import { setArticles } from '$lib/stores/articles.svelte';
	import { ArrowRight } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
	const articles = $derived(data.articles);

	onMount(() => {
		setArticles(data.articles);
	});
</script>

<BaseHead />

<div>
	<div aria-label="Hero" class="relative hero">
		<div class="flex items-end justify-between max-lg:flex-wrap-reverse container relative">
			<div class="z-10">
				<h1
					class="font-powerGroteskBold text-3xl md:leading-[69px] md:text-6xl font-bold mb-3 -tracking-[0.96px]"
				>
					Cutting-edge Ethereum research for enthusiasts, builders, and decision-makers.
				</h1>

				<p class="text-[14px] leading-[18px] md:text-[18px] md:leading-[24px] mb-[18px]">
					Navigate Ethereum’s evolving landscape confidently with in-depth research and insights on
					core infrastructure and blockchain protocols. Understand the latest trends in Layer 1 and
					Layer 2 R&D, DeFi, DePIN, interoperability, privacy, developer tooling, and more, with
					research that cuts through the noise.
				</p>

				<p class="text-[14px] leading-[18px] md:text-[18px] md:leading-[24px]">
					Ready to get <span class="text-[#0BC8D2]">nerdsniped</span> and
					<span class="text-[#0BC8D2]">Ethereum-pilled</span>? Dive into our extensive library of
					Ethereum-focused articles and reports.
				</p>

				<button
					class="h-[46px] py-3 px-4 inline-flex items-center justify-center gap-2 bg-[#19191A] mt-8 rounded-[3.88px] font-semibold text-[#B4B4B4] text-[15px] group"
					aria-label="Read Research"
					>Read Research
					<ArrowRight class="group-hover:translate-x-1 transition will-change-transform" />
				</button>
			</div>

			<img
				src="/HAND_ELEMENT.png"
				class="mix-blend-screen pointer-events-none select-none"
				alt="hand-element"
				width="689px"
				height="608px"
			/>
		</div>

		<div class="absolute bottom-0 h-[40%] w-full pointer-events-none hero-mask"></div>
	</div>

	{#if articles[0]}
		<h2 class="text-2xl md:text-5xl font-powerGroteskBold my-8">Featured</h2>
		<ArticleSpotlight article={articles[0]} />
	{/if}

	<div class="my-16">
		<RecentCategoryArticles maxCategories={6} articlesPerCategory={1} />
	</div>

	<div class="flex justify-center py-4 md:py-10">
		<a
			href="/reports"
			class="flex items-center gap-3 px-4 py-2 text-2xl transition-colors duration-300 group"
			aria-label="View all research articles"
		>
			See all research
			<div
				class="border rounded-full p-2 h-10 w-10 flex items-center justify-center group-hover:bg-primary group-hover:text-accent group-hover:translate-y-1 transition-transform duration-300"
			>
				<ArrowRight class="h-10 w-10 rounded-full" style="stroke-width: 1.4" />
			</div>
		</a>
	</div>

	<Testimonials />
</div>
