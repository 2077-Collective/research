import { AuthorArraySchema, type Author } from '$lib/types/article';

const baseURL = 'https://cms.2077.xyz/api';

export const fetchAuthors = async (): Promise<Author[]> => {
	const res = await fetch(`${baseURL}/authors`);
	const body = await res.json();

	return AuthorArraySchema.parse(body);
};
