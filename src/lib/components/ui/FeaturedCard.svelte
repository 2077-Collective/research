<script lang="ts">
	import { goto } from '$app/navigation';
	import type { ArticleMetadata } from '$lib/types/article';
	import { getAuthorsText } from '$lib/utils/authors';
	import { formatCategorySlug } from '$lib/utils/format';
	import { format } from 'date-fns';
	import { gsap } from 'gsap';
	import { ArrowRight } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Badge from './badge/badge.svelte';

	const {
		article,
		hideCategory = false,
		isCategoryPage = false
	}: {
		article: ArticleMetadata;
		hideCategory?: boolean;
		isCategoryPage?: boolean;
	} = $props();

	const primaryCategory = getPrimaryCategory(article)?.name;
	const formattedDate = format(article.created_at, 'dd MMM yyyy');

	function handleCategoryClick(categoryName: string) {
		goto(`/category/${categoryName}`);
	}

	function handleKeydown(event: KeyboardEvent, categoryName: string) {
		if (event.key === 'Enter') {
			handleCategoryClick(categoryName);
		}
	}

	function getPrimaryCategory(article: ArticleMetadata) {
		return article.categories.find((category) => category.is_primary) || article.categories[0];
	}

	const authorText = getAuthorsText(article.authors || []);
	const formattedAuthorText = authorText === 'Unknown' ? '' : authorText;

	let child: HTMLDivElement | null = null;

	onMount(() => {
		if (child) {
			gsap.set(child, { height: 0, marginTop: 0 });
		}
	});

	function expand() {
		if (child) {
			gsap.to(child, { height: 'auto', marginTop: 10, duration: 0.3, ease: 'power2.out' }); // Expand
		}
	}

	function collapse() {
		if (child) {
			gsap.to(child, { height: 0, marginTop: 0, duration: 0.3, ease: 'power2.in' }); // Collapse
		}
	}
</script>

<div
	class="relative group md:rounded-[16px] overflow-hidden md:border border-[#171717]"
	onmouseenter={expand}
	onmouseleave={collapse}
	role="button"
	tabindex="0"
>
	<div class="flex md:aspect-[2.045/0.9] items-center justify-center">
		<a href={`/${article.slug}`} class="!size-full" data-sveltekit-preload-data>
			<img
				src={article.thumb_url}
				alt={`Thumbnail for article: ${article.title}`}
				loading="eager"
				fetchpriority="high"
				decoding="async"
				class="size-full object-cover"
			/>
		</a>
	</div>

	<a
		href={`/${article.slug}`}
		class="absolute right-0 bottom-0 m-8 h-[38px] flex items-center justify-center px-4 py-2.5 bg-white text-black text-sm gap-2 rounded-[999px] opacity-0 group-hover:opacity-100 transition duration-300 max-md:hidden group/button hover:shadow-hover font-semibold font-ibm"
	>
		Read Article
		<ArrowRight class="size-5 group-hover/button:translate-x-1 transition" />
	</a>

	<div
		class="relative md:absolute md:w-[440px] max-w-full bg-[#19191A] md:bottom-0 md:left-[93px] rounded-t-[8px] max-md:rounded-t-none max-md:rounded-b-[8px] pt-6 md:pb-3 group-hover:translate-y-0 transition duration-300 will-change-transform"
	>
		{#if primaryCategory && !hideCategory}
			<div class="px-6">
				{#if isCategoryPage}
					<Badge
						variant="rectangularFilled"
						class="font-mono font-normal text-xs cursor-pointer focus:ring-2 focus:ring-offset-2 rounded-[34px] !bg-[#0CDEE9] border-none px-3 py-1.5 capitalize !text-neutral-80 !pointer-events-none select-none z-0"
					>
						Featured
					</Badge>
				{:else}
					<a href={`/category/${formatCategorySlug(primaryCategory)}`} data-sveltekit-preload-data>
						<Badge
							variant="rectangularFilled"
							class="font-mono font-normal text-xs cursor-pointer focus:ring-2 focus:ring-offset-2 rounded-[34px] !bg-[#0CDEE9] border-none px-3 py-1.5 !text-neutral-80"
							role="link"
							tabindex="0"
						>
							{isCategoryPage ? 'Featured' : primaryCategory}
						</Badge>
					</a>
				{/if}
			</div>
		{/if}

		<a href={`/${article.slug}`} class="px-6 max-md:pb-6 block" data-sveltekit-preload-data>
			<div>
				<h3 class="text-[28px] md:text-[32px] font-powerGroteskBold font-bold leading-8 mt-4">
					{article.title}
				</h3>

				<p class="md:hidden mt-2 text-sm text-neutral-40">{article.summary}</p>
			</div>

			<div
				class="flex items-center gap-2 text-xs text-neutral-40 font-mono mt-5 md:mt-2.5 divide-x-[1px] divide-[#333]"
			>
				<p>{formattedDate}</p>

				{#if article.min_read}
					<p class="pl-2">{article.min_read} min read</p>
				{/if}
			</div>

			<div class="overflow-hidden" bind:this={child}>
				<p class="max-md:hidden text-sm text-neutral-40">
					{article.summary}
				</p>

				{#if formattedAuthorText}
					<hr class="my-4 border-[#262626]" />

					<p class="text-sm font-mono">
						By {@html formattedAuthorText}
					</p>
				{/if}
			</div>
		</a>
	</div>
</div>
