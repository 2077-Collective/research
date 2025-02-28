import { PUBLIC_GHOST_KEY, PUBLIC_GHOST_URL } from '$env/static/public';
import GhostContentAPI from '@tryghost/content-api';

if (!PUBLIC_GHOST_URL || !PUBLIC_GHOST_KEY) {
	throw new Error('Missing required environment variables');
}

export const ghostAPI = new GhostContentAPI({
	url: PUBLIC_GHOST_URL,
	key: PUBLIC_GHOST_KEY,
	version: 'v5.0'
});
