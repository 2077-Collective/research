<script lang="ts">
	import { browser } from '$app/environment';
	import * as Dialog from '$lib/components/ui/dialog';
	import { cn } from '$lib/utils/ui-components';
	import { algoliasearch, type RankingInfo, type SnippetResult } from 'algoliasearch';
	import { format } from 'date-fns';
	import DOMPurify from 'dompurify';
	import { Loader2, Search } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import Algolia from './icons/Algolia.svelte';
	import EmptySearch from './icons/EmptySearch.svelte';

	const client = algoliasearch(
		import.meta.env.VITE_ALGOLIA_APP_ID,
		import.meta.env.VITE_ALGOLIA_SEARCH_KEY
	);

	interface HighlightResultWithContent {
		title?: {
			value: string;
			matchedWords: string[] | undefined;
		};
		html?: {
			value: string;
			matchedWords: string[] | undefined;
		};
	}

	type SearchResult = {
		objectID: string;
		title: string;
		slug: string;
		html: string;
		tags: {
			id: string;
			name: string;
			slug: string;
		}[];
		authors: {
			name: string;
			slug: string;
		}[];
		_highlightResult?: HighlightResultWithContent;
		_snippetResult?: {
			html?: {
				value: string;
			};
		};
		_rankingInfo?: RankingInfo;
		_distinctSeqID?: number;
		created_at: string;
	};

	const results = writable<Record<string, SearchResult[]>>({});
	const loading = writable<boolean>(false);
	const openDialog = writable<boolean>(false);

	let query = '';
	let debounceTimeout: ReturnType<typeof setTimeout>;

	async function handleSearch(): Promise<void> {
		clearTimeout(debounceTimeout);

		debounceTimeout = setTimeout(async () => {
			if (!query) {
				results.set({});
				loading.set(false);
				return;
			}

			loading.set(true);

			try {
				const response = await client.searchSingleIndex({
					indexName: 'ghost-cms-articles',
					searchParams: { query, attributesToSnippet: ['html:30'] }
				});

				console.log('Algolia Response:', response);

				const hits = response.hits as SearchResult[];

				const filteredHits = hits.filter(
					(result) =>
						(result._highlightResult?.title?.matchedWords &&
							result._highlightResult.title.matchedWords.length > 0) ||
						(result._highlightResult?.html?.matchedWords &&
							result._highlightResult.html.matchedWords.length > 0)
				);

				console.log('Filtered Hits:', filteredHits);

				const categories: string[] = Array.from(
					new Set(filteredHits.map((result) => result.tags[0]?.name).filter(Boolean))
				);

				const transformedHits: any = categories.reduce(
					(acc, category) => {
						acc[category] = filteredHits.filter((result) => result.tags[0]?.name === category);
						return acc;
					},
					{} as Record<string, typeof hits>
				);

				results.set(transformedHits);
			} catch (error) {
				results.set({});
				const errorMessage = error instanceof Error ? error.message : 'Search failed';
				console.error(`Algolia search error: ${errorMessage}`);
			} finally {
				loading.set(false);
			}
		}, 300);
	}

	const handleCloseSearch = (open: boolean) => {
		results.set({});
		query = '';
		openDialog.set(open);

		if (browser) {
			document.body.style.overflow = 'unset';
		}
	};

	const handleOpenDialog = () => {
		openDialog.set(true);
	};
</script>

<button class="relative w-[390px] max-md:hidden" onclick={handleOpenDialog}>
	<span
		class="h-[38px] bg-neutral-80 rounded-[38px] border-neutral-80 transition ps-10 pe-4 text-sm text-neutral-60 cursor-pointer w-full flex items-center !font-ibm"
	>
		Search 2077 research
	</span>
	<Search class="size-4 absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
</button>

<button class="md:hidden flex items-center justify-center" onclick={handleOpenDialog}>
	<Search class="size-6" />
</button>

