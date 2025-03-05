<script lang="ts">
	import type { Article } from '$lib/types/article';

	const { article }: { article: Article } = $props();

	const jsonLd = () => ({
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: article.title,
		image: article.thumb,
		datePublished: article.created_at,
		dateModified: article.updated_at,
		author: (article.authors || []).map((author) => ({
			'@type': 'Person',
			name: author.full_name,
			url: author.twitter_username ? `https://twitter.com/${author.twitter_username}` : undefined
		})),
		publisher: {
			'@type': 'Organization',
			name: '2077 Research',
			logo: {
				'@type': 'ImageObject',
				url: 'https://research.2077.xyz/favicon.svg'
			}
		},
		description: article.summary
	});
</script>

{@html `<script type="application/ld+json">${JSON.stringify(jsonLd())}</script>`}
