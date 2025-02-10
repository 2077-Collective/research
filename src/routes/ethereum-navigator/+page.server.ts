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

export const load: PageServerLoad = async () => {
    try {
        const response = await fetch(
            `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/posts`,
            {
                headers: {
                    'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Beehiiv API Error:', {
                status: response.status,
                statusText: response.statusText,
                errors: errorData.errors
            });
            
            throw error(response.status, {
                message: errorData.errors?.[0]?.message || 'Failed to fetch posts'
            });
        }

        const data: BeehiivResponse = await response.json();
        
        // Filter and sort posts
        const filteredAndSortedPosts = data.data
            .filter(post => 
                post.status === 'confirmed' && 
                !post.hidden_from_feed &&
                post.publish_date &&
                !post.title.toLowerCase().includes('welcome to ethereum navigator'))
            .sort((a, b) => {
                if (!a.publish_date || !b.publish_date) return 0;
                return b.publish_date - a.publish_date;
            });

        return { posts: filteredAndSortedPosts };
        
    } catch (err) {
        console.error('Error fetching posts:', err);
        throw error(500, {
            message: 'Failed to load newsletter content'
        });
    }
};