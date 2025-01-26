import { AuthorArraySchema, type Author } from '$lib/types/article';

const baseURL = 'https://cms.2077.xyz/api';

export const fetchAuthors = async (): Promise<Author[]> => {
  try {
    const res = await fetch(`${baseURL}/authors`);
    if (!res.ok) {
      throw new Error(`Failed to fetch authors: ${res.status} ${res.statusText}`);
    }
    const body = await res.json();
    return AuthorArraySchema.parse(body);
  } catch (err) {
    console.error('Author fetch or parse error:', err);
    return []; // or handle appropriately
  }
};
