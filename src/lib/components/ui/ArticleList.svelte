<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { ArticleMetadata } from '$lib/types/article';

	import { formatCategorySlug } from '$lib/utils/format';
	import { cn } from '$lib/utils/ui-components';
	import { ArrowDown } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { slide } from 'svelte/transition';
	import ArticleCard from './ArticleCard.svelte';
	import FeaturedCard from './FeaturedCard.svelte';
	import Grid from './icons/Grid.svelte';
	import List from './icons/List.svelte';
	let newArticleRef: HTMLElement | null = null;

	const ARTICLES_PER_PAGE = 9;

	const {
		articles,
		articleCategories = [],
		articlesPerPage = ARTICLES_PER_PAGE,
		displayLoadMore = true,
		title = 'Featured Research',
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
					? article.categories.some((category: any) => category.name === selectedCategory)
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
		goto(`/category/${formatCategorySlug(category)}`);
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

	const firstArticle = $derived(filteredArticles[0]);

	let viewStyle = $state<'GRID' | 'LIST'>('GRID');
</script>

<div>
	<section class="pt-32 bg-[#0C0C0D] relative overflow-hidden pb-40">
		<div class="container relative z-20">
			<!-- <div class="flex items-center gap-3 mb-4 md:mb-9">
				<a
					href="/"
					aria-label="Back to Home"
					class="flex gap-2 justify-center items-center px-2 size-[42px] rounded-full bg-[#19191A] group"
					data-sveltekit-preload-data
				>
					<ArrowLeft class="size-6 group-hover:-translate-x-px transition will-change-transform" />
				</a>
			</div> -->

			<div>
				<h2
					id="latest-research"
					class="text-3xl md:text-[40px] font-bold md:leading-9 font-powerGroteskBold"
				>
					{title}
				</h2>

				<!-- <p class="max-w-[485px] text-sm font-hubot mt-3">
					The news around making Ethereum faster, cheaper, and more efficient with Layer 2s,
					rollups, and sharding—paving the way for mass adoption.
				</p> -->
			</div>
		</div>

		<img
			class="absolute top-0 pointer-events-none opacity-10 w-full"
			src="/category-header-bg.png"
			alt="Header mesh"
		/>
	</section>

	<section class="bg-[#010102] pb-[98px]">
		<div class="container relative -mt-28">
			{#if firstArticle}
				<FeaturedCard article={firstArticle} hideCategory />
			{/if}
		</div>
	</section>

	<section class="py-14 bg-[#0C0C0D]">
		<div class="container flex items-center justify-between mb-10">
			<h3 class="text-3xl md:text-[40px] font-bold md:leading-9 font-powerGroteskBold">{''}</h3>

			<div class="max-md:hidden flex items-center gap-2">
				<button
					class={cn(
						'md:bg-[#19191A] h-10 flex items-center justify-center gap-1 text-sm p-1.5 md:p-2.5 rounded-[8px] transition',
						viewStyle === 'GRID' && 'opacity-50'
					)}
					aria-label="Switch to list view"
					onclick={() => (viewStyle = 'LIST')}
				>
					<List />

					<span class="max-md:hidden">List View</span>
				</button>

				<button
					class={cn(
						'md:bg-[#19191A] h-10 flex items-center justify-center gap-1 text-sm p-1.5 md:p-2.5 rounded-[8px] transition',
						viewStyle === 'LIST' && 'opacity-50'
					)}
					aria-label="Switch to list view"
					onclick={() => (viewStyle = 'GRID')}
				>
					<Grid />

					<span class="max-md:hidden">Grid View</span>
				</button>
			</div>
		</div>

		<div
			class={cn(
				'container',
				viewStyle === 'GRID' &&
					'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 md:gap-y-[67px] gap-x-6 justify-center',
				viewStyle === 'LIST' && 'divide-y divide-[#1F1F1F]'
			)}
		>
			{#each filteredArticles.slice(1, visibleArticles) as article, index}
				<div transition:slide={{ delay: 100 * (index % articlesPerPage) }}>
					<ArticleCard
						{viewStyle}
						{article}
						onBadgeClick={(category) => handleCategoryClick(category)}
						hideInfo={false}
						hideSummary={false}
						hideCategory={disableCategory}
					/>
				</div>
			{/each}

			{#if loading}
				{#each Array(articlesPerPage) as _}
					{@render cardSkeleton()}
				{/each}
			{/if}
		</div>
	</section>

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
			<div class="h-8 bg-gray-200 w-3/4 rounded-md"></div>
			<div class="h-4 bg-gray-200 w-full rounded-md tracking-normal"></div>
			<div class="h-4 bg-gray-200 w-5/6 rounded-md tracking-normal"></div>
			<div class="h-4 bg-gray-200 w-1/2 rounded-md tracking-normal"></div>
		</div>
	</div>
{/snippet}
