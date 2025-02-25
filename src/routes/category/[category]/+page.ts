import type { PageLoad } from './$types';
import { fetchArticles } from '$lib/services/article.service';
import { error } from '@sveltejs/kit';
import { unformatCategorySlug } from '$lib/utils/format';
import { dev } from '$app/environment';

export const load: PageLoad = async ({ params }) => {
    if (!params.category) {
        if (dev) console.error('Category parameter is missing');
        throw error(404, 'Category not found');
    }

    const category = unformatCategorySlug(params.category);
    
    if (!category) {
        if (dev) console.error(`Invalid category format: ${params.category}`);
        throw error(400, 'Invalid category format');
    }

    const page = 1;
    const limit = 10;

    try {
        const articles = await fetchArticles(category, page, limit);

        if (!articles.length) {
            if (dev) console.error(`No articles found for category: ${category}`);
            throw error(404, `No articles found for category: ${category}`);
        }

        return { category, articles };
    } catch (e) {
        if (dev) console.error('Failed to fetch articles:', e);
        throw error(500, 'Failed to fetch articles');
    }
};