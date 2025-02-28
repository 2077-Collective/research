import { fetchGhostArticles } from '$lib/services/ghost.service';
import { error } from '@sveltejs/kit';

export async function load() {
	try {
		const posts = await fetchGhostArticles(undefined, 1, 15);

		return { articles: posts, posts };
	} catch (err) {
		console.error('Error loading articles:', err);
		throw error(500, { message: 'Failed to load articles' });
	}
}
