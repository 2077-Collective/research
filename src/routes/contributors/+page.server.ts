import { fetchAuthorsGhost } from '$lib/services/author.service';
import { error } from '@sveltejs/kit';

export async function load() {
	try {
		const authors = await fetchAuthorsGhost();

		return { authors };
	} catch (err) {
		console.error('Error loading authors:', err);
		throw error(500, { message: 'Failed to load authors' });
	}
}
