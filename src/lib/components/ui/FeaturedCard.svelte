<script lang="ts">
	import { goto } from '$app/navigation';
	import type { ArticleMetadata } from '$lib/types/article';
	import { getAuthorsText } from '$lib/utils/authors';
	import { toTitleCase } from '$lib/utils/titleCase';
	import { format } from 'date-fns';
	import { ArrowRight } from 'lucide-svelte';
	import Badge from './badge/badge.svelte';

	export let article: ArticleMetadata;

	const primaryCategory = getPrimaryCategory(article)?.name;
	const formattedDate = format(article.updatedAt, 'dd MMM yyyy');

	function handleCategoryClick(categoryName: string) {
		goto(`/category/${categoryName}`);
	}

	function handleKeydown(event: CustomEvent<KeyboardEvent>, categoryName: string) {
		if (event.detail.key === 'Enter') {
			handleCategoryClick(categoryName);
		}
	}

	function getPrimaryCategory(article: ArticleMetadata) {
		return article.categories.find((category) => category.is_primary);
	}
</script>

<div class="relative group md:rounded-[16px] overflow-hidden">
	<div class="flex md:aspect-[1/0.45] items-center justify-center">
		<a href={`/${article.slug}`} class="!size-full">
			<img
				src={article.thumb}
				alt={`Thumbnail for article: ${article.title}`}
				loading="eager"
				fetchpriority="high"
				decoding="async"
				class="!w-full lg:w-4/6 object-cover"
			/>
		</a>
	</div>

	<a href={`/${article.slug}`} class="!size-full">
		<button
			class="absolute right-0 bottom-0 m-8 h-[38px] flex items-center justify-center px-4 py-2.5 bg-white text-black text-sm gap-2 rounded-[999px] opacity-0 group-hover:opacity-100 transition duration-300 max-md:hidden group/button hover:shadow-hover font-semibold"
		>
			Read Article

			<ArrowRight class="size-5 group-hover/button:translate-x-1 transition" />
		</button>
	</a>

	<div
		class="relative md:absolute md:w-[350px] max-w-full bg-[#19191A] md:bottom-0 md:left-[93px] rounded-t-[8px] max-md:rounded-t-none max-md:rounded-b-[8px] max-md:pt-6 md:py-6 md:translate-y-[134px] group-hover:translate-y-0 transition duration-300 will-change-transform"
	>
		{#if primaryCategory}
			<div class="px-6">
				<Badge
					variant="rectangularFilled"
					class="font-mono font-normal text-xs cursor-pointer focus:ring-2 focus:ring-offset-2 rounded-[34px] !bg-[#0CDEE9] border-none px-3 py-1.5 capitalize !text-neutral-80"
					role="link"
					tabindex="0"
					on:click={() => handleCategoryClick(primaryCategory)}
					on:keydown={(event) => handleKeydown(event, primaryCategory)}
				>
					{primaryCategory}
				</Badge>
			</div>
		{/if}

		<a href={`/${article.slug}`} class="px-6 max-md:pb-6 block">
			<h3
				class="text-[28px] md:text-[32px] font-powerGroteskBold font-bold leading-8 line-clamp-3 mt-4"
			>
				{toTitleCase(article.title)}
			</h3>

			<p class="md:hidden mt-2 text-sm text-neutral-40 line-clamp-3">{article.summary}</p>

			<div class="flex items-center gap-2 text-xs text-neutral-40 font-mono mt-5 md:mt-2.5">
				<p>{formattedDate}</p>
				<!-- <p class="pl-2 line-clamp-1">By {getAuthorsText(article.authors)}</p> -->
			</div>

			<p class="max-md:hidden text-sm text-neutral-40 line-clamp-3 mt-2.5">
				{article.summary}
			</p>

			<hr class="my-4 border-[#262626]" />

			<p class="text-sm font-mono line-clamp-1">
				By {getAuthorsText(article.authors)}
			</p>
		</a>
	</div>
</div>
