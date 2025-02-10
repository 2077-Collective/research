import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { BEEHIIV_API_KEY, BEEHIIV_PUBLICATION_ID } from '$env/static/private';

interface BeehiivPost {
    id: string;
    title: string;
    subtitle?: string;
    authors: string[];
    created: number;
    status: string;
    publish_date: number | null;
    displayed_date: number | null;
    split_tested: boolean;
    subject_line: string;
    preview_text: string;
    slug: string;
    thumbnail_url: string;
    web_url: string;
    audience: string;
    platform: string;
    content_tags: string[];
    meta_default_description: string | null;
    meta_default_title: string | null;
    hidden_from_feed: boolean;
}

interface BeehiivResponse {
    data: BeehiivPost[];
    page: number;
    limit: number;
    total_results: number;
    total_pages: number;
}

interface BeehiivErrorResponse {
    errors?: Array<{ message: string }>;
}

const EXCLUDED_TITLES = ['welcome to ethereum navigator'];

const isValidPost = (post: BeehiivPost): boolean => {
    return (
        post.status === 'confirmed' &&
        !post.hidden_from_feed &&
        post.publish_date !== null &&
        !EXCLUDED_TITLES.some(title => 
            post.title.toLowerCase().includes(title.toLowerCase())
        )
    );
};

const comparePosts = (a: BeehiivPost, b: BeehiivPost): number => {
    const dateA = a.publish_date ?? 0;
    const dateB = b.publish_date ?? 0;
    return dateB - dateA;
};

const logError = (context: string, error: unknown, additionalInfo?: Record<string, unknown>) => {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(`Error in ${context}:`, {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString(),
        ...additionalInfo
    });
    return err;
};

export const load: PageServerLoad = async () => {
    try {
        const response = await fetch(
            `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/posts`,
            {
                headers: {
                    'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                signal: AbortSignal.timeout(5000)
            }
        );

        if (!response.ok) {
            const errorData = await response.json() as BeehiivErrorResponse;
            const apiError = logError('Beehiiv API', new Error('API request failed'), {
                status: response.status,
                statusText: response.statusText,
                errors: errorData.errors
            });
            
            throw error(response.status, 
                errorData.errors?.[0]?.message || 'Failed to fetch posts'
            );
        }

        const data: BeehiivResponse = await response.json();
        
        const filteredAndSortedPosts = data.data
            .filter(isValidPost)
            .sort(comparePosts);

        return { posts: filteredAndSortedPosts };
        
    } catch (err) {
        const handledError = logError('newsletter content fetch', err, {
            endpoint: 'posts',
            publicationId: BEEHIIV_PUBLICATION_ID
        });

        throw error(500, 'Failed to load newsletter content');
    }
};