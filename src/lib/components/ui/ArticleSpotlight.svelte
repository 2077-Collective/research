<script lang="ts">
	import type { ArticleMetadata } from '$lib/types/article';
	import Badge from './badge/badge.svelte';

	const { article }: { article: ArticleMetadata } = $props();

	function getAuthorDisplayName(author: ArticleMetadata['authors'][number]): string {
		return author.full_name || author.username;
	}

	function getAuthorsText(authors: ArticleMetadata['authors'] | undefined): string {
		if (!authors?.length) return 'Unknown';
		return authors.map(getAuthorDisplayName).join(', ');
	}

</script>

<a href={`/${article.slug}`}>
	<div class="flex flex-col lg:flex-row">
		<img src={article.thumb}
		alt={article.title}
		loading="eager"
		fetchpriority="high"
		decoding="async"
		class="w-full h-auto lg:w-4/6 object-cover" />
		<div
			class="flex flex-col gap-3 md:gap-6 w-full lg:w-2/6 flex flex-col p-6 md:p-10 text-base tracking-normal bg-secondary max-md:px-5 max-md:max-w-full"
		>
			<div class="flex gap-1 items-start w-full text-sm leading-none">
				{#each article.categories as category}
					<Badge variant="outline">{category.name}</Badge>
				{/each}
			</div>
			<h1 class="font-soehne text-5xl font-medium max-md:text-3xl leading-[57px]">
				{article.title}
			</h1>
			<p class="leading-7 dark:text-white">
				{article.summary}
			</p>
			<p class="font-medium dark:text-white">
				By {getAuthorsText(article.authors)}
			</p>
		</div>
	</div>
</a>

<style>
	img {
	        width: min(66vw, 960px);
			height: min(calc(66vw * (1028/1929)), 546px);
			content-visibility: auto;
	    }
</style>
