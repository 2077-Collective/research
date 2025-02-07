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

<div class="px-3 md:px-12">
	<div
		aria-label="Hero"
		class="h-[420px] md:h-[714px] relative border-b flex flex-col justify-end bg-gradient-to-b from-gray-100 to-transparent dark:from-secondary dark:to-transparent"
	>
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
