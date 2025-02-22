import { env } from '$env/dynamic/public';
import type { Author } from '$lib/types/author';
import { logApiResponse } from '$lib/utils/api-logger';
import { getArticleBySlug, transformStrapiArticle } from './article.service';

const baseURL = env.PUBLIC_STRAPI_URL;
const apiToken = env.PUBLIC_STRAPI_API_TOKEN;

const headers = {
	Authorization: `Bearer ${apiToken}`,
	'Content-Type': 'application/json'
};

export const fetchAuthors = async (): Promise<Author[]> => {
	try {
		const res = await fetch(`${baseURL}/api/authors?populate=*`, { headers });
		if (!res.ok) {
			throw new Error(`Failed to fetch authors: ${res.status}`);
		}

		const response = await res.json();

		if (!response.data) return [];

		const transformedAuthors = response.data.map((author: any) => ({
			username: author.username || '',
			id: author.id.toString(),
			full_name: author.full_name || null,
			twitter_username: author.twitter_username || null
		}));

		return transformedAuthors;
	} catch (err) {
		console.error('Author fetch or parse error:', err);
		return [];
	}
};

const cache = new Map<string, { data: Author; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

const isCacheValid = (timestamp: number): boolean => {
	return Date.now() - timestamp < CACHE_TTL;
};

export const getAuthor = async (username: string): Promise<Author | null> => {
	if (!username?.trim()) {
		return null;
	}

	const cacheKey = username;

	if (cache.has(cacheKey)) {
		const cached = cache.get(cacheKey);
		if (cached && isCacheValid(cached.timestamp)) {
			return cached.data;
		}
	}

	const url = new URL(`${baseURL}/api/authors`);
	url.searchParams.append('populate', '*');
	url.searchParams.append('filters[username][$eq]', username);

	try {
		const response = await fetch(url.toString(), { headers });

		if (!response.ok) {
			const errorResponse = await response.text();
			console.error('Error response:', errorResponse);
			return null;
		}

		const result: any = await response.json();

		await logApiResponse(result, `get-author-${username}`);

		if (!result?.data?.[0]) {
			return null;
		}

		const author = result.data[0];

		if (author.articles && author.articles.length > 0) {
			const transformedArticles = await Promise.all(
				author.articles.map(async (article: any) => {
					const response = await getArticleBySlug(article.slug);

					if (!response) {
						return null;
					}

					article.thumb = { url: response.thumb_url };
					article.categories = response.categories;
					article.authors = response.authors;

					return transformStrapiArticle(article);
				})
			);

			// Update articles only with valid transformed ones
			author.articles = transformedArticles.filter(Boolean).reverse();
		}

		cache.set(cacheKey, { data: author, timestamp: Date.now() });

		return author;
	} catch (error) {
		console.error(`Error fetching author ${username}:`, error);
		return null;
	}
};
