<script lang="ts">
	import BaseHead from '$lib/components/server/BaseHead.svelte';
	import FeaturedArcticles from '$lib/components/ui/FeaturedArcticles.svelte';
	import PopularReads from '$lib/components/ui/PopularReads.svelte';
	import RecentCategoryArticles from '$lib/components/ui/RecentCategoryArticles.svelte';
	import Testimonials from '$lib/components/ui/Testimonials.svelte';
	import { setArticles } from '$lib/stores/articles.svelte';
	import { ArrowRight } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
	const articles = $derived(data.articles);

	const featuredArticles = $derived(articles.slice(0, 5));

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

				<p
					class="text-[14px] leading-[18px] md:text-[18px] md:leading-[24px] mb-[18px] text-neutral-5 max-w-[599px]"
				>
					Navigate Ethereum’s evolving landscape confidently with in-depth research and insights on
					core infrastructure and blockchain protocols. Understand the latest trends in Layer 1 and
					Layer 2 R&D, DeFi, DePIN, interoperability, privacy, developer tooling, and more, with
					research that cuts through the noise.
				</p>

				<p
					class="text-[14px] leading-[18px] md:text-[18px] md:leading-[24px] text-neutral-5 max-w-[599px]"
				>
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

	<section class="container max-md:mt-14 max-md:mb-36 my-[90px]">
		{#if featuredArticles}
			<FeaturedArcticles articles={featuredArticles} />
		{/if}
	</section>

	<section class="my-16 container">
		<RecentCategoryArticles maxCategories={6} articlesPerCategory={1} />
	</section>

	<div class="flex justify-center relative md:my-20 max-md:mb-10">
		<div class="z-10 px-5 bg-background">
			<a
				href="/reports"
				class="flex items-center justify-center gap-3 px-4 py-2 transition-colors duration-300 group text-sm h-[38px] bg-[#19191A] rounded-[3.17px] font-semibold text-[#B4B4B4]"
				aria-label="View all research articles"
			>
				View all articles

				<ArrowRight
					class="rounded-full group-hover:translate-x-1 transition will-change-transform size-5"
				/>
			</a>
		</div>

		<div
			class="absolute w-full h-px bg-[#2F2F2F] top-1/2 -translate-y-1/2 pointer-events-none"
		></div>
	</div>

	<section class="max-md:mt-14">
		{#if featuredArticles}
			<PopularReads articles={featuredArticles} />
		{/if}
	</section>

	<Testimonials />
</div>
