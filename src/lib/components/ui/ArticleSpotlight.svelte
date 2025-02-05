<script lang="ts">
	import { goto } from '$app/navigation';
	import type { ArticleMetadata } from '$lib/types/article';
	import { getAuthorsText } from '$lib/utils/authors';
	import { toTitleCase } from '$lib/utils/titleCase';
	import { format } from 'date-fns';
	import Badge from './badge/badge.svelte';

	const { article }: { article: ArticleMetadata } = $props();

	let formattedDate = format(article.updatedAt, 'dd MMM yyyy');

	const primaryCategory = $derived(article.categories.find((category) => category.is_primary));

	function handleCategoryClick(categoryName: string) {
		goto(`/category/${categoryName}`);
	}

	function handleKeydown(event: CustomEvent<KeyboardEvent>, categoryName: string) {
		if (event.detail.key === 'Enter') {
			handleCategoryClick(categoryName);
		}
	}
</script>

<div class="flex flex-col lg:flex-row w-full relative">
	<a href={`/${article.slug}`} class="w-full">
		<img
			src={article.thumb}
			alt={`Thumbnail for article: ${article.title}`}
			loading="eager"
			fetchpriority="high"
			decoding="async"
			class="!w-full lg:w-4/6 object-contain"
		/>
	</a>

	<div
		class="flex flex-col text-base bg-secondary max-md:px-5 max-w-[376px] max-md:max-w-full absolute left-20 bottom-0 p-6 pb-0 rounded-[8px]"
	>
		<div class="flex gap-1 items-start w-full text-sm leading-none tracking-wide mb-4">
			{#if primaryCategory}
				<Badge
					variant="rectangularFilled"
					class="font-mono font-bold border-white/20 text-xs lg:text-sm cursor-pointer focus:ring-2 focus:ring-offset-2 rounded-[34px]"
					role="link"
					tabindex="0"
					on:click={() => handleCategoryClick(primaryCategory.name)}
					on:keydown={(event) => handleKeydown(event, primaryCategory.name)}
				>
					{primaryCategory.name}
				</Badge>
			{/if}
		</div>

		<a href={`/${article.slug}`}>
			<h1
				class="font-powerGroteskBold text-xl sm:text-3xl lg:text-[32px] font-medium text-white leading-tight tracking-tight"
			>
				{toTitleCase(article.title)}
			</h1>
		</a>

		<div
			class="text-xs flex items-center divide-x divide-[#333] space-x-2 py-[10px] text-neutral-40"
		>
			<a href={`/${article.slug}`}>
				<p class="font-hubot line-clamp-2 leading-relaxed">
					{formattedDate}
				</p>
			</a>

			<p class="font-mono pl-2">
				By {getAuthorsText(article.authors)}
			</p>
		</div>
	</div>
</div>

<style>
	img {
		width: min(66vw, 960px);
		content-visibility: auto;
	}
</style>
