import { z } from 'zod';
import type { StrapiMedia } from './strapi';

// Zod schema for social links
const SocialLinksSchema = z.object({
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    website: z.string().optional()
});

// Zod schema for author
export const AuthorSchema = z.object({
    id: z.string(),
    username: z.string(),
    full_name: z.string(),
    bio: z.string().optional(),
    avatar_url: z.string().optional(),
    social_links: SocialLinksSchema.optional(),
    created_at: z.string(),
    updated_at: z.string()
});

// Author interface
export interface Author {
    id: string;
    username: string;
    full_name: string;
    bio?: string;
    avatar_url?: string;
    social_links?: {
        twitter?: string;
        linkedin?: string;
        github?: string;
        website?: string;
    };
    created_at: string;
    updated_at: string;
}

// Strapi Author interface
export interface StrapiAuthor {
    username: string;
    full_name: string;
    bio?: string;
    avatar?: StrapiMedia;
    social_links?: {
        twitter?: string;
        linkedin?: string;
        github?: string;
        website?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export type { StrapiMedia };