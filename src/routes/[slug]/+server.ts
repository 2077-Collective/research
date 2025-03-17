import { getGhostArticleBySlug } from '$lib/services/article.service';
import { sanitizeTitle } from '$lib/utils/sanitise';
import type { RequestHandler } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, request }) => {
	const userAgent = request.headers.get('user-agent') || '';
	const { slug } = params;

	const url = new URL(request.url);
	const origin = url.origin;

	const post = await getGhostArticleBySlug(slug || '');

	if (!post) {
		throw error(404, { message: 'Article not found' });
	}

	const sanitizedTitle = sanitizeTitle(post.title) || '';
	const sanitizedSummary = sanitizeTitle(post.summary) || '';
	const sanitizedThumb = sanitizeTitle(post.thumb_url || '') || '';
	const sanitizedUrl = sanitizeTitle(`${origin}/${post.slug}`) || '';

	// If Twitterbot is detected, return lightweight metadata HTML
	if (userAgent.includes('Twitterbot')) {
		return new Response(
			`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={${sanitizedTitle}} />
        <meta name="twitter:description" content={${sanitizedSummary}} />
        <meta name="twitter:image" content={${sanitizedThumb}} />
        <meta name="twitter:url" content={${sanitizedUrl}} />
        <meta name="twitter:site" content="@2077Research" />
      </head>
      <body></body>
      </html>
    `,
			{
				headers: { 'Content-Type': 'text/html' }
			}
		);
	}

	// Otherwise, return the normal page
	return new Response(null, { status: 302, headers: { Location: `/${slug}` } });
};
