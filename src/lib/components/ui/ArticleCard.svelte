<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { ArticleMetadata } from '$lib/types/article';
	import { getAuthorsText } from '$lib/utils/authors';
	import { formatCategorySlug } from '$lib/utils/format';
	import { ArrowRight } from 'lucide-svelte';
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

<div
	transition:slide={{ duration: 300 }}
	style={`background-color: ${article.isSponsored ? article.sponsorColor : 'transparent'}; color: ${article.isSponsored ? article.sponsorTextColor : 'inherit'};`}
>
	{#if displayCategory && !hideCategory}
		<div class="flex items-center justify-between">
			<Badge
				variant="rectangularFilled"
				href={`/category/${formatCategorySlug(displayCategory.name)}`}
				class="bg-white text-neutral-80 hover:bg-neutral-20 py-1.5 px-2 mb-1"
			>
				{displayCategory.name}
			</Badge>

			<a
				href={`/category/${formatCategorySlug(displayCategory.name)}`}
				class="flex font-mono text-neutral-20 items-center gap-1 text-xs hover:text-primary/60 transition-colors group/button"
			>
				View All
				<ArrowRight class="w-3 h-3 group-hover/button:translate-x-1 transition-transform" />
			</a>
		</div>
	{/if}

	<a href={`/${article.slug}`} class="block group" data-sveltekit-preload-data>
		<div class="flex flex-col w-full overflow-hidden">
			<img
				src={thumbnailUrl}
				alt=""
				class="aspect-[1/0.5] w-full object-cover rounded-t-lg group-hover:scale-105 transition will-change-transform"
			/>
		</div>

		<div class="px-3 mt-2">
			<p
				class="font-powerGroteskBold text-lg font-bold leading-tight tracking-tight line-clamp-2 text-neutral-20 group-hover:underline underline-offset-[3px]"
			>
				{article.title}
			</p>
		</div>
	</a>

	{#if formattedLinks}
		<p class="text-xs font-mono line-clamp-1 mt-1 text-neutral-40 px-3">
			By {@html formattedLinks}
		</p>
	{/if}
</div>
