<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { ArticleMetadata } from '$lib/types/article';
	import { slide } from 'svelte/transition';
	import Badge from './badge/badge.svelte';

	interface $$Props {
		article: ArticleMetadata;
		onBadgeClick?: (category: string) => void;
		hideCategory?: boolean;
	}

	const { article, onBadgeClick, hideCategory = false }: $$Props = $props();

	const currentPageCategory = $derived(
		$page.url.pathname.match(/\/category\/([^/]+)/)?.[1] ?? null
	);

	const displayCategory = $derived.by(() => {
		if (!article.categories.length) return null;

		if (currentPageCategory) {
			const matchingCategory = article.categories.find(
				(cat) => cat.name.toLowerCase() === decodeURIComponent(currentPageCategory).toLowerCase()
			);
			if (matchingCategory) return matchingCategory;
		}

		return article.categories.find((cat) => cat.is_primary) || article.categories[0];
	});

	const isOnCategoryPage = $derived($page.url.pathname.includes('/category/'));

	const handleCategoryClick = (categoryName: string, e: MouseEvent) => {
		if (!isOnCategoryPage) {
			e.stopPropagation();
			e.preventDefault();
			if (onBadgeClick) {
				onBadgeClick(categoryName);
			} else {
				goto(`/category/${categoryName.toLowerCase()}`);
			}
		}
	};
</script>

<a href={`/${article.slug}`} class="block group">
	<div
		transition:slide={{ duration: 300 }}
		class="flex flex-col h-fit rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
		style={`background-color: ${article.isSponsored ? article.sponsorColor : 'transparent'}; color: ${article.isSponsored ? article.sponsorTextColor : 'inherit'};`}
	>
		<div class="flex flex-col w-full overflow-hidden">
			<img
				src={article.thumb}
				alt=""
				class="aspect-[1/0.5] w-full object-cover rounded-t-lg group-hover:scale-105 transition will-change-transform"
			/>
		</div>

		<div class="flex flex-col p-3 w-full">
			<div class="flex gap-1 items-start w-full text-xs tracking-wide">
				{#if displayCategory && !hideCategory}
					<Badge
						variant="rectangularFilled"
						{...article.isSponsored ? { style: article.sponsorTextColor } : undefined}
						onclick={(e: MouseEvent) => {
							if (!isOnCategoryPage) {
								handleCategoryClick(displayCategory.name, e);
							}
						}}
						class={isOnCategoryPage ? 'cursor-default' : 'cursor-pointer'}
					>
						{displayCategory.name}
					</Badge>
				{/if}
			</div>
			<p
				class="font-powerGroteskBold mt-2 text-lg font-bold text-neutral-20 leading-tight tracking-tight line-clamp-2"
			>
				{article.title}
			</p>
			<p class="mt-1 text-xs text-neutral-40 font-mono tracking-normal">
				By {article.authors?.map((author) => author.full_name || author.username).join(', ')}
			</p>
		</div>
	</div>
</a>
