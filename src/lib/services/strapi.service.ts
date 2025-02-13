
import { env } from '$env/dynamic/public';
import type { Article, ArticleMetadata } from '$lib/types/article';
import { ArticleMetadataArraySchema, FullArticleSchema } from '$lib/types/article';

const baseURL = env.PUBLIC_STRAPI_URL || 'https://honest-chickens-78ad1f61fe.strapiapp.com';
const apiToken = env.PUBLIC_STRAPI_API_TOKEN;

const headers = {
    Authorization: `Bearer ${apiToken}`,
    'Content-Type': 'application/json',
};

export const fetchArticles = async (category?: string, page = 1, limit = 10) => {
    try {
        if (!baseURL) {
            throw new Error('STRAPI_URL is not configured');
        }

        const queryParams = new URLSearchParams({
            'populate': '*'  
        });

        if (category) {
            queryParams.append('filters[categories][name][$eq]', category.toLowerCase());
        }

        const res = await fetch(
            `${baseURL}/api/articles?${queryParams.toString()}`,
            { headers }
        );

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error response:', {
                status: res.status,
                statusText: res.statusText,
                body: errorText
            });
            throw new Error(`Failed to fetch articles: ${res.status} ${res.statusText}`);
        }

        const body = await res.json();
        
        // Add validation
        if (!body || !body.data) {
            console.error('Invalid response structure:', body);
            throw new Error('Invalid response structure from Strapi');
        }

        if (!Array.isArray(body.data)) {
            console.error('Response data is not an array:', body.data);
            throw new Error('Invalid response data format from Strapi');
        }

        // Transform and validate the data
        const articles = body.data.map((article: any) => {
            if (!article || !article.attributes) {
                console.warn('Invalid article structure:', article);
                return null;
            }

            return {
                id: article.id?.toString() || '',
                slug: article.attributes?.slug || '',
                title: article.attributes?.title || '',
                thumb: article.attributes?.thumb?.data?.attributes?.url || '',
                summary: article.attributes?.summary || '',
                content: article.attributes?.content || '',
                categories: (article.attributes?.categories?.data || []).map((cat: any) => ({
                    name: cat.attributes?.name || '',
                    is_primary: cat.attributes?.is_primary || false
                })),
                authors: (article.attributes?.categories?.data || []).map((author: any) => ({
                    username: author.attributes?.username || '',
                    id: author.id?.toString() || '',
                    full_name: author.attributes?.full_name || '',
                    twitter_username: author.attributes?.twitter_username || null
                })),
                created_at: article.attributes?.createdAt || new Date().toISOString(),
                updated_at: article.attributes?.updatedAt || new Date().toISOString()
            };
        }).filter(Boolean); // Remove any null entries

        return ArticleMetadataArraySchema.parse(articles);
    } catch (error) {
        console.error('Error in fetchArticles:', error);
        throw error;
    }
};