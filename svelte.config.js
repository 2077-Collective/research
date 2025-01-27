import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			maxDuration: 300
		}),
		csp: {
			mode: 'auto',
			directives: {
				'script-src': [
					'self',
					'https://www.googletagmanager.com',
					'https://vercel.live',
					'https://va.vercel-scripts.com',
					'https://elevenlabs.io',
					'https://fonts.googleapis.com',
					'https://embeds.beehiiv.com'
				],
				'img-src': ['self', 'data:', 'https:'],
				'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
				'font-src': ['self', 'https://fonts.gstatic.com'],
				'connect-src': ['self', 'https:', 'https://embeds.beehiiv.com'],
				'default-src': ['self'],
				'frame-ancestors': ['self'],
				'base-uri': ['self'],
				'frame-src': ['self', 'https://elevenlabs.io', 'https://embeds.beehiiv.com']
			}
		}
	}
};

export default config;