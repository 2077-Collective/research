<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { ArticleMetadata } from '$lib/types/article';
	import { formatCategorySlug } from '$lib/utils/format';
	import { slide } from 'svelte/transition';
	import Badge from './badge/badge.svelte';

	interface $$Props {
		article: ArticleMetadata;
		onBadgeClick?: (category: string) => void;
	}

	const { article, onBadgeClick }: $$Props = $props();

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

	const thumbnailUrl = $derived(
		typeof article.thumb === 'string'
			? article.thumb
			: article.thumb?.data?.attributes?.url || article.thumb_url || ''
	);

	const handleCategoryClick = (categoryName: string, e: MouseEvent) => {
		if (!isOnCategoryPage) {
			e.stopPropagation();
			e.preventDefault();
			if (onBadgeClick) {
				onBadgeClick(categoryName);
			} else {
				goto(`/category/${formatCategorySlug(categoryName)}`);
			}
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
			<img src={thumbnailUrl} alt="" class="aspect-[4/3] w-full object-cover rounded-t-lg" />
		</div>

		<div class="flex flex-col p-3 w-full">
			<div class="flex gap-1 items-start w-full text-xs tracking-wide">
				{#if displayCategory}
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
				class="font-powerGroteskBold mt-2 text-lg font-medium leading-tight tracking-tight line-clamp-2"
			>
				{article.title}
			</p>
			<p class="mt-1 text-xs text-gray-600 dark:text-gray-400 font-medium tracking-normal">
				By {article.authors?.map((author) => author.full_name || author.username).join(', ')}
			</p>
		</div>
	</div>
</a>
