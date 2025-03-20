import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
//import { defineConfig } from 'vitest/config';

export default defineConfig({
	// build: {
	// 	cssMinify: true,
	// 	minify: 'esbuild', // Fastest minifier
	// 	terserOptions: {
	// 		compress: {
	// 			drop_console: true // Removes console logs
	// 		}
	// 	}
	// },
	plugins: [enhancedImages(), sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	ssr: {
		noExternal: ['svelte-lightbox']
	}
});
