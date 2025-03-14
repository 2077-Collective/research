import { fetchGhostArticles, fetchGhostArticlesFilters } from '$lib/services/ghost.service';
import { error } from '@sveltejs/kit';

export async function load() {
	try {
		const posts = await fetchGhostArticles(undefined, 1, 15);

		const recentPosts = await fetchGhostArticlesFilters([
			'Layer 1',
			'Layer 2',
			'Interoperability',
			'DeFi',
			'Privacy',
			'DePIN'
		]);

		return { articles: posts, recentPosts };
	} catch (err) {
		console.error('Error loading articles:', err);
		throw error(500, { message: 'Failed to load articles' });
	}
}
