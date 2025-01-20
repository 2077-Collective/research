<script lang="ts">
	import ArticleSpotlight from '$lib/components/ui/ArticleSpotlight.svelte';
	import ArticleList from '$lib/components/ui/ArticleList.svelte';
	import type { PageData } from './$types';
	import { setArticles } from '$lib/stores/articles.svelte';
	import { onMount } from 'svelte';
	import Testimonials from '$lib/components/ui/Testimonials.svelte';
	import BaseHead from '$lib/components/server/BaseHead.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight } from 'lucide-svelte';
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

<div class="px-3 md:px-12 flex flex-col gap-10">
	<!-- These heights are arbitrary and never repeated throughout the website, that's why they're not in tailwind config -->
	{#if articles[0]}
		<ArticleSpotlight article={articles[0]} />
	{/if}

	<!-- <ArticleList {articles} {articleCategories} displayLoadMore={false} /> -->
	<div
		class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 md:gap-y-10 gap-x-6 justify-center"
	>
		{#each articleSlugs as slug}
			<ArticleCategory {slug} />
		{/each}
	</div>
	<div class="flex justify-center py-4 md:py-10">
		<a
			href="/list"
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
