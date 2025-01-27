import {
    ArticleMetadataArraySchema,
    FullArticleSchema,
    type Article,
    type ArticleMetadata
} from '$lib/types/article';

const baseURL = 'https://cms.2077.xyz/api';

const cache = new Map<string, { data: ArticleMetadata[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; 

const isCacheValid = (timestamp: number): boolean => {
    return Date.now() - timestamp < CACHE_TTL;
};

export const fetchArticles = async (category?: string, page = 1, limit = 10) => {
    const cacheKey = `${category || 'all'}-${page}-${limit}`;

    if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (cached && isCacheValid(cached.timestamp)) {
            return cached.data;
        }
    }

    try {
        const url = new URL(`${baseURL}/articles/`);
        if (category) {
            url.searchParams.append('category', category.toLowerCase());
        }
        url.searchParams.append('page', page.toString());
        url.searchParams.append('limit', limit.toString());

        const res = await fetch(url.toString());
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

        const parsedArticles = ArticleMetadataArraySchema.parse(articles);

        cache.set(cacheKey, { data: parsedArticles, timestamp: Date.now() });

        return parsedArticles;
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