
import { env } from '$env/dynamic/public';
import type { Article, ArticleMetadata } from '$lib/types/article';
import { ArticleMetadataArraySchema, FullArticleSchema } from '$lib/types/article';

const baseURL = env.PUBLIC_STRAPI_URL || 'http://localhost:1337';
const apiToken = env.PUBLIC_STRAPI_API_TOKEN;

const headers = {
    Authorization: `Bearer ${apiToken}`,
    'Content-Type': 'application/json',
};

// export const fetchArticles = async (category?: string, page = 1, limit = 10) => {
//     try {
    
//         const queryParams = new URLSearchParams({
//             'populate': '*'  
//         });

//         if (category) {
//             queryParams.append('filters[categories][name][$eq]', category.toLowerCase());
//         }

//         console.log('Fetching articles with:', {
//             url: `${baseURL}/api/articles?${queryParams.toString()}`,
//             headers,
//             category,
//             page,
//             limit
//         });

//         const res = await fetch(
//             `${baseURL}/api/articles?${queryParams.toString()}`,
//             { headers }
//         );

//         if (!res.ok) {
//             const errorText = await res.text();
//             console.error('Error response:', {
//                 status: res.status,
//                 statusText: res.statusText,
//                 body: errorText
//             });
//             throw new Error(`Failed to fetch articles: ${res.status} ${res.statusText}\nResponse: ${errorText}`);
//         }

//         const body = await res.json();
//         console.log('Received response:', body);

//         // Transform and validate the data
//         const articles = body.data.map((article: any) => ({
//             id: article.id.toString(),
//             slug: article.attributes.slug || '',
//             title: article.attributes.title || '',
//             thumb: article.attributes.thumb?.data?.attributes?.url || '',
//             summary: article.attributes.summary || '',
//             content: article.attributes.content || '',
//             categories: (article.attributes.categories?.data || []).map((cat: any) => ({
//                 name: cat.attributes.name,
//                 is_primary: cat.attributes.is_primary || false
//             })),
//             authors: (article.attributes.authors?.data || []).map((author: any) => ({
//                 username: author.attributes.username,
//                 id: author.id.toString(),
//                 full_name: author.attributes.full_name,
//                 twitter_username: author.attributes.twitter_username
//             })),
//             created_at: article.attributes.createdAt,
//             updated_at: article.attributes.updatedAt
//         }));

//         return ArticleMetadataArraySchema.parse(articles);
//     } catch (error) {
//         console.error('Error in fetchArticles:', error);
//         throw error;
//     }
// };

// export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
//     try {
//         const queryParams = new URLSearchParams({
//             'filters[slug][$eq]': slug,
//             'populate': '*'
//         });

//         console.log('Fetching article by slug:', {
//             url: `${baseURL}/api/articles?${queryParams.toString()}`,
//             slug
//         });

//         const res = await fetch(
//             `${baseURL}/api/articles?${queryParams.toString()}`,
//             { headers }
//         );

//         if (!res.ok) {
//             const errorText = await res.text();
//             console.error('Error fetching article:', {
//                 status: res.status,
//                 statusText: res.statusText,
//                 body: errorText
//             });
//             throw new Error(`Failed to fetch article: ${res.status} ${res.statusText}`);
//         }

//         const body = await res.json();
        
//         if (!body.data?.[0]) {
//             return null;
//         }

//         const article = body.data[0];
//         const transformedArticle = {
//             id: article.id.toString(),
//             slug: article.attributes.slug || '',
//             title: article.attributes.title || '',
//             thumb: article.attributes.thumb?.data?.attributes?.url || '',
//             summary: article.attributes.summary || '',
//             content: article.attributes.content || '',
//             categories: (article.attributes.categories?.data || []).map((cat: any) => ({
//                 name: cat.attributes.name,
//                 is_primary: cat.attributes.is_primary || false
//             })),
//             authors: (article.attributes.authors?.data || []).map((author: any) => ({
//                 username: author.attributes.username,
//                 id: author.id.toString(),
//                 full_name: author.attributes.full_name,
//                 twitter_username: author.attributes.twitter_username
//             })),
//             created_at: article.attributes.createdAt,
//             updated_at: article.attributes.updatedAt,
//             table_of_contents: article.attributes.table_of_contents || [],
//             scheduled_publish_time: article.attributes.scheduledPublishTime || article.attributes.createdAt
//         };

//         return FullArticleSchema.parse(transformedArticle);
//     } catch (error) {
//         console.error(`Error fetching article ${slug}:`, error);
//         return null;
//     }
// };

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