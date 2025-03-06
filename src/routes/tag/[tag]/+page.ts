import { dev } from '$app/environment';
import { fetchGhostArticles } from '$lib/services/ghost.service';
import { formatCategorySlug, unformatCategorySlug } from '$lib/utils/format';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	if (!params.tag) {
		if (dev) console.error('Tag parameter is missing');
		throw error(404, 'Tag not found');
	}

	const tag = unformatCategorySlug(params.tag);

	if (!tag) {
		if (dev) console.error(`Invalid category format: ${params.tag}`);
		throw error(400, 'Invalid category format');
	}

	const page = 1;
	const limit = 10;

	try {
		const articles = await fetchGhostArticles(formatCategorySlug(tag), page, limit);

		if (!articles.length) {
			if (dev) console.error(`No articles found for category: ${tag}`);
			throw error(404, `No articles found for category: ${tag}`);
		}

		return { tag, articles };
	} catch (e) {
		if (dev) console.error('Failed to fetch articles:', e);
		throw error(500, 'Failed to fetch articles');
	}
};
