import { cache, isCacheValid } from '$lib/utils/cache';
import { ghostAPI } from '$lib/utils/ghost';
import { transformArticle } from '$lib/utils/transform-article';

export const fetchGhostArticles = async (
	category?: string,
	page = 1,
	limit = 15,
	bookmarks?: string[]
) => {
	const cacheKey = `${category || 'all'}-${page || 1}-${limit}`;

	if (cache.has(cacheKey)) {
		const cached = cache.get(cacheKey);
		if (cached && isCacheValid(cached.timestamp)) {
			return cached.data;
		}
	}

	try {
		const posts = await ghostAPI.posts.browse({
			limit,
			include: ['authors', 'tags'],
			page,
			...(category && { filter: `tag:${category}` }),
			...((bookmarks || []).length > 0 && { filter: `slug:[${bookmarks}]` })
		});

		if (!posts) {
			return [];
		}

		const articles = posts
			.map((article) => transformArticle(article))
			.filter((article) => article !== null);

		cache.set(cacheKey, { data: articles, timestamp: Date.now() });

		return articles;
	} catch (error) {
		console.error('Error in fetchArticles:', error);
		throw error;
	}
};

async function fetchPostByTag(tagSlug: string) {
	const posts = await ghostAPI.posts.browse({
		filter: `tag:${tagSlug.toLowerCase().split(' ').join('-')}`,
		limit: 1,
		include: ['authors', 'tags']
	});

	return posts.length ? posts[0] : null;
}

export const fetchGhostArticlesFilters = async (categories: string[], page = 1, limit = 6) => {
	const cacheKey = `${categories.join(',') || 'all'}-${page || 1}-${limit}`;

	if (cache.has(cacheKey)) {
		const cached = cache.get(cacheKey);
		if (cached && isCacheValid(cached.timestamp)) {
			return cached.data;
		}
	}

	try {
		const result = await Promise.all(
			categories.map(async (cat) => {
				const post = fetchPostByTag(cat);

				return post;
			})
		);

		const posts = result.filter((r) => r !== null);

		if (!posts) {
			return [];
		}

		const articles = posts
			.map((article) => transformArticle(article))
			.filter((article) => article !== null);

		cache.set(cacheKey, { data: articles, timestamp: Date.now() });

		return articles;
	} catch (error) {
		console.error('Error in fetchArticles:', error);
		throw error;
	}
};

export const createGhostMember = async (email: string, name: string = '', subscribedToEmails: boolean = true) => {
	try {
		const response = await fetch('/api/ghost', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				action: 'createMember',
				payload: {
					email,
					name,
					subscribedToEmails
				}
			})
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(`Failed to create Ghost member: ${errorData.error || response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error creating Ghost member:', error);
		throw error;
	}
};

export const getGhostMember = async (email: string) => {
	try {
		const response = await fetch('/api/ghost', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				action: 'getMember',
				payload: {
					email
				}
			})
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(`Failed to get Ghost member: ${errorData.error || response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error getting Ghost member:', error);
		throw error;
	}
};

export const updateGhostMember = async (id: string, updates: any) => {
	try {
		const response = await fetch('/api/ghost', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				action: 'updateMember',
				payload: {
					id,
					updates
				}
			})
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(`Failed to update Ghost member: ${errorData.error || response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error updating Ghost member:', error);
		throw error;
	}
};

export const deleteGhostMember = async (id: string) => {
	try {
		const response = await fetch('/api/ghost', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				action: 'deleteMember',
				payload: {
					id
				}
			})
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(`Failed to delete Ghost member: ${errorData.error || response.statusText}`);
		}

		const result = await response.json();
		return result.success;
	} catch (error) {
		console.error('Error deleting Ghost member:', error);
		throw error;
	}
};