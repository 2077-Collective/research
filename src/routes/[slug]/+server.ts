import { getGhostArticleBySlug } from '$lib/services/article.service';
import type { RequestHandler } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, request }) => {
	const userAgent = request.headers.get('user-agent') || '';
	const { slug } = params;

	console.log('User-Agent:', userAgent);

	// Fetch article
	const post = await getGhostArticleBySlug(slug || '');

	if (!post) {
		throw error(404, { message: 'Article not found' });
	}

	const url = new URL(request.url);
	const origin = url.origin;
	const newThumbUrl = post.thumb_url.replace('ghost-2077.arvensis.systems', 'ghost.2077.xyz');

	// Ensure absolute URLs for Twitter cards
	const sanitizedTitle = post.title || 'Untitled Article';
	const sanitizedSummary = post.summary || 'Read more on our website.';
	const sanitizedThumb = post.thumb_url?.startsWith('http')
		? newThumbUrl
		: `${origin}${newThumbUrl}`;
	const sanitizedUrl = `${origin}/${post.slug}`;

	// Twitterbot/1.0

	// If Twitterbot is detected, return lightweight metadata HTML
	if (
		userAgent.includes('TelegramBot') ||
		userAgent.includes('Twitterbot') ||
		userAgent.includes('WhatsApp') ||
		userAgent.includes('LinkedInBot')
	) {
		return new Response(
			`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${sanitizedTitle}</title>

        <meta property="og:type" content="article">
        <meta property="og:title" content="${sanitizedTitle}">
        <meta property="og:description" content="${sanitizedSummary}">
        <meta property="og:image" content="${sanitizedThumb}">
        <meta property="og:url" content="${sanitizedUrl}">
        <meta property="og:site_name" content="2077Research">
        
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${sanitizedTitle}">
        <meta name="twitter:description" content="${sanitizedSummary}">
        <meta name="twitter:image" content="${sanitizedThumb}">
        <meta name="twitter:url" content="${sanitizedUrl}">
        <meta name="twitter:site" content="@2077Research">
      </head>
      <body>
        <h1>${sanitizedTitle}</h1>
        <p>${sanitizedSummary}</p>
        <img src="${sanitizedThumb}" alt="${sanitizedTitle}">
      </body>
      </html>
    `.trim(),
			{
				headers: { 'Content-Type': 'text/html' }
			}
		);
	}

	// Otherwise, redirect to the full article page
	return new Response(null, { status: 302, headers: { Location: `/${slug}` } });
};
