import { getAuthor, getAuthorGhost } from '$lib/services/author.service';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const author = await getAuthor(params.slug);

		const test = await getAuthorGhost(params.slug);

		if (!author) {
			throw error(404, { message: 'Author not found' });
		}

		return { author };
	} catch (err) {
		console.error('Error loading article:', err);
		throw error(500, { message: 'Failed to load article' });
	}
}
