<script lang="ts">
	import type { ArticleMetadata } from '$lib/types/article';
	import Badge from './badge/badge.svelte';

	const { article }: { article: ArticleMetadata } = $props();

	const primaryCategory = $derived(article.categories.find((category) => category.is_primary));

	function getAuthorDisplayName(author: { full_name?: string; username: string }): string {
		return author.full_name || author.username;
	}

	function getAuthorsText(authors: { full_name?: string; username: string }[] | undefined): string {
		if (!authors?.length) return 'Unknown';
		return authors.map(getAuthorDisplayName).join(', ');
	}
</script>

<a href={`/${article.slug}`}>
	<div class="flex flex-col lg:flex-row">
		<img
			src={article.thumb}
			alt={article.title}
			loading="eager"
			fetchpriority="high"
			decoding="async"
			class="w-full h-auto lg:w-4/6 object-cover"
		/>
		<div
			class="flex flex-col gap-3 md:gap-6 w-full lg:w-2/6 p-6 md:p-10 text-base bg-secondary max-md:px-5 max-md:max-w-full"
		>
			<div class="flex gap-1 items-start w-full text-sm leading-none tracking-wide">
				{#if primaryCategory}
					<Badge variant="outline">{primaryCategory.name}</Badge>
				{/if}
			</div>

			<h1
				class="font-soehne text-xl sm:text-3xl lg:text-5xl font-medium text-white leading-tight tracking-tight"
			>
				{article.title}
			</h1>

			<p class="text-xs sm:text-base lg:text-lg text-gray-200 line-clamp-2 leading-relaxed">
				{article.summary}
			</p>

			<p class="font-medium text-gray-300 text-xs sm:text-sm lg:text-base">
				By {getAuthorsText(article.authors)}
			</p>
		</div>
	</div>
</a>

<style>
	img {
		width: min(66vw, 960px);
		content-visibility: auto;
	}
</style>
