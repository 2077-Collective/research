<script lang="ts">
	import { page } from '$app/stores';
	import { sanitizeTitle } from '$lib/utils/sanitise';
	// Import the utility function

	const pageUrl = $page.url.origin;
	const image = `${pageUrl}/preview-image.jpg`;
	const title = '2077 Research: Cutting-Edge Ethereum Research';
	const description =
		'2077 Research delivers high-signal research and insights on the future of Ethereum scaling, interoperability, privacy, infrastructure, DeFi, and more.';

	// Use the imported utility function
	const sanitizedTitle = sanitizeTitle(title ?? '');
	const sanitizedDescription = sanitizeTitle(description ?? '');
</script>

<svelte:head>
	<title>{sanitizedTitle}</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="generator" content="2077 Research" />

	<!-- OG meta tags -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content={sanitizedTitle} />
	<meta property="og:description" content={sanitizedDescription} />
	<meta property="og:image" content={image} />

	<!-- Twitter meta tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={sanitizedTitle} />
	<meta name="twitter:description" content={sanitizedDescription} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:url" content={pageUrl} />
	<meta name="twitter:site" content="@2077Research" />

	<!-- General meta tags -->
	<meta name="title" content={sanitizedTitle} />
	<meta name="description" content={sanitizedDescription} />

	<link
		rel="preload"
		href="/fonts/Hubot-Sans.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
	<link
		rel="preload"
		href="/fonts/PowerGrotesk-Variable.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
</svelte:head>
