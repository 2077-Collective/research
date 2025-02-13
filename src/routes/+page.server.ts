
// import { fetchArticles } from '$lib/services/article.service';
// import type { PageServerLoad } from './$types';
// import { error } from '@sveltejs/kit';

// export const load: PageServerLoad = async ({ url }) => {
//     try {
//         // Get page and category from URL if they exist
//         const page = Number(url.searchParams.get('page')) || 1;
//         const category = url.searchParams.get('category') || undefined;

//         // Fetch articles
//         const articles = await fetchArticles(category, page);
        
//         // Debug log
//         console.log('Fetched articles:', articles);

//         if (!articles) {
//             console.error('No articles returned from fetchArticles');
//             throw error(404, 'No articles found');
//         }

//         // Extract unique categories
//         const articleCategories = Array.from(
//             new Set(
//                 articles
//                     .flatMap((article) => article.categories || [])
//                     .filter(category => category && category.name)
//                     .map((category) => category.name)
//             )
//         );

//         // Debug log
//         console.log('Extracted categories:', articleCategories);

//         return {
//             articles,
//             articleCategories,
//             page,
//             category
//         };
//     } catch (err) {
//         console.error('Error in page load:', err);
//         throw error(500, {
//             message: 'Failed to load articles',
//             cause: err instanceof Error ? err.message : 'Unknown error'
//         });
//     }
// };import { error } from '@sveltejs/kit';
import { fetchArticles } from '$lib/services/article.service';
import { error } from '@sveltejs/kit';
export async function load() {
    try {
        const articles = await fetchArticles();
        return { articles };
    } catch (err) {
        console.error('Error loading articles:', err);
        throw error(500, { message: 'Failed to load articles' });
    }
}