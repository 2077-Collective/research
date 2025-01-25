<script lang="ts">
	import type { Article } from '$lib/types/article';
	import { page } from '$app/stores';
	import ArticleJsonLd from './ArticleJsonLd.svelte';

	const { article }: { article?: Article } = $props();

	const pageUrl = $page.url.origin;

	// Utility function to unescape and sanitize the title
	function sanitizeTitle(title: string): string {
		return title
			.replace(/&amp;/g, '&') // Unescape &amp; to &
			.replace(/&lt;/g, '<') // Unescape &lt; to <
			.replace(/&gt;/g, '>') // Unescape &gt; to >
			.replace(/&quot;/g, '"') // Unescape &quot; to "
			.replace(/&#039;/g, "'"); // Unescape &#039; to '
	}

	// Sanitize the article data
	const sanitizedTitle = article ? sanitizeTitle(article.title) : '';
	const sanitizedSummary = article ? sanitizeTitle(article.summary) : '';
	const sanitizedThumb = article ? sanitizeTitle(article.thumb) : '';
	const sanitizedUrl = article ? sanitizeTitle(`${pageUrl}/${article.slug}`) : '';
	const sanitizedAuthors = article
		? article.authors?.map((author) => author.fullName || author.username).join(', ')
		: '';
</script>

<svelte:head>
	{#if article}
		<title>{sanitizedTitle}</title>
		<meta charset="utf-8" />
		<meta name="generator" content="2077 Research" />

		<!-- OG meta tags -->
		<meta property="og:type" content="website" />
		<meta property="og:title" content={sanitizedTitle} />
		<meta property="og:description" content={sanitizedSummary} />
		<meta property="og:image" content={sanitizedThumb} />

		<!-- Twitter meta tags -->
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:title" content={sanitizedTitle} />
		<meta name="twitter:description" content={sanitizedSummary} />
		<meta name="twitter:image" content={sanitizedThumb} />
		<meta name="twitter:url" content={sanitizedUrl} />
		<meta name="twitter:site" content="@2077Research" />

		<!-- General meta tags -->
		<meta name="title" content={sanitizedTitle} />
		<meta name="description" content={sanitizedSummary} />
		<meta name="author" content={sanitizedAuthors} />

		<ArticleJsonLd {article} />
	{/if}
</svelte:head>