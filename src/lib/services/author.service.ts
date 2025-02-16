// import { AuthorArraySchema, type Author } from '$lib/types/article';

// const baseURL = 'http://localhost:1337/api';

// export const fetchAuthors = async (): Promise<Author[]> => {
//   try {
//     const res = await fetch(`${baseURL}/authors`);
//     if (!res.ok) {
//       throw new Error(`Failed to fetch authors: ${res.status} ${res.statusText}`);
//     }
//     const body = await res.json();
//     return AuthorArraySchema.parse(body);
//   } catch (err) {
//     console.error('Author fetch or parse error:', err);
//     return []; // or handle appropriately
//   }
// };
import { env } from '$env/dynamic/public';
import { type Author } from '$lib/types/article';

const baseURL = env.PUBLIC_STRAPI_URL;
const apiToken = env.PUBLIC_STRAPI_API_TOKEN;

const headers = {
	Authorization: `Bearer ${apiToken}`,
	'Content-Type': 'application/json'
};
export const fetchAuthors = async (): Promise<Author[]> => {
	try {
		const res = await fetch(`${baseURL}/api/authors?populate=*`, { headers });
		if (!res.ok) {
			throw new Error(`Failed to fetch authors: ${res.status}`);
		}

		const response = await res.json();

		if (!response.data) return [];

		const transformedAuthors = response.data.map((author: any) => ({
			username: author.username || '',
			id: author.id.toString(),
			full_name: author.full_name || null,
			twitter_username: author.twitter_username || null
		}));

		return transformedAuthors;
	} catch (err) {
		console.error('Author fetch or parse error:', err);
		return [];
	}
};
