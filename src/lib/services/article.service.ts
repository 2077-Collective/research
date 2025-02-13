import type { Article } from '$lib/types/article';
import { env } from '$env/dynamic/public';

const baseURL = env.PUBLIC_STRAPI_URL || 'https://honest-chickens-78ad1f61fe.strapiapp.com';
const apiToken = env.PUBLIC_STRAPI_API_TOKEN;

const headers = {
    Authorization: `Bearer ${apiToken}`,
    'Content-Type': 'application/json',
};

export const fetchArticles = async (): Promise<Article[]> => {
    try {
        const url = new URL(`${baseURL}/api/articles`);
        url.searchParams.append('populate', '*');
        
        const response = await fetch(url.toString(), { headers });
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        
        const data = await response.json();
        return data?.data?.map(transformArticle) || [];
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
};

export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
    try {
        if (!slug) return null;
        
        const url = new URL(`${baseURL}/api/articles`);
        url.searchParams.append('populate', '*');
        url.searchParams.append('filters[slug][$eq]', slug);

        const response = await fetch(url.toString(), { headers });
        const data = await response.json();

        return data?.data?.[0] ? transformArticle(data.data[0]) : null;
    } catch (error) {
        console.error('Error in getArticleBySlug:', error);
        return null;
    }
};

const transformArticle = (article: any): Article => {
    const attrs = article;
    return {
        id: attrs.id?.toString() || '',
        slug: attrs.slug || '',
        title: attrs.title || '',
        thumb: attrs.thumb?.data?.attributes?.url || '',
        categories: (attrs.categories?.data || []).map((cat: any) => ({
            name: cat.attributes?.name || '',
            is_primary: cat.attributes?.is_primary || false
        })),
        summary: attrs.summary || '',
        content: attrs.content || '',
        authors: (attrs.authors?.data || []).map((author: any) => ({
            username: author.attributes?.username || '',
            id: author.id?.toString() || '',
            full_name: author.attributes?.full_name || '',
            twitter_username: author.attributes?.twitter_username || null
        })),
        created_at: attrs.createdAt || new Date().toISOString(),
        updated_at: attrs.updatedAt || new Date().toISOString(),
        table_of_contents: attrs.table_of_contents || [],
        scheduled_publish_time: attrs.scheduled_publish_time || attrs.createdAt,
        gpt_summary: attrs.gpt_summary,
        views: attrs.views || 0,
        min_read: attrs.min_read || 5,
        is_sponsored: attrs.is_sponsored || false,
        sponsor_color: attrs.sponsor_color || '#FFFFFF',
        sponsor_text_color: attrs.sponsor_text_color || '#000000'
    };
};