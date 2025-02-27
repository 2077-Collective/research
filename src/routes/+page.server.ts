import { fetchArticles } from '$lib/services/article.service';
import { error } from '@sveltejs/kit';

export async function load() {
	try {
		const articles = await fetchArticles(undefined, 1, 15);
		return { articles };
	} catch (err) {
		console.error('Error loading articles:', err);
		throw error(500, { message: 'Failed to load articles' });
	}
}
