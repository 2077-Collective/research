<script lang="ts">
	import { browser } from '$app/environment';
	import { ArrowLeft } from 'lucide-svelte';
	import { algoliasearch } from 'algoliasearch';
	import instantsearch from 'instantsearch.js';
	import { searchBox, hits, configure, pagination } from 'instantsearch.js/es/widgets';
	import type { Widget } from 'instantsearch.js';

	// Initialize the search client properly
	const searchClient = algoliasearch(
		import.meta.env.VITE_ALGOLIA_APP_ID,
		import.meta.env.VITE_ALGOLIA_SEARCH_KEY
	);

	// Create the InstantSearch instance
	const instantSearch = instantsearch({
		indexName: 'Article',
		searchClient
	});

	const loadingWidget: Widget = {
		$$type: 'loading',
		$$widgetType: 'loading',
		render({ status }) {
			if (status === 'loading') {
				const hitsContainer = document.querySelector('#hits');
				if (hitsContainer) {
					hitsContainer.innerHTML = Array(6).fill(cardSkeleton()).join('');
				}
			}
		}
	};

	// Start InstantSearch when the component mounts
	$effect(() => {
		if (browser) {
			instantSearch.addWidgets([
				searchBox({
					container: '#searchbox',
					placeholder: 'Search...',
					cssClasses: {
						input: 'placeholder:text-gray-500 text-white',
						form: 'relative'
					}
				}),
				hits({
					container: '#hits',
					cssClasses: {
						list: '!flex !flex-col gap-8 max-w-7xl mx-auto',
						item: 'h-full'
					},
					templates: {
						empty: 'No results found',
						item(hit) {
							return `
								<a href="/${hit.slug}" class="block h-full">
									<div class="flex flex-col md:flex-row gap-4 md:gap-8 h-full overflow-hidden shadow-sm hover:shadow-md transition-shadow p-4 md:p-6 rounded-lg">
										<div class="w-full md:w-80 h-48 md:h-56 flex-shrink-0">
											<img src="${hit.thumb_url}" alt="" class="w-full h-full object-cover rounded-lg" loading="lazy" />
										</div>

										<div class="flex flex-col flex-grow">
											<div class="flex gap-1 items-start w-full text-sm leading-none tracking-wide mb-4">
												<span class="font-mono font-bold text-xs border-white/20 px-2 py-1 rounded-md bg-primary/10 text-primary ring-1 ring-inset ring-primary/20 cursor-pointer hover:bg-primary hover:text-accent transition-colors duration-200">
													${hit.categories[0]?.name || ''}
												</span>
											</div>
											<p class="font-soehne text-xl md:text-2xl font-medium leading-tight tracking-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
												${instantsearch.highlight({ hit, attribute: 'title' })}
											</p>
											<p class="font-mono mt-2 text-sm text-gray-600 dark:text-gray-400 font-medium tracking-normal">
												By ${hit.authors
													?.map(
														(author: { full_name?: string; username: string }) =>
															author.full_name || author.username
													)
													.join(', ')}
											</p>
											<p class="text-gray-600 font-soehne mt-3 md:mt-4 text-sm font-medium leading-relaxed tracking-tight line-clamp-8 md:line-clamp-4">
												${instantsearch.snippet({ hit, attribute: 'content_excerpt' })}
											</p>
										</div>
									</div>
								</a>
							`;
						}
					}
				}),
				configure({
					hitsPerPage: 8
				}),
				pagination({
					container: '#pagination'
				}),
				loadingWidget
			]);

			instantSearch.start();
		}
	});
</script>

<div>
	<div class="flex items-center gap-3 mb-4 md:mb-8 mt-6">
		<a
			href="/"
			aria-label="Back to Home"
			class="flex gap-2 justify-center items-center px-2 w-10 h-10 border border-solid rounded-full bg-background/80 hover:bg-background"
		>
			<ArrowLeft class="w-6 h-6" />
		</a>
		<h2
			id="latest-research"
			class="text-3xl md:text-5xl font-medium leading-9 font-soehne tracking-tight"
		>
			Latest Research
		</h2>
	</div>
</div>

<div class="flex flex-col justify-end md:flex-row gap-2 border-y py-4 md:py-6 mb-4 md:mb-12">
	<div id="searchbox" class="w-full max-w-md"></div>
</div>
<div id="hits" class="mb-6"></div>
<div id="pagination" class="mb-8"></div>

{#snippet cardSkeleton()}
	<div class="flex flex-col justify-center h-fit animate-pulse">
		<div class="flex flex-col w-full">
			<div class="aspect-square w-full bg-gray-200 rounded-md"></div>
		</div>
		<div class="flex flex-col py-6 w-full space-y-4">
			<div class="flex gap-1 items-start w-full text-sm tracking-wide">
				<div class="w-16 h-6 bg-gray-200 rounded-md"></div>
				<div class="w-16 h-6 bg-gray-200 rounded-md"></div>
			</div>
			<div class="h-8 bg-gray-200 w-3/4 rounded-md tracking-tight"></div>
			<div class="h-4 bg-gray-200 w-full rounded-md tracking-normal"></div>
			<div class="h-4 bg-gray-200 w-5/6 rounded-md tracking-normal"></div>
			<div class="h-4 bg-gray-200 w-1/2 rounded-md tracking-normal"></div>
		</div>
	</div>
{/snippet}

<style>
	/* Search box styling */
	:global(.ais-SearchBox-form) {
		@apply relative flex w-full max-w-md;
	}

	:global(.ais-SearchBox-input) {
		@apply w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary;
	}

	/* Search box styling */
	:global(.ais-SearchBox-submit),
	:global(.ais-SearchBox-reset) {
		@apply hidden;
	}

	/* Hits (results) styling */
	:global(.ais-Hits-list) {
		@apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 md:gap-y-10 gap-x-6 justify-center;
	}

	:global(.ais-Hits-item) {
		@apply h-full transition-all hover:scale-[1.02] duration-300;
	}

	:global(.ais-Hits-item img) {
		@apply transition-transform duration-300;
	}

	:global(.ais-Hits-item:hover img) {
		@apply scale-105;
	}

	/* Highlight styling */
	:global(.ais-Highlight-highlighted) {
		@apply bg-primary/20 text-primary font-medium;
	}

	/* Pagination styling */
	:global(.ais-Pagination) {
		@apply flex justify-center mt-8;
	}

	:global(.ais-Pagination-list) {
		@apply flex gap-2;
	}

	:global(.ais-Pagination-item) {
		@apply px-3 py-1 border rounded-lg hover:bg-primary hover:text-black transition-colors duration-200;
	}

	:global(.ais-Pagination-link) {
		@apply block w-full h-full;
	}

	:global(.ais-Pagination-item--selected) {
		@apply bg-primary text-black border-primary;
	}

	:global(.ais-Pagination-item--disabled) {
		@apply opacity-50 cursor-not-allowed;
	}

	/* Update skeleton styles */
	:global(.ais-Hits-list--empty) {
		@apply text-center py-8 text-gray-500;
	}

	:global(.ais-Hits--loading) {
		@apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 md:gap-y-10 gap-x-6 justify-center;
	}
</style>
