import type { PageLoad } from './$types';
import { fetchArticles } from '$lib/services/article.service';
import { error } from '@sveltejs/kit';
import { unformatCategorySlug } from '$lib/utils/format'; 

export const load: PageLoad = async ({ params }) => {
    if (!params.category) {
        throw error(404, 'Category not found');
    }

    const category = unformatCategorySlug(params.category);

    const page = 1;
    const limit = 10;

    try {
        const articles = await fetchArticles(category, page, limit);

        if (!articles.length) {
            throw error(404, `No articles found for category: ${category}`); 
        }

        return { category, articles };
    } catch (e) {
        throw error(500, 'Failed to fetch articles');
    }
};