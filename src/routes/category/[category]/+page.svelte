<script lang="ts">
	import ArticleList from '$lib/components/ui/ArticleList.svelte';
	import type { PageData } from './$types';
	import { setArticles } from '$lib/stores/articles.svelte';
	import { onMount } from 'svelte';
	import BaseHead from '$lib/components/server/BaseHead.svelte';

	const { data }: { data: PageData } = $props();

	const articles = $derived(data.articles);
	const category = $derived(data.category);

	const formattedCategory = $derived(
		category
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ')
	);

	const filteredArticles = $derived(
		articles.filter((article) =>
			article.categories.some((cat) => cat.name.toLowerCase() === formattedCategory.toLowerCase())
		)
	);

	let currentPage = $state(1);
	const articlesPerPage = 30;
	const paginatedArticles = $derived(filteredArticles.slice(0, currentPage * articlesPerPage));

	let isLoading = $state(false);
	let observer: IntersectionObserver;
	let loadMoreMarker: HTMLElement;

	onMount(() => {
		setArticles(filteredArticles);

		observer = new IntersectionObserver(
			(entries) => {
				if (
					entries[0].isIntersecting &&
					!isLoading &&
					currentPage * articlesPerPage < filteredArticles.length
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

<div class="px-3 md:px-12 flex flex-col gap-10">
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

	{#if currentPage * articlesPerPage >= filteredArticles.length && filteredArticles.length > 0}
		<div class="flex justify-center py-4">
			<span class="text-gray-500">No more articles to load.</span>
		</div>
	{/if}
</div>
