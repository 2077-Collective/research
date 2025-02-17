import { env } from '$env/dynamic/public';
import { ArticleMetadataArraySchema, type ArticleMetadata } from '$lib/types/article';

const baseURL = env.PUBLIC_STRAPI_URL;
const apiToken = env.PUBLIC_STRAPI_API_TOKEN;

const headers = {
	Authorization: `Bearer ${apiToken}`,
	'Content-Type': 'application/json'
};

const cache = new Map<string, { data: ArticleMetadata[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

const isCacheValid = (timestamp: number): boolean => {
	return Date.now() - timestamp < CACHE_TTL;
};

export const fetchArticles = async (category?: string, page = 1, limit = 10) => {
	const cacheKey = `${category || 'all'}-${page}-${limit}`;

	if (cache.has(cacheKey)) {
		const cached = cache.get(cacheKey);
		if (cached && isCacheValid(cached.timestamp)) {
			return cached.data;
		}
	}

	try {
		if (!baseURL) {
			throw new Error('STRAPI_URL is not configured');
		}

		const queryParams = new URLSearchParams({
			populate: '*'
		});

		if (category) {
			queryParams.append('filters[categories][slug][$eq]', category.toLowerCase());
		}

		const FETCH_URL = `${baseURL}/api/articles?sort=createdAt:desc&${queryParams.toString()}`;

		const res = await fetch(FETCH_URL, { headers });

		if (!res.ok) {
			const errorText = await res.text();
			console.error('Error response:', {
				status: res.status,
				statusText: res.statusText,
				body: errorText
			});
			throw new Error(`Failed to fetch articles: ${res.status} ${res.statusText}`);
		}

		const body = await res.json();

		// Add validation
		if (!body || !body.data) {
			console.error('Invalid response structure:', body);
			throw new Error('Invalid response structure from Strapi');
		}

		if (!Array.isArray(body.data)) {
			console.error('Response data is not an array:', body.data);
			throw new Error('Invalid response data format from Strapi');
		}

		// Transform and validate the data
		const articles = body.data
			.map((article: any) => {
				if (!article) {
					console.warn('Invalid article structure:', article);
					return null;
				}

				return {
					id: article.id?.toString() || '',
					slug: article?.slug || '',
					title: article?.title || '',
					thumb_url: article.thumb.url,
					thumb: {
						data: {
							attributes: {
								url: article.thumb.url
							}
						}
					},
					summary: article?.summary || '',
					categories: (article?.categories || []).map((cat: any) => ({
						name: cat?.name || '',
						is_primary: cat?.is_primary || false
					})),
					authors: (article?.authors || []).map((author: any) => ({
						username: author?.username || '',
						id: author.id?.toString() || '',
						full_name: author?.full_name || '',
						twitter_username: author?.twitter_username || null
					})),
					created_at: article?.createdAt || new Date().toISOString(),
					updated_at: article?.updatedAt || new Date().toISOString(),
					min_read: article?.min_read || null,
					views: article?.views || 0,
					isSponsored: article?.is_sponsored || false,
					sponsorColor: article?.sponsor_color || '',
					sponsorTextColor: article?.sponsor_text_color || ''
				};
			})
			.filter(Boolean);

		const parsedArticles = ArticleMetadataArraySchema.parse(articles);
		cache.set(cacheKey, { data: parsedArticles, timestamp: Date.now() });

		return parsedArticles;
	} catch (error) {
		console.error('Error in fetchArticles:', error);
		throw error;
	}
};
