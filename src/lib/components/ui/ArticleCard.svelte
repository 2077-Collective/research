<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { ArticleMetadata } from '$lib/types/article';
	import { getAuthorsText } from '$lib/utils/authors';
	import { formatCategorySlug } from '$lib/utils/format';
	import { cn } from '$lib/utils/ui-components';
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
				(cat: any) =>
					cat.name.toLowerCase() === decodeURIComponent(currentPageCategory).toLowerCase()
			);
			if (matchingCategory) return matchingCategory;
		}

		return article.categories.find((cat: any) => cat.is_primary) || article.categories[0];
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

	const links = getAuthorsText(article.authors || []);
	const formattedLinks = links === 'Unknown' ? '' : links;
</script>

<a href={`/${article.slug}`} class="block group" data-sveltekit-preload-data>
	<div
		transition:slide={{ duration: 300 }}
		class="flex flex-col h-fit rounded-lg overflow-hidden bg-white dark:bg-gray-800 group"
		style={`background-color: ${article.isSponsored ? article.sponsorColor : 'transparent'}; color: ${article.isSponsored ? article.sponsorTextColor : 'inherit'};`}
	>
		<div class="flex flex-col w-full overflow-hidden">
			<img
				src={thumbnailUrl}
				alt=""
				class="aspect-[1/0.5] w-full object-cover rounded-t-lg group-hover:scale-105 transition will-change-transform"
			/>
		</div>

		<div class="flex flex-col px-3 w-full mt-2">
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
						class={cn('mb-2', isOnCategoryPage ? 'cursor-default' : 'cursor-pointer')}
					>
						{displayCategory.name}
					</Badge>
				{/if}
			</div>
			<p
				class="font-powerGroteskBold text-lg font-bold leading-tight tracking-tight line-clamp-2 text-neutral-20 group-hover:underline underline-offset-[3px]"
			>
				{article.title}
			</p>
			{#if formattedLinks}
				<p class="text-xs font-mono line-clamp-1 mt-1 text-neutral-40">
					By {@html formattedLinks}
				</p>
			{/if}
		</div>
	</div>
</a>
