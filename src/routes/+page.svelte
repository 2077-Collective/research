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

<div class="">
	<div aria-label="Hero" class="h-[420px] md:h-[714px] relative flex flex-col justify-end hero">
		<div class="hero-content pb-28">
			<div class="container">
				<h1
					class="!font-powerGroteskBold text-3xl md:leading-[52px] md:text-5xl font-bold max-w-[737px] mb-6 -tracking-[0.96px]"
				>
					Cutting-edge Ethereum <br />research for enthusiasts, <br /> builders, and decision-makers.
				</h1>
				<p
					class="text-[14px] leading-[18px] md:text-[16px] md:leading-[20px] max-w-[686px] text-neutral-40 font-light tracking-[0.16px]"
				>
					Explore the Ethereum frontier with deep dives into infrastructure, finance, governance,
					applications, and protocols. Cutting-edge research, high signal, actionable insights, zero
					fluff.
				</p>
			</div>
		</div>
	</div>

	{#if articles[0]}
		<h2 class="text-2xl md:text-[32px] font-powerGroteskBold my-8 container font-bold">
			Featured Article
		</h2>
		<div class="container">
			<ArticleSpotlight article={articles[0]} />
		</div>
	{/if}

	<div class="my-16 container">
		<RecentCategoryArticles maxCategories={6} articlesPerCategory={1} />
	</div>

	<div class="flex justify-center py-4 md:py-10 relative">
		<div
			class="h-px bg-[#2F2F2F] w-full absolute top-1/2 -translate-y-1/2 pointer-events-none"
		></div>

		<div class="bg-[#0C0C0D] px-5 z-50 relative">
			<a
				href="/reports"
				class="flex items-center gap-3 px-4 py-2 text-2xl transition-colors duration-300 group text-[12.667px] h-10 bg-[#19191A] rounded-[3.167px] text-[#B4B4B4] group"
				aria-label="View all research articles"
			>
				View all articles

				<ArrowRight
					class="size-5 rounded-full group-hover:translate-x-[2px] transition"
					style="stroke-width: 1.4"
				/>
			</a>
		</div>
	</div>

	<div class="container">
		<Testimonials />
	</div>
</div>
