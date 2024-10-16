import { z } from 'zod';

// Define Zod schemas

const AuthorSchema = z.object({
	id: z.string(),
	username: z.string(),
	full_name: z.string(),
	bio: z.string(),
	twitter_username: z.string().optional()
});

const CategorySchema = z.object({
	id: z.string(),
	name: z.string()
});

const TableOfContentsItemSchema: z.ZodType<{
	title: string;
	id: string;
	children?: {
		title: string;
		id: string;
		children?: any[];
	}[];
}> = z.object({
	title: z.string(),
	id: z.string(),
	children: z.array(z.lazy(() => TableOfContentsItemSchema)).optional()
});

export const ArticleSchema = z.object({
	id: z.string(),
	title: z.string(),
	authors: z.array(z.object({ username: z.string(), full_name: z.string() })).optional(),
	content: z.string().optional(),
	views: z.string().optional(),
	summary: z.string(),
	categories: z.array(CategorySchema),
	thumb: z.string(),
	slug: z.string()
});

// Schema for full article details
const ArticleDetailSchema = z.object({
	id: z.string(),
	slug: z.string(),
	title: z.string(),
	authors: z.array(AuthorSchema),
	thumb: z.string(),
	categories: z.array(CategorySchema),
	summary: z.string(),
	acknowledgement: z.string().optional(),
	content: z.string(),
	min_read: z.number(),
	status: z.string(),
	views: z.number(),
	created_at: z.string(),
	updated_at: z.string(),
	scheduled_publish_time: z.string(),
	table_of_contents: z.array(TableOfContentsItemSchema).optional()
});

// Response schemas
export const ArticleListResponseSchema = z.array(ArticleSchema);
export const ArticleDetailResponseSchema = z.object({
	success: z.boolean(),
	data: ArticleDetailSchema
});

export type ArticleListItem = z.infer<typeof ArticleSchema>;
export type ArticleDetail = z.infer<typeof ArticleDetailSchema>;
export type ArticleListResponse = z.infer<typeof ArticleListResponseSchema>;
export type ArticleDetailResponse = z.infer<typeof ArticleDetailResponseSchema>;
export const ArticleArraySchema = z.array(ArticleSchema);
export type Article = z.infer<typeof ArticleSchema>;
