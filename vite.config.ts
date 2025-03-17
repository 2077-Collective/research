// import { sveltekit } from '@sveltejs/kit/vite';
// import { defineConfig } from 'vitest/config';

// export default defineConfig({
// 	plugins: [sveltekit()],
// 	test: {
// 		include: ['src/**/*.{test,spec}.{js,ts}']
// 	}
// });

import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import purgecss from 'vite-plugin-purgecss';
//import { defineConfig } from 'vitest/config';

export default defineConfig({
	build: {
		cssMinify: true,
		minify: 'esbuild', // Fastest minifier
		terserOptions: {
			compress: {
				drop_console: true // Removes console logs
			}
		}
	},
	plugins: [
		enhancedImages(),
		sveltekit(),
		purgecss({
			content: ['./src/**/*.{html,css,js,svelte,ts}']
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	ssr: {
		noExternal: ['svelte-lightbox']
	}
});
