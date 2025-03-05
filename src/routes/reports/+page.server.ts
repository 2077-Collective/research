import { fetchGhostArticles } from '$lib/services/ghost.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const articles = await fetchGhostArticles(undefined, 1, 1000);
	const articleCategories = Array.from(
		new Set(
			articles.flatMap((article: { categories: { name: any }[] }) =>
				article.categories.map((category: { name: any }) => category.name)
			)
		)
	);

	return {
		articles,
		articleCategories
	};
};
