<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { cn } from '$lib/utils/ui-components';
	import { algoliasearch, type RankingInfo, type SnippetResult } from 'algoliasearch';
	import DOMPurify from 'dompurify';
	import { Loader2, Search } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import Algolia from './icons/Algolia.svelte';
	import EmptySearch from './icons/EmptySearch.svelte';
	import Input from './input/input.svelte';

	const client = algoliasearch(
		import.meta.env.VITE_ALGOLIA_APP_ID,
		import.meta.env.VITE_ALGOLIA_SEARCH_KEY
	);

	interface HighlightResultWithContent {
		title?: {
			value: string;
			matchedWords: string[] | undefined;
		};
		content_excerpt?: {
			value: string;
			matchedWords: string[] | undefined;
		};
	}

	type SearchResult = {
		objectID: string;
		title: string;
		slug: string;
		_highlightResult?: HighlightResultWithContent;
		_snippetResult?: SnippetResult & {
			content_excerpt: {
				value: string;
			};
		};
		_rankingInfo?: RankingInfo;
		_distinctSeqID?: number;
	};

	const results = writable<SearchResult[]>([]);
	const loading = writable<boolean>(false);

	let query = '';
	let debounceTimeout: ReturnType<typeof setTimeout>;

	async function handleSearch(): Promise<void> {
		clearTimeout(debounceTimeout);

		debounceTimeout = setTimeout(async () => {
			if (!query) {
				results.set([]);
				loading.set(false);
				return;
			}

			loading.set(true);

			try {
				const response = await client.searchSingleIndex({
					indexName: 'Article',
					searchParams: { query }
				});

				results.set(response.hits as SearchResult[]);
			} catch (error) {
				results.set([]);
				const errorMessage = error instanceof Error ? error.message : 'Search failed';
				console.error(`Algolia search error: ${errorMessage}`);
			} finally {
				loading.set(false);
			}
		}, 300);
	}

	const handleCloseSearch = () => {
		results.set([]);
		query = '';
	};
</script>

<Dialog.Root onOpenChange={handleCloseSearch}>
	<Dialog.Trigger>
		<div class="relative w-[353px] max-md:hidden">
			<Input
				class="h-[38px] bg-neutral-80 rounded-[38px] border-neutral-80 focus-within:outline-neutral-60 transition ps-10 pe-4 md:text-sm text-base placeholder:text-neutral-60 cursor-pointer w-full focus:outline-none"
				placeholder="Search 2077Research"
			/>
			<Search class="size-5 absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
		</div>

		<span class="md:hidden flex items-center justify-center">
			<Search class="size-6" />
		</span>
	</Dialog.Trigger>
	<Dialog.Content
		class="sm:max-w-[590px] h-[726px] max-h-[80dvh] md:rounded-[48px] p-0 border-none bg-[#19191A]"
	>
		<div class="h-full flex flex-col overflow-hidden">
			<div class="px-5 pt-4">
				<div class="relative w-full flex-shrink-0">
					<input
						class="h-[45px] bg-neutral-80 rounded-[38px] border-neutral-80 focus-within:outline-neutral-60 transition ps-10 pe-4 md:text-sm text-base placeholder:text-neutral-60 w-full"
						placeholder="Search 2077Research"
						bind:value={query}
						on:keyup={handleSearch}
					/>
					<Search class="size-5 absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
				</div>
			</div>

			<div
				class={cn(
					'flex-1 text-center flex-shrink-0 overflow-hidden',
					($loading || $results.length === 0) && 'flex items-center justify-center'
				)}
			>
				{#if $loading}
					<p class="text-gray-500">
						<Loader2 class="size-5 animate-spin" />
					</p>
				{/if}

				{#if !$loading && $results.length > 0}
					<div class="space-y-6 h-full px-5 pt-6 pb-10 overflow-y-auto">
						<ul class="mt-2 text-left">
							{#each $results as article}
								{@const highlight = article._highlightResult}
								{#if highlight?.content_excerpt?.matchedWords && highlight.content_excerpt.matchedWords.length > 0}
									<li class="group cursor-pointer hover:opacity-70 transition">
										<a href={`/${article.slug}`} class="px-3 py-2.5">
											{#if highlight?.title?.matchedWords && highlight.title.matchedWords.length > 0}
												<p
													class="text-[18px] font-powerGroteskBold font-bold line-clamp-1 transition [&>em]:text-[#0CDEE9] [&>em]:font-medium [&>em]:!not-italic"
												>
													{@html DOMPurify.sanitize(highlight.title.value)}
												</p>
											{:else}
												<p class="font-powerGroteskBold font-bold line-clamp-1 transition">
													{article.title}
												</p>
											{/if}

											<p
												class="text-[#F2F2F2] [&>em]:text-[#0CDEE9] [&>em]:font-medium [&>em]:not-italic text-sm"
											>
												{@html DOMPurify.sanitize(
													article._snippetResult ? article._snippetResult.content_excerpt.value : ''
												)}
											</p>
										</a>
									</li>
								{/if}
							{/each}
						</ul>
					</div>
				{/if}

				{#if !$loading && $results.length === 0}
					<div>
						<EmptySearch className="mx-auto mb-6" />
						<p class="max-w-[219px] mx-auto">Looks like you haven't searched for anything yet.</p>
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
