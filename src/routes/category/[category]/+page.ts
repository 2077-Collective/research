// src/routes/category/[category]/+page.ts
import type { PageLoad } from './$types';
import { fetchArticles } from '$lib/services/article.service';

export const load: PageLoad = async ({ params }) => {
	// Fetch all articles using the fetchArticles service
	const allArticles = await fetchArticles();

	// Get the category from the URL parameter
	const category = params.category;

	// Filter articles that belong to the selected category
	const articles = allArticles.filter((article) =>
		article.categories.some((cat) => cat.name.toLowerCase() === category.toLowerCase())
	);

	// Return the category and filtered articles to the page
	return {
		category,
		articles
	};
};