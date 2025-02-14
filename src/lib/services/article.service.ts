import { env } from '$env/dynamic/public';
import type { Article, ArticleMetadata, StrapiResponse, StrapiArticle } from '$lib/types/article';
import { logApiResponse } from '$lib/utils/api-logger';

const baseURL = env.PUBLIC_STRAPI_URL?.replace(/\/+$/, '') || '';
const apiToken = env.PUBLIC_STRAPI_API_TOKEN || '';

if (!baseURL || !apiToken) {
    throw new Error('Missing required environment variables: PUBLIC_STRAPI_URL and PUBLIC_STRAPI_API_TOKEN must be set');
}

const headers = {
    'Authorization': `Bearer ${apiToken}`,
    'Content-Type': 'application/json'
};

const cache = new Map<string, { data: ArticleMetadata[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

const isCacheValid = (timestamp: number): boolean => {
    return Date.now() - timestamp < CACHE_TTL;
};

const transformStrapiArticle = (articleData: { id: number; attributes?: StrapiArticle }): ArticleMetadata | null => {
    if (!articleData?.id || !articleData?.attributes) {
        console.warn('Invalid article data received:', articleData);
        return null;
    }

    const { id, attributes } = articleData;

    try {
        console.log('Transforming article:', {
            id,
            slug: attributes.slug,
            hasCategories: !!attributes.categories?.data,
            categoriesCount: attributes.categories?.data?.length
        });

        return {
            id: id.toString(),
            slug: attributes.slug || '',
            title: attributes.title || '',
            summary: attributes.summary || '',
            created_at: attributes.createdAt || new Date().toISOString(),
            updated_at: attributes.updatedAt || new Date().toISOString(),
            thumb_url: attributes.thumb?.data?.attributes?.url,
            thumb: attributes.thumb,
            categories: attributes.categories?.data?.map(cat => ({
                name: cat.attributes?.name || '',
                is_primary: cat.attributes?.is_primary || false
            })) || [],
            min_read: attributes.min_read || null,
            views: attributes.views || 0,
            isSponsored: attributes.isSponsored || false,
            sponsorColor: attributes.sponsorColor,
            sponsorTextColor: attributes.sponsorTextColor,
            authors: attributes.authors?.data?.map(author => ({
                username: author.attributes.username,
                full_name: author.attributes.full_name
            })) || []
        };
    } catch (error) {
        console.error('Error transforming article:', {
            error,
            id,
            attributes
        });
        return null;
    }
};

const transformToFullArticle = (articleData: { id: number; attributes?: StrapiArticle }): Article | null => {
    const metadata = transformStrapiArticle(articleData);

    if (!metadata || !articleData.attributes) return null;

    try {
        return {
            ...metadata,
            content: articleData.attributes.content || '',
            gpt_summary: articleData.attributes.gpt_summary,
            table_of_contents: articleData.attributes.table_of_contents || []
        };
    } catch (error) {
        console.error('Error transforming to full article:', {
            error,
            id: articleData.id,
            attributes: articleData.attributes
        });
        return null;
    }
};

export const fetchArticles = async (
    category?: string,
    page = 1,
    limit = 10
): Promise<ArticleMetadata[]> => {
    const cacheKey = `${category || 'all'}-${page}-${limit}`;

    if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (cached && isCacheValid(cached.timestamp)) {
            return cached.data;
        }
    }

    try {
        const url = new URL(`${baseURL}/api/articles`);
        url.searchParams.append('populate', '*');

        if (category) {
            url.searchParams.append('filters[categories][name][$eq]', category);
        }

        url.searchParams.append('pagination[page]', page.toString());
        url.searchParams.append('pagination[pageSize]', limit.toString());

        console.log('Fetching articles from:', url.toString());
        const response = await fetch(url.toString(), { headers });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: StrapiResponse<StrapiArticle> = await response.json();

        await logApiResponse(result, `fetch-articles-${category || 'all'}-page-${page}`);

        if (!result?.data) {
            console.warn('No data in response');
            return [];
        }

        const articles = result.data
            .map((article) => transformStrapiArticle(article))
            .filter((article: ArticleMetadata | null): article is ArticleMetadata => article !== null);

        await logApiResponse(result, `fetch-articles-transformed-${category || 'all'}-page-${page}`, articles);

        cache.set(cacheKey, { data: articles, timestamp: Date.now() });
        return articles;
    } catch (error) {
        console.error('Error fetching articles:', error);
        throw error;
    }
};

export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
    if (!slug?.trim()) {
        return null;
    }

    try {
        const url = new URL(`${baseURL}/api/articles`);
        url.searchParams.append('populate', '*');
        url.searchParams.append('filters[slug][$eq]', slug);

        console.log('Fetching article by slug:', url.toString());
        const response = await fetch(url.toString(), { headers });

        if (!response.ok) {
            return null;
        }

        const result: StrapiResponse<StrapiArticle> = await response.json();

        await logApiResponse(result, `get-article-${slug}`);

        if (!result?.data?.[0]) {
            return null;
        }

        const transformedArticle = transformToFullArticle(result.data[0]);

        if (transformedArticle) {
            await logApiResponse(result, `get-article-transformed-${slug}`, transformedArticle);
        }

        return transformedArticle;
    } catch (error) {
        console.error(`Error fetching article ${slug}:`, error);
        return null;
    }
};