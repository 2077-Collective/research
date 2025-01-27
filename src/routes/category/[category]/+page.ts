import type { PageLoad } from './$types';
import { fetchArticles } from '$lib/services/article.service';

export const load: PageLoad = async ({ params }) => {
    const category = params.category;

    const page = 1;
    const limit = 10;
    const articles = await fetchArticles(category, page, limit);

    return {
        category,
        articles
    };
};