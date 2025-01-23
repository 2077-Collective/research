import {
    ArticleMetadataArraySchema,
    FullArticleSchema,
    type Article,
    type ArticleMetadata
} from '$lib/types/article';

const baseURL = 'https://cms.2077.xyz/api';

export const fetchArticles = async (): Promise<ArticleMetadata[]> => {
    try {
        const res = await fetch(`${baseURL}/articles/`);
        if (!res.ok) {
            throw new Error(`Failed to fetch articles: ${res.status} ${res.statusText}`);
        }

        const body = await res.json();

        let articles: unknown;
        if (Array.isArray(body)) {
            articles = body;
        } else if (body.results && Array.isArray(body.results)) {
            articles = body.results;
        } else {
            throw new Error('Unexpected response structure from the CMS backend');
        }

        return ArticleMetadataArraySchema.parse(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        throw error;
    }
};

export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
    try {
        const res = await fetch(`${baseURL}/articles/${slug}/`);
        if (!res.ok) {
            throw new Error(`Failed to fetch article: ${res.status} ${res.statusText}`);
        }

        const body = await res.json();

        return FullArticleSchema.parse(body.data);
    } catch (error) {
        console.error(`Error fetching article ${slug}:`, error);
        return null;
    }
};