import { cache, isCacheValid } from '$lib/utils/cache';
import { ghostAPI } from '$lib/utils/ghost';
import { transformArticle } from '$lib/utils/transform-article';

export const fetchGhostArticles = async (
	category?: string,
	page = 1,
	limit = 15,
	bookmarks?: string[]
) => {
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
			...(category && { filter: `tag:${category}` }),
			...((bookmarks || []).length > 0 && { filter: `slug:[${bookmarks}]` })
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
