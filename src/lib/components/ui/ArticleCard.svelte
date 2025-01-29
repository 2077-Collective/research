<script lang="ts">
	import type { ArticleMetadata } from '$lib/types/article';
	import { slide } from 'svelte/transition';
	import Badge from './badge/badge.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	const { article }: { article: ArticleMetadata } = $props();

	const currentPageCategory = $derived(
		$page.url.pathname.match(/\/category\/([^/]+)/)?.[1] ?? null
	);

	const displayCategory = $derived(() => {
		// Handle empty categories array
		if (!article.categories.length) return null;

		// If we're on a category page, try to find the matching category
		if (currentPageCategory) {
			const matchingCategory = article.categories.find(
				(cat) => cat.name.toLowerCase() === decodeURIComponent(currentPageCategory).toLowerCase()
			);
			if (matchingCategory) return matchingCategory;
		}

		// Otherwise, return primary category or first available
		return article.categories.find((cat) => cat.is_primary) || article.categories[0];
	});

	const isOnCategoryPage = $derived($page.url.pathname.includes('/category/'));

	const handleCategoryClick = (categoryName: string) => {
		if (!isOnCategoryPage) {
			goto(`/category/${categoryName.toLowerCase()}`);
		}
	};
</script>

<a href={`/${article.slug}`} class="block">
	<div
		transition:slide={{ duration: 300 }}
		class="flex flex-col h-fit rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
		style={`background-color: ${article.isSponsored ? article.sponsorColor : 'transparent'}; color: ${article.isSponsored ? article.sponsorTextColor : 'inherit'};`}
	>
		<div class="flex flex-col w-full">
			<img src={article.thumb} alt="" class="aspect-[4/3] w-full object-cover rounded-t-lg" />
		</div>

		<div class="flex flex-col p-3 w-full">
			<div class="flex gap-1 items-start w-full text-xs tracking-wide">
				{#if displayCategory}
					<Badge
						variant="rectangularFilled"
						{...article.isSponsored ? { style: article.sponsorTextColor } : undefined}
						onclick={(e: MouseEvent) => {
							if (!isOnCategoryPage) {
								e.stopPropagation();
								e.preventDefault();
								handleCategoryClick(displayCategory.name);
							}
						}}
						class={isOnCategoryPage ? 'cursor-default' : 'cursor-pointer'}
					>
						{displayCategory.name}
					</Badge>
				{/if}
			</div>
			<p class="font-soehne mt-2 text-lg font-medium leading-tight tracking-tight line-clamp-2">
				{article.title}
			</p>
			<p class="mt-1 text-xs text-gray-600 dark:text-gray-400 font-medium tracking-normal">
				By {article.authors?.map((author) => author.full_name || author.username).join(', ')}
			</p>
		</div>
	</div>
</a>
