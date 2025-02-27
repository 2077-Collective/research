import { fetchArticles } from '$lib/services/article.service';
import { fetchGhostArticles } from '$lib/services/ghost.service';
import { error } from '@sveltejs/kit';

export async function load() {
	try {
		const articles = await fetchArticles(undefined, 1, 15);

		const posts = await fetchGhostArticles(15);

		return { articles: posts, posts };
	} catch (err) {
		console.error('Error loading articles:', err);
		throw error(500, { message: 'Failed to load articles' });
	}
}
