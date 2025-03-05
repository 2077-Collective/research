import { env } from '$env/dynamic/public';
import type { Author } from '$lib/types/author';
import { logApiResponse } from '$lib/utils/api-logger';
import { ghostAPI } from '$lib/utils/ghost';
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

const cache = new Map<string, { data: any; timestamp: number }>();
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

export const getAuthorGhost = async (slug: string): Promise<Author | null> => {
	if (!slug?.trim()) {
		return null;
	}

	const cacheKey = slug;

	if (cache.has(cacheKey)) {
		const cached = cache.get(cacheKey);
		if (cached && isCacheValid(cached.timestamp)) {
			return cached.data;
		}
	}

	try {
		// const author = await ghostAPI.authors.read({ slug }, { include: 'posts' });

		// console.log({ author });

		// if (!author) {
		// 	return null;
		// }

		// const author = result.data[0];

		// if (author.articles && author.articles.length > 0) {
		// 	const transformedArticles = await Promise.all(
		// 		author.articles.map(async (article: any) => {
		// 			const response = await getArticleBySlug(article.slug);

		// 			if (!response) {
		// 				return null;
		// 			}

		// 			article.thumb = { url: response.thumb_url };
		// 			article.categories = response.categories;
		// 			article.authors = response.authors;

		// 			return transformStrapiArticle(article);
		// 		})
		// 	);

		// 	// Update articles only with valid transformed ones
		// 	author.articles = transformedArticles.filter(Boolean).reverse();
		// }

		// cache.set(cacheKey, { data: author, timestamp: Date.now() });

		return null;
	} catch (error) {
		console.error(`Error fetching author ${slug}:`, error);
		return null;
	}
};

export const fetchAuthorsGhost = async () => {
	const cacheKey = `contributors`;

	if (cache.has(cacheKey)) {
		const cached = cache.get(cacheKey);
		if (cached && isCacheValid(cached.timestamp)) {
			return cached.data;
		}
	}

	try {
		const authors = await ghostAPI.authors.browse();

		if (!authors) {
			return [];
		}

		const transformedAuthors = authors.map((author: any) => ({
			username: author.slug,
			id: author.id,
			full_name: author.name,
			twitter_username: author.twitter || null,
			bio: author.bio
		}));

		cache.set(cacheKey, { data: transformedAuthors, timestamp: Date.now() });

		return transformedAuthors;
	} catch (error) {
		console.error('Error in fetchArticles:', error);
		throw error;
	}
};
