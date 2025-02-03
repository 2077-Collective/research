
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
// };
import { getArticleBySlug } from '$lib/services/strapi.service';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    try {
        // Validate slug parameter
        if (!params.slug || params.slug === '404') {
            throw error(404, 'Invalid article slug');
        }

        console.log('Loading article with slug:', params.slug);
        const article = await getArticleBySlug(params.slug);

        if (!article) {
            console.log('Article not found:', params.slug);
            throw error(404, 'Article not found');
        }

        // Validate required article fields
        if (!article.title || !article.content) {
            console.error('Invalid article data:', article);
            throw error(500, 'Invalid article data');
        }

        // Log success
        console.log('Successfully loaded article:', article.title);

        return {
            article,
            meta: {
                title: article.title,
                description: article.summary,
                image: article.thumb
            }
        };
    } catch (err) {
        console.error('Error loading article:', err);
        throw error(500, 'Failed to load article');
    }
};