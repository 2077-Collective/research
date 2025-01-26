/*
 */

import { fetchAuthors } from '$lib/services/author.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const authors = await fetchAuthors();
	const filteredAuthors = authors.filter(
		(v) => v.username != 'admin_author' && v.username != 'admin_dev'
	);

	return {
		authors: filteredAuthors
	};
};
