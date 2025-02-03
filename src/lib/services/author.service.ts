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
import { AuthorArraySchema, type Author } from '$lib/types/article';
import { env } from '$env/dynamic/public';

const baseURL = env.PUBLIC_STRAPI_URL || 'http://localhost:1337';
const apiToken = env.PUBLIC_STRAPI_API_TOKEN;

const headers = {
    Authorization: `Bearer ${apiToken}`,
    'Content-Type': 'application/json',
};

export const fetchAuthors = async (): Promise<Author[]> => {
    try {
        const res = await fetch(`${baseURL}/api/authors?populate=*`, { headers });
        if (!res.ok) {
            throw new Error(`Failed to fetch authors: ${res.status} ${res.statusText}`);
        }

        const response = await res.json();
        
        // Log the response to help with debugging
        console.log('Strapi authors response:', response);

        if (!response.data) {
            console.error('No data property in Strapi response');
            return [];
        }

        // Transform Strapi's response format to match your schema
        const transformedAuthors = response.data.map((author: any) => ({
            username: author.attributes?.username || '',
            id: author.id.toString(),
            full_name: author.attributes?.full_name || null,
            twitter_username: author.attributes?.twitter_username || null
        }));

        // Log the transformed data
        console.log('Transformed authors:', transformedAuthors);

        return AuthorArraySchema.parse(transformedAuthors);
    } catch (err) {
        console.error('Author fetch or parse error:', err);
        return [];
    }
};