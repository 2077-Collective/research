import type { Author } from '$lib/types/author';
import { cache, isCacheValid } from '$lib/utils/cache';
import { ghostAPI } from '$lib/utils/ghost';
import { transformArticle } from '$lib/utils/transform-article';

export const getAuthorGhost = async (slug: string): Promise<Author | null> => {
	if (!slug?.trim()) {
		return null;
	}

	const cacheKey = `author-with-articles-${slug}`;

	if (cache.has(cacheKey)) {
		const cached = cache.get(cacheKey);
		if (cached && isCacheValid(cached.timestamp)) {
			return cached.data;
		}
	}

	try {
		const author = await ghostAPI.authors.read({ slug }, { include: 'count.posts' });
		const posts = await ghostAPI.posts.browse({
			limit: 1000,
			page: 1,
			include: ['authors', 'tags'],
			filter: `author:${slug}`
		});

		if (!author) {
			return null;
		}

		const transformedAuthor: any = {
			username: author.slug,
			id: author.id,
			full_name: author.name || '',
			twitter_username: author.twitter || '',
			bio: author.bio || null,
			articles: []
		};

		if (posts) {
			const transformedArticles = posts
				.map((article) => transformArticle(article))
				.filter((article) => article !== null);

			transformedAuthor.articles = transformedArticles || [];
		}

		cache.set(cacheKey, { data: transformedAuthor, timestamp: Date.now() });

		return transformedAuthor;
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
