import { env } from '$env/dynamic/public';
import type { Article, ArticleMetadata, StrapiArticle, StrapiResponse } from '$lib/types/article';
import { logApiResponse } from '$lib/utils/api-logger';
import { cache, isCacheValid } from '$lib/utils/cache';
import { calculateReadingTime } from '$lib/utils/calculate-read-time';
import { ghostAPI } from '$lib/utils/ghost';
import { transformToFullArticle as transformToFullArticleGhost } from '$lib/utils/transform-article';

const baseURL = env.PUBLIC_STRAPI_URL;
const apiToken = env.PUBLIC_STRAPI_API_TOKEN;

if (!baseURL || !apiToken) {
	throw new Error(
		'Missing required environment variables: PUBLIC_STRAPI_URL and PUBLIC_STRAPI_API_TOKEN must be set'
	);
}

const headers = {
	Authorization: `Bearer ${apiToken}`,
	'Content-Type': 'application/json'
};

export const transformStrapiArticle = (articleData: any): ArticleMetadata | null => {
	if (!articleData?.id) {
		console.warn('Invalid article data received:', articleData);
		return null;
	}

	const { id } = articleData;

	try {
		return {
			id: articleData.id?.toString() || '',
			slug: articleData?.slug || '',
			title: articleData?.title || '',
			thumb_url: articleData.thumb?.url || '',
			thumb: {
				data: {
					attributes: {
						url: articleData.thumb?.url || ''
					}
				}
			},
			summary: articleData?.summary || '',
			categories: (articleData?.categories || []).map((cat: any) => ({
				name: cat?.name || '',
				is_primary: cat?.is_primary || false
			})),
			authors: (articleData?.authors || []).map((author: any) => ({
				username: author?.username || '',
				id: author.id?.toString() || '',
				full_name: author?.full_name || '',
				twitter_username: author?.twitter_username || null
			})),
			created_at: articleData?.createdAt || new Date().toISOString(),
			updated_at: articleData?.updatedAt || new Date().toISOString(),
			min_read: articleData?.min_read || calculateReadingTime(articleData?.content || ''),
			views: articleData?.views || 0,
			isSponsored: articleData?.is_sponsored || false,
			sponsorColor: articleData?.sponsor_color || '',
			sponsorTextColor: articleData?.sponsor_text_color || ''
		};
	} catch (error) {
		console.error('Error transforming article:', {
			error,
			id
		});
		return null;
	}
};

const transformToFullArticle = (articleData: any): Article | null => {
	if (!articleData.id) return null;

	try {
		return {
			id: articleData.id?.toString() || '',
			slug: articleData?.slug || '',
			title: articleData?.title || '',
			thumb_url: articleData.thumb.url,
			thumb: {
				data: {
					attributes: {
						url: articleData.thumb.url
					}
				}
			},
			summary: articleData?.summary || '',
			categories: (articleData?.categories || []).map((cat: any) => ({
				name: cat?.name || '',
				is_primary: cat?.is_primary || false
			})),
			authors: (articleData?.authors || []).map((author: any) => ({
				username: author?.username || '',
				id: author.id?.toString() || '',
				full_name: author?.full_name || '',
				twitter_username: author?.twitter_username || null
			})),
			created_at: articleData?.createdAt || new Date().toISOString(),
			updated_at: articleData?.updatedAt || new Date().toISOString(),
			min_read: articleData?.min_read || calculateReadingTime(articleData?.content || ''),
			views: articleData?.views || 0,
			isSponsored: articleData?.is_sponsored || false,
			sponsorColor: articleData?.sponsor_color || '',
			sponsorTextColor: articleData?.sponsor_text_color || '',
			content: articleData.content || '',
			gpt_summary: articleData.gpt_summary,
			table_of_contents: articleData.table_of_contents || []
		};
	} catch (error) {
		console.error('Error transforming to full article:', {
			error,
			id: articleData.id
		});
		return null;
	}
};

export const fetchArticles = async (
	category?: string,
	page = 1,
	limit = 10
): Promise<ArticleMetadata[]> => {
	const cacheKey = `${category || 'all'}-${page}-${limit}`;

	if (cache.has(cacheKey)) {
		const cached = cache.get(cacheKey);
		if (cached && isCacheValid(cached.timestamp)) {
			return cached.data;
		}
	}

	try {
		const url = new URL(`${baseURL}/api/articles`);
		url.searchParams.append('populate', '*');

		if (category) {
			url.searchParams.append('filters[categories][slug][$eq]', category);
		}

		url.searchParams.append('pagination[page]', page.toString());
		url.searchParams.append('pagination[pageSize]', limit.toString());

		console.log('Fetching articles from URL:', url.toString());

		const response = await fetch(url.toString(), { headers });

		if (!response.ok) {
			const errorResponse = await response.text();
			console.error('Error response:', errorResponse);
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const result: StrapiResponse<StrapiArticle> = await response.json();

		await logApiResponse(result, `fetch-articles-${category || 'all'}-page-${page}`);

		if (!result?.data) {
			console.warn('No data in response');
			return [];
		}

		const articles = result.data
			.map((article) => transformStrapiArticle(article))
			.filter((article: ArticleMetadata | null): article is ArticleMetadata => article !== null);

		await logApiResponse(
			result,
			`fetch-articles-transformed-${category || 'all'}-page-${page}`,
			articles
		);

		cache.set(cacheKey, { data: articles, timestamp: Date.now() });
		return articles;
	} catch (error) {
		console.error('Error fetching articles:', error);
		throw error;
	}
};

export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
	if (!slug?.trim()) {
		return null;
	}

	const url = new URL(`${baseURL}/api/articles`);
	url.searchParams.append('populate', '*');
	url.searchParams.append('filters[slug][$eq]', slug);

	console.log('Fetching article by slug from URL:', url.toString());

	try {
		const response = await fetch(url.toString(), { headers });

		if (!response.ok) {
			const errorResponse = await response.text();
			console.error('Error response:', errorResponse);
			return null;
		}

		const result: StrapiResponse<StrapiArticle> = await response.json();

		await logApiResponse(result, `get-article-${slug}`);

		if (!result?.data?.[0]) {
			return null;
		}

		const transformedArticle = transformToFullArticle(result.data[0]);

		if (transformedArticle) {
			await logApiResponse(result, `get-article-transformed-${slug}`, transformedArticle);
		}

		return transformedArticle;
	} catch (error) {
		console.error(`Error fetching article ${slug}:`, error);
		return null;
	}
};

export const getGhostArticleBySlug = async (slug: string) => {
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

	const post = await ghostAPI.posts.read(
		{ slug },
		{ formats: ['html'], include: ['authors', 'tags'] }
	);

	const transformedArticle = transformToFullArticleGhost(post);

	cache.set(cacheKey, { data: transformedArticle, timestamp: Date.now() });

	return transformedArticle;
};
