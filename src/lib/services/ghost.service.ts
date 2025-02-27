import { calculateReadingTime } from '$lib/utils/calculate-read-time';
import { ghostAPI } from '$lib/utils/ghost';
import type { PostOrPage } from '@tryghost/content-api';

const transformArticle = (articleData: PostOrPage) => {
	if (!articleData?.id) {
		console.warn('Invalid article data received:', articleData);
		return null;
	}

	const { id } = articleData;

	try {
		return {
			id: articleData.id || '',
			slug: articleData.slug || '',
			title: articleData.title || '',
			thumb_url: articleData.feature_image || '',
			thumb: {
				data: {
					attributes: {
						url: articleData.feature_image || ''
					}
				}
			},
			summary: articleData.excerpt || '',
			categories: (articleData.tags || []).map((cat: any) => ({
				name: cat.name || '',
				is_primary: cat?.is_primary || false
			})),
			authors: (articleData.authors || []).map((author: any) => ({
				username: author.slug || '',
				id: author.id || '',
				full_name: author.name || '',
				twitter_username: author.twitter || null
			})),
			created_at: articleData.published_at || new Date().toISOString(),
			updated_at: articleData.updated_at || new Date().toISOString(),
			min_read: articleData.reading_time || calculateReadingTime(articleData.html || ''),
			views: 0,
			isSponsored: false,
			sponsorColor: '',
			sponsorTextColor: ''
		};
	} catch (error) {
		console.error('Error transforming article:', {
			error,
			id
		});
		return null;
	}
};

const transformToFullArticle = (articleData: PostOrPage) => {
	if (!articleData.id) return null;

	try {
		return {
			id: articleData.id || '',
			slug: articleData.slug || '',
			title: articleData.title || '',
			thumb_url: articleData.feature_image || '',
			thumb: {
				data: {
					attributes: {
						url: articleData.feature_image || ''
					}
				}
			},
			summary: articleData.excerpt || '',
			categories: (articleData.tags || []).map((cat: any) => ({
				name: cat.name || '',
				is_primary: cat?.is_primary || false
			})),
			authors: (articleData.authors || []).map((author: any) => ({
				username: author.slug || '',
				id: author.id || '',
				full_name: author.name || '',
				twitter_username: author.twitter || null
			})),
			created_at: articleData.published_at || new Date().toISOString(),
			updated_at: articleData.updated_at || new Date().toISOString(),
			min_read: articleData.reading_time || calculateReadingTime(articleData.html || ''),
			views: 0,
			isSponsored: false,
			sponsorColor: '',
			sponsorTextColor: '',
			content: articleData.html || '',
			gpt_summary: articleData.custom_excerpt,
			table_of_contents: []
		};
	} catch (error) {
		console.error('Error transforming to full article:', {
			error,
			id: articleData.id
		});
		return null;
	}
};

const cache = new Map<string, { data: any[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

const isCacheValid = (timestamp: number): boolean => {
	return Date.now() - timestamp < CACHE_TTL;
};

export const fetchGhostArticles = async (category?: string, page = 1, limit = 15) => {
	const cacheKey = `${category || 'all'}-${page || 1}-${limit}`;

	if (cache.has(cacheKey)) {
		const cached = cache.get(cacheKey);
		if (cached && isCacheValid(cached.timestamp)) {
			return cached.data;
		}
	}

	try {
		const posts = await ghostAPI.posts.browse({
			limit,
			include: ['authors', 'tags'],
			page,
			...(category && { filter: `tag:${category}` })
		});

		if (!posts) {
			return [];
		}

		const articles = posts
			.map((article) => transformArticle(article))
			.filter((article) => article !== null);

		cache.set(cacheKey, { data: articles, timestamp: Date.now() });

		return articles;
	} catch (error) {
		console.error('Error in fetchArticles:', error);
		throw error;
	}
};

export const getGhostArticleBySlug = async (slug: string) => {
	if (!slug?.trim()) {
		return null;
	}

	const post = await ghostAPI.posts.read(
		{ slug },
		{ formats: ['html'], include: ['authors', 'tags'] }
	);

	const transformedArticle = transformToFullArticle(post);

	return transformedArticle;
};
