// import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
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
					'https://fonts.googleapis.com'
				],
				'img-src': ['self', 'data:', 'https:'],
				'style-src': ['self', 'unsafe-inline'],
				'connect-src': ['self', 'https:'],
				'default-src': ['self'],
				'frame-ancestors': ['self'],
				'base-uri': ['self'],
				'frame-src': ['https://elevenlabs.io']
			}
		}
	}
};

export default config;
