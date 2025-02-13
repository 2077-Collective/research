import { getArticleBySlug } from '$lib/services/article.service';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    if (params.slug === '404') return;

    const article = await getArticleBySlug(params.slug);

    if (!article) {
        throw error(404, 'Article not found');
    }

    return { article };
};