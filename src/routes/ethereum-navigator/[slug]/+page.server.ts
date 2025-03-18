import { BEEHIIV_API_KEY, BEEHIIV_PUBLICATION_ID } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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
	content?: {
		free?: {
			web?: string;
			email?: string;
			rss?: string;
		};
		premium?: {
			web?: string;
			email?: string;
		};
	};
}

export const load: PageServerLoad = async ({ params }) => {
	try {
		console.log('Starting load function with params:', params);

		const postsResponse = await fetch(
			`https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/posts`,
			{
				headers: {
					Authorization: `Bearer ${BEEHIIV_API_KEY}`,
					Accept: 'application/json'
				}
			}
		);

		if (!postsResponse.ok) {
			console.error('Posts API call failed:', postsResponse.status, postsResponse.statusText);
			throw error(postsResponse.status, 'Failed to fetch posts');
		}

		const postsData = await postsResponse.json();
		const postInfo = postsData.data.find((p: BeehiivPost) => p.slug === params.slug);

		if (!postInfo) {
			console.error('Post not found for slug:', params.slug);
			throw error(404, 'Post not found');
		}

		console.log('Found post with ID:', postInfo.id);

		const postResponse = await fetch(
			`https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/posts/${postInfo.id}?expand=free_web_content`,
			{
				headers: {
					Authorization: `Bearer ${BEEHIIV_API_KEY}`,
					Accept: 'application/json'
				}
			}
		);

		if (!postResponse.ok) {
			throw error(postResponse.status, 'Failed to fetch post content');
		}

		const postData = await postResponse.json();
		const post = postData.data;

		const webContent = post.content?.free?.web || null;

		const finalPost = {
			...post,
			content: webContent
		};

		console.log('Final post structure:', {
			has_id: !!finalPost.id,
			has_title: !!finalPost.title,
			has_content: !!finalPost.content,
			has_web_url: !!finalPost.web_url,
			has_thumbnail: !!finalPost.thumbnail_url,
			has_authors: Array.isArray(finalPost.authors) && finalPost.authors.length > 0,
			content_length: finalPost.content?.length || 0
		});

		return { post: finalPost };
	} catch (err) {
		console.error('Error in load function:', err);
		if (err instanceof Error) {
			console.error('Error details:', err.message);
		}
		throw error(500, 'Failed to load post');
	}
};
