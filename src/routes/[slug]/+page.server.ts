// import { getArticleBySlug } from '$lib/services/strapi.service';
// import type { PageServerLoad } from './$types';
// import { error } from '@sveltejs/kit';

// export const load: PageServerLoad = async ({ params }) => {
//     if (params.slug === '404') return;

//     const article = await getArticleBySlug(params.slug);

//     if (!article) {
//         throw error(404, 'Article not found');
//     }

//     return { article };
// };
// import { getArticleBySlug } from '$lib/services/strapi.service';
// import { error } from '@sveltejs/kit';
// import type { PageServerLoad } from './$types';

// export const load = async ({ params }) => {
//   const article = await getArticleBySlug(params.slug);
//   if (!article) {
//     throw error(404, 'Article not found');
//   }
//   return { article };
// };

import { getArticleBySlug } from '$lib/services/article.service';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ params }) => {
    try {
        // Validate slug
        if (!params.slug) {
            throw error(404, 'Invalid article slug');
        }

        console.log('Loading article:', params.slug);

        const article = await getArticleBySlug(params.slug);
        
        if (!article) {
            console.log('Article not found:', params.slug);
            throw error(404, 'Article not found');
        }

        return {
            article
        };
    } catch (err) {
        console.error('Error loading article:', err);
        if (err instanceof Error && 'status' in err) {
            throw err;
        }
        throw error(500, 'Failed to load article');
    }
}) satisfies PageServerLoad;