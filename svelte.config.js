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
                    'https://embeds.beehiiv.com',
                    'https://www.beehiiv.com',
                ],
                'img-src': ['self', 'data:', 'https:', 'https://*.beehiiv.com'],
                'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com', 'https://*.beehiiv.com'],
                'font-src': ['self', 'https://fonts.gstatic.com', 'https://*.beehiiv.com'],
                'connect-src': ['self', 'https:', 'https://*.beehiiv.com'],
                'default-src': ['self', 'https://*.beehiiv.com'],
                'frame-ancestors': ['self'],
                'base-uri': ['self'],
                'frame-src': [
                    'self', 
                    'https://elevenlabs.io', 
                    'https://embeds.beehiiv.com',
                    'https://www.beehiiv.com',
                    'https://*.beehiiv.com'
                ]
            }
        }
    }
};

export default config;