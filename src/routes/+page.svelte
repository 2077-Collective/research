<script lang="ts">
	import BaseHead from '$lib/components/server/BaseHead.svelte';
	import FeaturedArticles from '$lib/components/ui/FeaturedArticles.svelte';
	import PopularReads from '$lib/components/ui/PopularReads.svelte';
	import RecentCategoryArticles from '$lib/components/ui/RecentCategoryArticles.svelte';
	import Testimonials4 from '$lib/components/ui/Testimonials4.svelte';
	import { setArticles } from '$lib/stores/articles.svelte';
	import { ArrowRight } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
	const articles = $derived(data.articles);
	const recentPosts = $derived(data.recentPosts);

	const FEATURED_COUNT = 5;
	const POPULAR_COUNT = 10;
	const featuredArticles = $derived(articles.slice(0, FEATURED_COUNT));
	const popularReads = $derived(articles.slice(FEATURED_COUNT, FEATURED_COUNT + POPULAR_COUNT));

	onMount(() => {
		setArticles(data.articles);
	});
</script>

<BaseHead />

<div>
	<div aria-label="Hero" class="relative hero">
		<div
			class="flex items-end justify-between max-lg:justify-center max-lg:flex-wrap-reverse container relative"
		>
			<div class="z-10">
				<h1
					class="font-powerGroteskBold text-[30px] leading-9 md:leading-[48px] md:text-[48px] font-bold md:mb-3 mb-4 text-white"
				>
					Cutting-Edge <br class="md:hidden" /> Ethereum <br class="max-md:hidden" /> research for
					<br class="max-md:hidden" />

					enthusiasts, builders, <br class="max-md:hidden" /> and industry leaders
				</h1>

				<p
					class="text-base leading-[18px] md:text-[18px] md:leading-[24px] mb-[18px] text-neutral-5 max-w-[610px] font-hubot tracking-[0.18px]"
				>
					Navigate Ethereum’s evolving landscape <em>confidently</em>
					{' '} with original research and insights that cut through the noise. At 2077 Research, we
					explore the ideas, innovations, and breakthroughs shaping the future of Ethereum and crypto—so
					you can stay ahead in an industry that never stands still
				</p>

				<p
					class="text-base leading-[18px] md:text-[18px] md:leading-[24px] text-neutral-5 max-w-[610px] font-hubot tracking-[0.18px] mb-6 md:mb-8"
				>
					Ready to level up your knowledge? Explore our library of original research reports,
					articles, and reports on the cutting edge of Ethereum tech.
				</p>

				<a href="/reports" data-sveltekit-preload-data>
					<button
						class="h-[46px] py-3 px-4 inline-flex items-center justify-center gap-2 bg-[#19191A] rounded-[3.88px] font-semibold text-[#B4B4B4] text-[15px] group font-ibm tracking-[0.18px] hover:bg-white hover:text-black transition hover:shadow-hover"
						aria-label="Read Research"
						>Read research
						<ArrowRight class="group-hover:translate-x-1 transition will-change-transform size-5" />
					</button></a
				>
			</div>

			<div class="md:min-w-[689px] min-h-[608px]">
				<enhanced:img
					src="/static/HAND_ELEMENT.webp"
					class="mix-blend-screen pointer-events-none select-none"
					alt="hand-element"
					width="689"
					height="608"
					loading="eager"
					fetchpriority="high"
					decoding="async"
				/>
			</div>
		</div>

		<div class="absolute bottom-0 h-[40%] w-full pointer-events-none hero-mask"></div>
	</div>

	<section class="container max-md:mt-14 max-md:mb-36 my-[90px] relative">
		{#if featuredArticles}
			<FeaturedArticles articles={featuredArticles} />
		{/if}
	</section>

	<section class="mt-16 mb-10 md:mb-16 container">
		<RecentCategoryArticles maxCategories={6} articlesPerCategory={1} articles={recentPosts} />
	</section>

	<div class="flex justify-center relative mb-14 max-md:mb-10">
		<div class="z-10 px-5 bg-background">
			<a
				href="/reports"
				class="flex items-center justify-center gap-3 px-4 py-2 group text-sm h-[38px] bg-[#19191A] rounded-[3.17px] font-semibold text-[#B4B4B4] hover:bg-white hover:text-black transition hover:shadow-hover font-ibm"
				aria-label="View all research articles"
				data-sveltekit-preload-data
			>
				View all articles

				<ArrowRight
					class="rounded-full group-hover:translate-x-1 transition will-change-transform size-5"
				/>
			</a>
		</div>
	</div>

	<section class="max-md:mt-14">
		{#if featuredArticles}
			<PopularReads articles={popularReads} />
		{/if}
	</section>

	<Testimonials4 />
</div>
