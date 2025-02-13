<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { ArticleMetadata } from '$lib/types/article';
	import { ArrowDown, ArrowLeft } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { slide } from 'svelte/transition';
	import ArticleCard from './ArticleCard.svelte';
	import Search from './Search.svelte';
	let newArticleRef: HTMLElement | null = null;

	const ARTICLES_PER_PAGE = 9;

	const {
		articles,
		articleCategories = [],
		articlesPerPage = ARTICLES_PER_PAGE,
		displayLoadMore = true,
		title = 'Latest Research',
		disableCategory = false
	}: {
		articles: ArticleMetadata[];
		articleCategories?: string[];
		articlesPerPage?: number;
		displayLoadMore?: boolean;
		title?: string;
		disableCategory?: boolean;
	} = $props();
	let search = $state('');
	let selectedCategory = $state('');
	let visibleArticles = $state(articlesPerPage);
	let previousVisibleCount = $state(articlesPerPage);
	let loading = $state(false);

	const filteredArticles = $derived(
		articles
			.filter((article) => {
				const categoryMatch = selectedCategory
					? article.categories.some((category) => category.name === selectedCategory)
					: true;
				return categoryMatch;
			})
			.filter((article) => {
				const titleMatch = article.title.toLowerCase().includes(search.toLowerCase());
				const summaryMatch = article.summary.toLowerCase().includes(search.toLowerCase());
				return titleMatch || summaryMatch;
			})
	);

	async function loadMore() {
		if (loading) return;
		loading = true;
		await tick();

		try {
			previousVisibleCount = visibleArticles;
			visibleArticles += articlesPerPage;
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		visibleArticles = selectedCategory ? Number.MAX_SAFE_INTEGER : articlesPerPage;
	});

	$effect(() => {
		if (filteredArticles.length > previousVisibleCount) {
			newArticleRef = document.getElementById(`article-${previousVisibleCount}`);
		}
	});

	$effect(() => {
		const highlightParam = $page.url.searchParams.get('highlight');
		selectedCategory = highlightParam || '';
	});

	function handleCategoryClick(category: string) {
		goto(`/category/${category.toLowerCase()}`);
	}

	function scrollToLatestResearch() {
		const element = document.getElementById('latest-research');
		if (element) {
			const elementHeight = element.getBoundingClientRect().height;
			const elementPosition = element.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.pageYOffset - (elementHeight + 40);

			window.scrollTo({
				top: offsetPosition,
				behavior: 'smooth'
			});
		}
	}
</script>

<div>
	<div>
		<div class="flex items-center gap-3 mb-4 md:mb-8 mt-6">
			<a
				href="/"
				aria-label="Back to Home"
				class="flex gap-2 justify-center items-center px-2 w-10 h-10 border border-solid rounded-full bg-background/80 hover:bg-background"
			>
				<ArrowLeft class="w-6 h-6" />
			</a>
			<h2
				id="latest-research"
				class="text-3xl md:text-5xl font-medium leading-9 font-powerGroteskBold tracking-tight"
			>
				{title}
			</h2>
		</div>
	</div>

	<div class="flex flex-col justify-end md:flex-row gap-2 border-y py-4 md:py-6 mb-4 md:mb-12">
		<Search />
		<!-- <Input
			class="grow-0 max-md:w-full tracking-normal"
			type="text"
			placeholder="Search"
			bind:value={search}
			variant="small"
		>
			{#snippet icon()}
				<Search class="w-4 h-4" />
			{/snippet}
		</Input> -->
	</div>

	<div
		class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 md:gap-y-10 gap-x-6 justify-center"
	>
		{#each filteredArticles.slice(0, visibleArticles) as article, index}
			<div transition:slide={{ delay: 100 * (index % articlesPerPage) }}>
				<ArticleCard {article} onBadgeClick={(category) => handleCategoryClick(category)} />
			</div>
		{/each}

		{#if loading}
			{#each Array(articlesPerPage) as _}
				{@render cardSkeleton()}
			{/each}
		{/if}
	</div>

	{#if visibleArticles < filteredArticles.length && displayLoadMore}
		<div class="flex justify-center py-4 md:py-10">
			<button
				onclick={loadMore}
				class="flex items-center gap-3 px-4 py-2 text-2xl transition-colors duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={loading}
			>
				Load more
				<div
					class="border rounded-full p-2 h-10 w-10 flex items-center justify-center group-hover:bg-primary group-hover:text-accent group-hover:translate-y-1 transition-transform duration-300"
				>
					<ArrowDown class="h-10 w-10 rounded-full" style="stroke-width: 1.4" />
				</div>
			</button>
		</div>
	{/if}
</div>

{#snippet cardSkeleton()}
	<div class="flex flex-col justify-center h-fit animate-pulse">
		<div class="flex flex-col w-full">
			<div class="aspect-square w-full bg-gray-200 rounded-md"></div>
		</div>
		<div class="flex flex-col py-6 w-full space-y-4">
			<div class="flex gap-1 items-start w-full text-sm tracking-wide">
				<div class="w-16 h-6 bg-gray-200 rounded-md"></div>
				<div class="w-16 h-6 bg-gray-200 rounded-md"></div>
			</div>
			<div class="h-8 bg-gray-200 w-3/4 rounded-md tracking-tight"></div>
			<div class="h-4 bg-gray-200 w-full rounded-md tracking-normal"></div>
			<div class="h-4 bg-gray-200 w-5/6 rounded-md tracking-normal"></div>
			<div class="h-4 bg-gray-200 w-1/2 rounded-md tracking-normal"></div>
		</div>
	</div>
{/snippet}
