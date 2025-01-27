<script lang="ts">
	import ArticleSpotlight from '$lib/components/ui/ArticleSpotlight.svelte';
	import ArticleList from '$lib/components/ui/ArticleList.svelte';
	import type { PageData } from './$types';
	import { setArticles } from '$lib/stores/articles.svelte';
	import { onMount } from 'svelte';
	import Testimonials from '$lib/components/ui/Testimonials.svelte';
	import BaseHead from '$lib/components/server/BaseHead.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight, Mail } from 'lucide-svelte';
	import ArticleCategory from '$lib/components/ui/ArticleCategory.svelte';

	const { data }: { data: PageData } = $props();
	const articles = $derived(data.articles);
	const articleSlugs = [
		'the-verge-making-ethereum-verifiable-and-sustainable',
		'the-practical-guide-to-ethereum-rollups',
		'wildcat-finance',
		'eip-1559-separating-mechanisms-from-memes',
		'exploring-crypto-data-outsourced-data-types',
		'chain-abstraction-orchestrating-towards-the-new-internets-composability'
	];

	onMount(() => {
		setArticles(data.articles);
	});
</script>

<BaseHead />

<div class="px-3 md:px-12">
	<div
		class="h-[420px] md:h-[714px] relative border-b flex flex-col justify-end bg-gradient-to-b from-gray-100 to-transparent dark:from-secondary dark:to-transparent"
	>
		<!-- leading-[69px] and max-w-[928px] are arbitrary and never repeated throughout the website, that's why it's not in tailwind config -->
		<h1
			class="font-powerGroteskBold text-3xl md:leading-[69px] md:text-6xl font-medium max-w-[928px] mb-6 px-10"
		>
			Cutting-edge Ethereum research for enthusiasts, builders, and decision-makers.
		</h1>
		<p class="text-[14px] leading-[18px] md:text-[16px] md:leading-[20px] max-w-[928px] px-10 mb-6">
			Explore the Ethereum frontier with deep dives into infrastructure, finance, governance,
			applications, and protocols. Cutting-edge research, high signal, actionable insights, zero
			fluff.
		</p>
		<!--
		<img
			src="/hero.webp"
			width="928"
			height="698"
			fetchpriority="high"
			loading="eager"
			decoding="async"
			class="absolute top-0 right-0 w-1/2 animate-float"
			alt="Hero illustration"
		/>
		-->
	</div>

	<!-- These heights are arbitrary and never repeated throughout the website, that's why they're not in tailwind config -->
	{#if articles[0]}
		<h2 class="text-2xl md:text-5xl font-soehne my-8">Featured</h2>
		<ArticleSpotlight article={articles[0]} />
	{/if}

	<!-- <ArticleList {articles} {articleCategories} displayLoadMore={false} /> -->
	<h2 class="text-5xl font-soehne my-8">Most recent</h2>
	<div
		class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 md:gap-y-10 gap-x-6 justify-center"
	>
		{#each articleSlugs as slug}
			<ArticleCategory {slug} />
		{/each}
	</div>
	<div class="flex justify-center py-4 md:py-10">
		<a
			href="/reports"
			class="flex items-center gap-3 px-4 py-2 text-2xl transition-colors duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
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
