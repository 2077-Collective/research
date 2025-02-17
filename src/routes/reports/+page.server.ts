import { fetchArticles } from '$lib/services/strapi.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const articles = await fetchArticles();
	const articleCategories = Array.from(
		new Set(articles.flatMap((article) => article.categories.map((category) => category.name)))
	);

	console.log('FIRST ===>', articles[0]);
	console.log('LAST ===>', articles[articles.length - 1]);

	return {
		articles,
		articleCategories
	};
};
