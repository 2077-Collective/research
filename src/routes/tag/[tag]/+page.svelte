<script lang="ts">
	import BaseHead from '$lib/components/server/BaseHead.svelte';
	import ArticleList from '$lib/components/ui/ArticleList.svelte';
	import ScrollToTopButton from '$lib/components/ui/ScrollToTopButton.svelte';
	import { setArticles } from '$lib/stores/articles.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	const articles = $derived(data.articles);
	const tag = $derived(data.tag);

	const formattedCategory = $derived(
		tag
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ')
	);

	let currentPage = $state(1);
	const articlesPerPage = 1000;
	const paginatedArticles = $derived(articles.slice(0, currentPage * articlesPerPage));

	let isLoading = $state(false);
	let observer: IntersectionObserver;
	let loadMoreMarker: HTMLElement;

	onMount(() => {
		setArticles(articles);

		observer = new IntersectionObserver(
			(entries) => {
				if (
					entries[0].isIntersecting &&
					!isLoading &&
					currentPage * articlesPerPage < articles.length
				) {
					isLoading = true;
					try {
						currentPage += 1;
					} catch (error) {
						console.error('Failed to load more articles:', error);
					} finally {
						isLoading = false;
					}
				}
			},
			{ threshold: 1.0 }
		);
		if (loadMoreMarker) {
			observer.observe(loadMoreMarker);
		}
		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	});
</script>

<BaseHead />

<div class="">
	<ArticleList
		articles={paginatedArticles}
		{articlesPerPage}
		title={formattedCategory}
		disableCategory={true}
	/>

	<div bind:this={loadMoreMarker} class="h-10">
		{#if isLoading}
			<div class="flex justify-center py-4">
				<span class="text-gray-500">Loading...</span>
			</div>
		{/if}
	</div>

	{#if currentPage * articlesPerPage >= articles.length && articles.length > 0}
		<div class="relative mt-10 mb-[113px]">
			<div class="flex justify-center">
				<span class="text-neutral-5 z-20 relative bg-[#0C0C0D] block px-[35px] text-xs font-mono"
					>No more articles to load :)</span
				>
			</div>

			<div class="w-full h-px bg-[#161616] top-1/2 -translate-y-1/2 absolute"></div>
		</div>
	{/if}
</div>

<ScrollToTopButton />
