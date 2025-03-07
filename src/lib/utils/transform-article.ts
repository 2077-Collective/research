import type { PostOrPage } from '@tryghost/content-api';
import { calculateReadingTime } from './calculate-read-time';
import { CATEGORIES_COLOR, TAGS_COLOR } from './tag-accent-colors';

export const transformArticle = (articleData: PostOrPage) => {
	if (!articleData?.id) {
		console.warn('Invalid article data received:', articleData);
		return null;
	}

	const { id } = articleData;

	const articleTags = articleData.tags || [];
	const tags = articleTags.filter((tag) => (tag.accent_color || '').toLowerCase() === TAGS_COLOR);
	const categories = articleTags.filter(
		(tag) => (tag.accent_color || '').toLowerCase() === CATEGORIES_COLOR
	);

	try {
		return {
			id: articleData.id || '',
			slug: articleData.slug || '',
			title: articleData.title || '',
			thumb_url: articleData.feature_image || '',
			thumb: {
				data: {
					attributes: {
						url: articleData.feature_image || ''
					}
				}
			},
			summary: articleData.excerpt || '',
			categories: categories.map((cat: any) => ({
				name: cat.name || '',
				is_primary: cat?.is_primary || false
			})),
			tags: tags.map((tag: any) => ({
				name: tag.name || ''
				// is_primary: cat?.is_primary || false
			})),
			authors: (articleData.authors || []).map((author: any) => ({
				username: author.slug || '',
				id: author.id || '',
				full_name: author.name || '',
				twitter_username: author.twitter || null
			})),
			created_at: articleData.published_at || new Date().toISOString(),
			updated_at: articleData.updated_at || new Date().toISOString(),
			min_read: articleData.reading_time || calculateReadingTime(articleData.html || ''),
			views: 0,
			isSponsored: false,
			sponsorColor: '',
			sponsorTextColor: ''
		};
	} catch (error) {
		console.error('Error transforming article:', {
			error,
			id
		});
		return null;
	}
};

export const transformToFullArticle = (articleData: PostOrPage) => {
	if (!articleData.id) return null;
	const articleTags = articleData.tags || [];
	const tags = articleTags.filter((tag) => (tag.accent_color || '').toLowerCase() === TAGS_COLOR);
	const categories = articleTags.filter(
		(tag) => (tag.accent_color || '').toLowerCase() === CATEGORIES_COLOR
	);

	try {
		return {
			id: articleData.id || '',
			slug: articleData.slug || '',
			title: articleData.title || '',
			thumb_url: articleData.feature_image || '',
			thumb: {
				data: {
					attributes: {
						url: articleData.feature_image || ''
					}
				}
			},
			summary: articleData.excerpt || '',
			categories: categories.map((cat: any) => ({
				name: cat.name || '',
				is_primary: cat?.is_primary || false
			})),
			tags: tags.map((tag: any) => ({
				name: tag.name || ''
				// is_primary: cat?.is_primary || false
			})),
			authors: (articleData.authors || []).map((author: any) => ({
				username: author.slug || '',
				id: author.id || '',
				full_name: author.name || '',
				twitter_username: author.twitter || null
			})),
			created_at: articleData.published_at || new Date().toISOString(),
			updated_at: articleData.updated_at || new Date().toISOString(),
			min_read: articleData.reading_time || calculateReadingTime(articleData.html || ''),
			views: 0,
			isSponsored: false,
			sponsorColor: '',
			sponsorTextColor: '',
			content: articleData.html || '',
			gpt_summary: articleData.custom_excerpt,
			table_of_contents: []
		};
	} catch (error) {
		console.error('Error transforming to full article:', {
			error,
			id: articleData.id
		});
		return null;
	}
};
