import { getArticleBySlug } from '$lib/services/article.service';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const article = await getArticleBySlug(params.slug);
		if (!article) {
			throw error(404, { message: 'Article not found' });
		}
		return { article };
	} catch (err) {
		console.error('Error loading article:', err);
		throw error(500, { message: 'Failed to load article' });
	}
}
