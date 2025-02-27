import { fetchGhostArticles } from '$lib/services/ghost.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const articles = await fetchGhostArticles(undefined, 1, 1000);
	const articleCategories = Array.from(
		new Set(articles.flatMap((article) => article.categories.map((category) => category.name)))
	);

	return {
		articles,
		articleCategories
	};
};
