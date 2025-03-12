import { cache, isCacheValid } from '$lib/utils/cache';
import { ghostAPI } from '$lib/utils/ghost';
import { transformToFullArticle as transformToFullArticleGhost } from '$lib/utils/transform-article';

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

	const { html, ...rest } = post;

	console.log({ rest });

	const transformedArticle = transformToFullArticleGhost(post);

	cache.set(cacheKey, { data: transformedArticle, timestamp: Date.now() });

	return transformedArticle;
};
