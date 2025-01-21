import {
    ArticleMetadataArraySchema,
    FullArticleSchema,
    type Article,
    type ArticleMetadata
} from '$lib/types/article';

const baseURL = 'https://cms.2077.xyz/api';

export const fetchArticles = async (): Promise<ArticleMetadata[]> => {
    const res = await fetch(`${baseURL}/articles/`);
    const body = await res.json();
    return ArticleMetadataArraySchema.parse(body);
};

export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
    console.log(`Fetching article: ${slug}`);
    try {
        const res = await fetch(`${baseURL}/articles/${slug}/`);
        const body = await res.json();
        return FullArticleSchema.parse(body.data);
    } catch (error) {
        console.error(`Error fetching article ${slug}:`, error); 
        return null;
    }
};