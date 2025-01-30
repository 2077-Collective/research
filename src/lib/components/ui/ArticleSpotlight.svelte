<script lang="ts">
	import type { ArticleMetadata } from '$lib/types/article';
	import Badge from './badge/badge.svelte';
	import { goto } from '$app/navigation';

	const { article }: { article: ArticleMetadata } = $props();

	const primaryCategory = $derived(article.categories.find((category) => category.is_primary));

	function getAuthorDisplayName(author: { full_name?: string | null; username: string }): string {
		return author.full_name || author.username;
	}

	function getAuthorsText(
		authors: { full_name?: string | null; username: string }[] | null | undefined
	): string {
		if (!authors?.length) return 'Unknown';
		return authors.map(getAuthorDisplayName).join(', ');
	}

	function handleCategoryClick(categoryName: string) {
		goto(`/category/${categoryName}`);
	}

	function handleKeydown(event: CustomEvent<KeyboardEvent>, categoryName: string) {
		if (event.detail.key === 'Enter') {
			handleCategoryClick(categoryName);
		}
	}

	function toTitleCase(str: string): string {
		const minorWords = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'for', 'with', 'in']);
		return str.split(' ').map((word, index) => {
			if (index === 0 || !minorWords.has(word.toLowerCase())) {
				return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
			}
			return word.toLowerCase();
		}).join(' ');
	}
</script>

<div class="flex flex-col lg:flex-row w-full">
	<a href={`/${article.slug}`} class="!w-full lg:!w-4/6">
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
		class="flex flex-col gap-3 md:gap-6 w-full lg:w-2/6 p-6 md:p-10 text-base bg-secondary max-md:px-5 max-md:max-w-full"
	>
		<div class="flex gap-1 items-start w-full text-sm leading-none tracking-wide">
			{#if primaryCategory}
				<Badge
					variant="rectangularFilled"
					class="font-mono font-bold border-white/20 text-xs lg:text-sm cursor-pointer focus:ring-2 focus:ring-offset-2"
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
				class="font-soehne text-xl sm:text-3xl lg:text-5xl font-medium text-white leading-tight tracking-tight"
			>
				{toTitleCase(article.title)}
			</h1>
		</a>

		<a href={`/${article.slug}`}>
			<p class="font-hubot text-xs sm:text-base lg:text-lg text-gray-200 line-clamp-2 leading-relaxed">
				{article.summary}
			</p>
		</a>

		<p class="font-mono text-gray-300 text-xs sm:text-sm lg:text-base">
			By {getAuthorsText(article.authors)}
		</p>
	</div>
</div>

<style>
	img {
		width: min(66vw, 960px);
		content-visibility: auto;
	}
</style>