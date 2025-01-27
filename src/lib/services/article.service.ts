import {
    ArticleMetadataArraySchema,
    FullArticleSchema,
    type Article,
    type ArticleMetadata
} from '$lib/types/article';

const baseURL = 'https://cms.2077.xyz/api';

// Cache for storing fetched articles
const cache = new Map();

export const fetchArticles = async (category?: string, page: number = 1, limit: number = 10): Promise<ArticleMetadata[]> => {
    // Generate a unique cache key based on category, page, and limit
    const cacheKey = `${category || 'all'}-${page}-${limit}`;

    // Return cached data if available
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }

    try {
        // Build the URL with optional category filtering and pagination
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

        // Parse and validate the articles
        const parsedArticles = ArticleMetadataArraySchema.parse(articles);

        // Cache the fetched articles
        cache.set(cacheKey, parsedArticles);

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