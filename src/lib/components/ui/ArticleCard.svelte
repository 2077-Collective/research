<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { ArticleMetadata } from '$lib/types/article';
	import { getAuthorsText } from '$lib/utils/authors';
	import { formatCategorySlug } from '$lib/utils/format';
	import { format } from 'date-fns';
	import { ArrowRight } from 'lucide-svelte';
	import Badge from './badge/badge.svelte';

	interface $$Props {
		article: ArticleMetadata;
		onBadgeClick?: (category: string) => void;
		hideCategory?: boolean;
		viewStyle?: 'GRID' | 'LIST';
		hideSummary?: boolean;
		hideInfo?: boolean;
		hideAuthors?: boolean;
	}

	const {
		article,
		onBadgeClick,
		hideCategory = false,
		viewStyle = 'GRID',
		hideSummary = true,
		hideInfo = true,
		hideAuthors = false
	}: $$Props = $props();

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

	function getPrimaryCategory(article: ArticleMetadata) {
		const primary = article.categories.find((category: any) => category.is_primary);
		return primary ?? article.categories[0];
	}

	const category = getPrimaryCategory(article);
	const formattedDate = format(article.created_at, 'dd MMM yyyy');
</script>

{#if viewStyle === 'LIST'}
	<div class="flex items-center flex-wrap gap-[46px] py-8 relative group">
		<!-- <a
			href={`/${article.slug}`}
			data-sveltekit-preload-data
			class="absolute inset-0 z-20"
			aria-label="Go to article"
		></a> -->

		<a href={`/${article.slug}`} data-sveltekit-preload-data aria-label="Go to article">
			<div class="w-full max-w-[377.368px] min-h-[165px] flex-shrink-0 overflow-hidden">
				<img
					src={article.thumb_url || ''}
					alt=""
					class="size-full object-cover group-hover:scale-105 transition will-change-transform"
					decoding="async"
					width={377.368}
					height={165}
				/>
			</div></a
		>

		<div class="flex-1 space-y-2.5">
			{#if !hideCategory}
				<a
					href={`/category/${formatCategorySlug(category?.name || '')}`}
					data-sveltekit-preload-data
				>
					<Badge
						variant="rectangularFilled"
						class="bg-white text-neutral-80 py-1.5 px-2 font-mono relative z-50"
					>
						{category?.name}
					</Badge>
				</a>
			{/if}

			<a
				href={`/${article.slug}`}
				data-sveltekit-preload-data
				aria-label="Go to article"
				class="block"
			>
				<h3
					class="font-powerGroteskBold text-[18px] md:text-[28px] leading-tight text-neutral-20 group-hover:underline underline-offset-[3px] !tracking-normal"
				>
					{article.title}
				</h3>

				<div
					class="flex items-center gap-2 text-xs my-2 text-neutral-40 divide-x-[1px] divide-neutral-40 font-mono max-md:mt-5"
				>
					<p>{formattedDate}</p>

					{#if article.min_read}
						<p class="pl-2">{article.min_read} min read</p>
					{/if}
				</div>

				<p class="text-neutral-40 max-md:text-sm">
					{article.summary}
				</p>
			</a>

			{#if formattedLinks && !hideAuthors}
				<p class="text-xs font-mono mt-2 text-neutral-40 relative">
					By {@html formattedLinks}
				</p>
			{/if}
		</div>
	</div>
{:else}
	<div
		style={`background-color: ${article.isSponsored ? article.sponsorColor : 'transparent'}; color: ${article.isSponsored ? article.sponsorTextColor : 'inherit'};`}
	>
		{#if displayCategory && !hideCategory}
			<div class="flex items-center justify-between">
				<a
					href={`/category/${formatCategorySlug(displayCategory.name)}`}
					data-sveltekit-preload-data
				>
					<Badge
						variant="rectangularFilled"
						class="bg-white text-neutral-80 hover:bg-neutral-20 py-1.5 px-2 mb-1"
					>
						{displayCategory.name}
					</Badge>
				</a>

				<a
					href={`/category/${formatCategorySlug(displayCategory.name)}`}
					data-sveltekit-preload-data
					class="flex font-mono text-neutral-20 items-center gap-1 text-xs hover:text-primary/60 transition-colors group/button"
				>
					View all
					<ArrowRight class="w-3 h-3 group-hover/button:translate-x-1 transition-transform" />
				</a>
			</div>
		{/if}

		<a href={`/${article.slug}`} class="block group" data-sveltekit-preload-data>
			<div class="overflow-hidden">
				<img
					src={thumbnailUrl || ''}
					alt=""
					class="aspect-[1/0.5] object-cover rounded-t-lg group-hover:scale-105 transition will-change-transform"
					decoding="async"
				/>
			</div>

			<div class="px-3 mt-2">
				<p
					class="font-powerGroteskBold text-lg font-bold leading-tight text-neutral-20 group-hover:underline underline-offset-[3px] !tracking-normal"
				>
					{article.title}
				</p>

				{#if !hideInfo}
					<div
						class="flex items-center gap-2 text-xs my-2 text-neutral-40 divide-x-[1px] divide-neutral-40 font-mono max-md:mt-5"
					>
						<p>{formattedDate}</p>

						{#if article.min_read}
							<p class="pl-2">{article.min_read} min read</p>
						{/if}
					</div>
				{/if}

				{#if !hideSummary}
					<p class="text-neutral-40 group-hover:text-neutral-60 transition">
						{article.summary}
					</p>
				{/if}
			</div>
		</a>

		{#if formattedLinks && !hideAuthors}
			<p class="text-xs font-mono mt-2 text-neutral-40 px-3">
				By {@html formattedLinks}
			</p>
		{/if}
	</div>
{/if}