<Dialog.Root open={$openDialog} onOpenChange={(open) => handleCloseSearch(open)}>
	<Dialog.Content
		class="sm:max-w-[590px] max-md:w-[95%] h-[726px] max-h-[80dvh] md:rounded-[48px] p-0 border-none bg-[#19191A] z-[999999] max-md:rounded-[8px]"
	>
		<div class="h-full flex flex-col overflow-hidden">
			<div class="px-4 md:px-5 pt-4">
				<div class="relative w-full flex-shrink-0">
					<input
						class="h-[45px] bg-neutral-80 rounded-[38px] border-neutral-60 focus-within:outline-neutral-60 transition ps-10 pe-4 md:text-sm text-base placeholder:text-neutral-60 w-full font-ibm"
						placeholder="Search 2077Research"
						bind:value={query}
						onkeyup={handleSearch}
					/>
					<Search class="size-5 absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
				</div>
			</div>

			<div
				class={cn(
					'flex-1 text-center flex-shrink-0 overflow-hidden',
					($loading || Object.keys($results).length === 0) && 'flex items-center justify-center'
				)}
			>
				{#if $loading}
					<p class="text-gray-500">
						<Loader2 class="size-5 animate-spin" />
					</p>
				{/if}

				{#if !$loading && Object.keys($results).length > 0}
					<div class="h-full px-4 md:px-5 pt-6 pb-10 overflow-y-auto">
						<ul class="mt-2 text-left space-y-6">
							{#each Object.keys($results) as articleCategory}
								{@const articles = $results[articleCategory]}

								<li>
									<p class="text-xs font-geist-mono font-bold text-[#0CDEE9] mb-1 md:px-3">
										{articleCategory}
									</p>

									<ul>
										{#each articles as article}
											{@const highlight = article._highlightResult}
											{@const snippet = article._snippetResult}
											{@const formattedDate = (() => {
												try {
													if (!article.created_at) return 'Date unavailable';
													const dateObj = new Date(article.created_at);
													if (isNaN(dateObj.getTime())) return 'Date unavailable';
													return format(dateObj, 'dd MMM yyyy');
												} catch (e) {
													console.warn('Date formatting error:', e, article.created_at);
													return 'Date unavailable';
												}
											})()}
											{#if (highlight?.title?.matchedWords && highlight.title.matchedWords.length > 0) || (highlight?.html?.matchedWords && highlight.html.matchedWords.length > 0)}
												<li class="group cursor-pointer hover:bg-[#0CDEE9]">
													<a
														href={`/${article.slug}`}
														class="md:px-3 block"
														onclick={() => handleCloseSearch(false)}
													>
														<div class="border-b border-[#343434] pt-1.5 pb-3">
															<!-- Title -->
															{#if highlight?.title?.matchedWords && highlight.title.matchedWords.length > 0}
																<p
																	class="text-base font-powerGroteskBold font-bold transition [&>em]:text-[#0CDEE9] [&>em]:group-hover:text-white [&>em]:font-medium [&>em]:!not-italic group-hover:text-[#022C2F]"
																>
																	{@html DOMPurify.sanitize(highlight.title.value)}
																</p>
															{:else}
																<p
																	class="text-base font-powerGroteskBold font-bold transition group-hover:text-[#022C2F]"
																>
																	{article.title}
																</p>
															{/if}

															<!-- Snippet -->
															{#if snippet?.html?.value}
																<p
																	class="text-neutral-20 [&>em]:text-[#0CDEE9] [&>em]:group-hover:text-white [&>em]:font-medium [&>em]:not-italic text-[13px] font-ibm group-hover:text-neutral-80 mt-1"
																>
																	{@html DOMPurify.sanitize(snippet.html.value)}
																</p>
															{:else if highlight?.html?.value}
																<p
																	class="text-neutral-20 [&>em]:text-[#0CDEE9] [&>em]:group-hover:text-white [&>em]:font-medium [&>em]:not-italic text-[13px] font-ibm group-hover:text-neutral-80 mt-1"
																>
																	{@html DOMPurify.sanitize(highlight.html.value)}
																</p>
															{:else}
																<p
																	class="text-neutral-20 text-[13px] font-ibm group-hover:text-neutral-80 mt-1"
																>
																	No matching content found.
																</p>
															{/if}

															<!-- Date -->
															<div class="mt-4 md:mt-1">
																<p
																	class="text-xs font-mono text-neutral-40 group-hover:text-neutral-80"
																>
																	{formattedDate}
																</p>
															</div>
														</div>
													</a>
												</li>
											{/if}
										{/each}
									</ul>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if !$loading && query.length === 0}
					<div>
						<EmptySearch className="mx-auto mb-6" />
						<p class="max-w-[219px] mx-auto">Looks like you haven't searched for anything yet.</p>
					</div>
				{/if}

				{#if !$loading && Object.keys($results).length === 0 && query.length > 0}
					<div>
						<EmptySearch className="mx-auto mb-6" />
						<p class="max-w-[219px] mx-auto">Sorry, we couldn't find that.</p>
					</div>
				{/if}
			</div>

			<div
				class="flex-shrink-0 px-[33px] pb-6 pt-4 border-t border-[#343434] flex items-center justify-between text-neutral-20 text-xs"
			>
				<div class="flex items-center gap-1.5">
					<p>Tap</p>
					<div
						class="h-6 flex items-center justify-center bg-neutral-80 rounded-[5.01px] px-1 text-[#0CDEE9]"
					>
						esc
					</div>
					<p>to close</p>
				</div>

				<div class="flex items-center gap-1.5">
					<p>Search by</p>
					<Algolia />
				</div>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
