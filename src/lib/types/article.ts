import { z } from 'zod';

export interface StrapiResponse<T> {
    data: Array<{
        id: number;
        attributes: T;
    }>;
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export interface ThumbData {
    data?: {
        attributes: {
            url: string;
        };
    };
}

// Define the schemas
const ThumbDataSchema = z.object({
    data: z.object({
        attributes: z.object({
            url: z.string()
        })
    }).optional()
});

const CategorySchema = z.object({
    name: z.string(),
    is_primary: z.boolean()
});

const AuthorSchema = z.object({
    username: z.string(),
    full_name: z.string().optional(),
    id: z.string().optional(),
    twitter_username: z.string().nullable().optional()
});

export const ArticleMetadataSchema = z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    summary: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    thumb_url: z.string().optional(),
    thumb: z.union([z.string(), ThumbDataSchema]).optional(),
    categories: z.array(CategorySchema),
    min_read: z.number().nullable().optional(),
    views: z.number(),
    isSponsored: z.boolean().optional(),
    sponsorColor: z.string().optional(),
    sponsorTextColor: z.string().optional(),
    authors: z.array(AuthorSchema).optional()
});

export const ArticleMetadataArraySchema = z.array(ArticleMetadataSchema);

const TableOfContentsItemSchema: z.ZodType<any> = z.lazy(() => 
    z.object({
        id: z.string(),
        title: z.string(),
        children: z.array(TableOfContentsItemSchema)
    })
);

export const FullArticleSchema = ArticleMetadataSchema.extend({
    content: z.string(),
    gpt_summary: z.string().optional(),
    table_of_contents: z.array(TableOfContentsItemSchema)
});

export interface ArticleMetadata {
    id: string;
    slug: string;
    title: string;
    summary: string;
    created_at: string;
    updated_at: string;
    thumb_url?: string;
    thumb?: string | ThumbData;
    categories: Array<{
        name: string;
        is_primary: boolean;
    }>;
    min_read?: number | null;
    views: number;
    isSponsored?: boolean;
    sponsorColor?: string;
    sponsorTextColor?: string;
    authors?: Array<{
        username: string;
        full_name?: string;
    }>;
}

export interface Article extends ArticleMetadata {
    content: string;
    gpt_summary?: string;
    table_of_contents: Array<{
        id: string;
        title: string;
        children: Array<{
            id: string;
            title: string;
            children: any[];
        }>;
    }>;
}

export interface StrapiArticle {
    slug: string;
    title: string;
    summary: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    article_status: string;
    thumb?: ThumbData;
    categories: {
        data: Array<{
            attributes: {
                name: string;
                is_primary: boolean;
            };
        }>;
    };
    gpt_summary?: string;
    views: number;
    min_read: number | null;
    table_of_contents: Array<{
        id: string;
        title: string;
        children: Array<{
            id: string;
            title: string;
            children: any[];
        }>;
    }>;
    isSponsored?: boolean;
    sponsorColor?: string;
    sponsorTextColor?: string;
    authors?: {
        data: Array<{
            attributes: {
                username: string;
                full_name?: string;
            };
        }>;
    };
}