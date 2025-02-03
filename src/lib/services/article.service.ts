import type { Article, ArticleMetadata } from '$lib/types/article';
import { env } from '$env/dynamic/public';

const baseURL = env.PUBLIC_STRAPI_URL || 'http://localhost:1337';
const apiToken = env.PUBLIC_STRAPI_API_TOKEN;

const headers = {
    Authorization: `Bearer ${apiToken}`,
    'Content-Type': 'application/json',
};

export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
    try {
        if (!slug) {
            console.error('getArticleBySlug: No slug provided');
            return null;
        }

        // Build query
        const url = new URL(`${baseURL}/api/articles`);
        
        // full request details
        console.log('Request details:', {
            baseURL,
            fullURL: url.toString(),
            headers,
            params: {
                'filters[slug][$eq]': slug,
                'populate': '*'
            }
        });

        // Add query parameters
        url.searchParams.append('populate', '*');
        url.searchParams.append('filters[slug][$eq]', slug);

        //  the request
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers,
        });

        // Log full response details
        const responseText = await response.text();
        console.log('Raw Response details:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            body: responseText
        });

        if (!response.ok) {
            throw new Error(`Strapi API error: ${response.status} ${response.statusText}\nBody: ${responseText}`);
        }

        // Parse response
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Failed to parse response:', parseError);
            throw new Error('Invalid JSON response');
        }

        //  logging of parsed data
        console.log('Parsed data structure:', JSON.stringify(data, null, 2));

        if (!data) {
            console.error('No data in response');
            return null;
        }

        if (!data.data) {
            console.error('No data.data in response', data);
            return null;
        }

        if (!Array.isArray(data.data)) {
            console.error('data.data is not an array', data.data);
            return null;
        }

        if (data.data.length === 0) {
            console.log('No article found with slug:', slug);
            return null;
        }

        const article = data.data[0];
        
        if (!article) {
            console.error('First article is undefined', data.data);
            return null;
        }

        if (!article.attributes) {
            console.error('No attributes in article', article);
            return null;
        }

        // Transform Strapi format to  app's format
        const transformed = {
            id: article.id?.toString() || '',
            slug: article.attributes.slug,
            title: article.attributes.title,
            thumb: article.attributes.thumb?.data?.attributes?.url || '',
            categories: (article.attributes.categories?.data || []).map((cat: any) => ({
                name: cat.attributes?.name || '',
                is_primary: cat.attributes?.is_primary || false
            })),
            summary: article.attributes.summary || '',
            content: article.attributes.content || '',
            authors: (article.attributes.authors?.data || []).map((author: any) => ({
                username: author.attributes?.username || '',
                id: author.id?.toString() || '',
                full_name: author.attributes?.full_name || '',
                twitter_username: author.attributes?.twitter_username || null
            })),
            created_at: article.attributes.createdAt || new Date().toISOString(),
            updated_at: article.attributes.updatedAt || new Date().toISOString(),
            table_of_contents: article.attributes.table_of_contents || [],
            scheduled_publish_time: article.attributes.scheduled_publish_time || article.attributes.createdAt,
            gpt_summary: article.attributes.gpt_summary,
            views: article.attributes.views || 0,
            min_read: article.attributes.min_read || 5,
            is_sponsored: article.attributes.is_sponsored || false,
            sponsor_color: article.attributes.sponsor_color || '#FFFFFF',
            sponsor_text_color: article.attributes.sponsor_text_color || '#000000'
        };

        return transformed;
    } catch (error) {
        console.error('Comprehensive error in getArticleBySlug:', error);
        throw error;
    }
};