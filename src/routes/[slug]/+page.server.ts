import { getGhostArticleBySlug } from '$lib/services/ghost.service';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const post = await getGhostArticleBySlug(params.slug);

		if (!post) {
			throw error(404, { message: 'Article not found' });
		}
		return { article: post };
	} catch (err) {
		console.error('Error loading article:', err);
		throw error(500, { message: 'Failed to load article' });
	}
}
