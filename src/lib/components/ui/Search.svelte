<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { cn } from '$lib/utils/ui-components';
	import {
		algoliasearch,
		type HighlightResult,
		type RankingInfo,
		type SnippetResult
	} from 'algoliasearch';
	import { Loader2, Search } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import Algolia from './icons/Algolia.svelte';
	import EmptySearch from './icons/EmptySearch.svelte';
	import Input from './input/input.svelte';

	const client = algoliasearch('99IEWD8Z0K', 'c6f824db1a70a8523780908459090a48');

	type SearchResult = {
		objectID: string;
		title: string;
		_highlightResult?: { [key: string]: HighlightResult } | undefined;
		_snippetResult?: { [key: string]: SnippetResult } | undefined;
		_rankingInfo?: RankingInfo | undefined;
		_distinctSeqID?: number | undefined;
	};

	const results = writable<any[]>([]);
	const loading = writable<boolean>(false);

	let query = '';

	async function handleSearch(): Promise<void> {
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

			console.log({ result: response.hits });

			results.set(response.hits as SearchResult[]);
		} catch (error) {
			console.error('Search error:', error);
		} finally {
			loading.set(false);
		}
	}
</script>

<Dialog.Root>
	<Dialog.Trigger
		><div class="relative w-[353px]">
			<Input
				class="h-[38px] bg-neutral-80 rounded-[38px] border-neutral-80 focus-within:outline-neutral-60 transition ps-10 pe-4 md:text-sm text-base placeholder:text-neutral-60 cursor-pointer w-full focus:outline-none"
				placeholder="Search 2077Research"
			/>

			<Search class="size-5 absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
		</div></Dialog.Trigger
	>
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
						<!-- <div class="w-full text-left">
							<p class="text-[#0CDEE9] font-bold text-xs px-3">Infrastructure</p>

							<ul class="mt-2 border-b pb-px border-[#343434]">
								<li class="px-3 py-2.5 group cursor-pointer hover:bg-[#0CDEE9] transition">
									<p
										class="font-powerGroteskBold font-bold line-clamp-1 group-hover:text-[#022C2F] transition"
									>
										The Hitchhiker's Guide To Dark Pools In DeFi: Part One
									</p>

									<div
										class="flex items-center gap-2 divide-x divide-neutral-40 group-hover:divide-neutral-80 text-xs mt-1.5 text-neutral-40 group-hover:text-neutral-80 font-mono transition"
									>
										<p>20 Jan 2024</p>
										<p class="pl-2">5 min read</p>
									</div>
								</li>

								<li class="px-3 py-2.5 group cursor-pointer hover:bg-[#0CDEE9] transition">
									<p
										class="font-powerGroteskBold font-bold line-clamp-1 group-hover:text-[#022C2F] transition"
									>
										The Hitchhiker's Guide To Dark Pools In DeFi: Part One
									</p>

									<div
										class="flex items-center gap-2 divide-x divide-neutral-40 group-hover:divide-neutral-80 text-xs mt-1.5 text-neutral-40 group-hover:text-neutral-80 font-mono"
									>
										<p>20 Jan 2024</p>
										<p class="pl-2">5 min read</p>
									</div>
								</li>
							</ul>
						</div> -->

						<ul class="mt-2 text-left">
							{#each $results as article}
								{@const highlight = article?._highlightResult?.content_excerpt as any}
								{#if highlight?.matchedWords.length > 0}
									<li class="px-3 py-2.5 group cursor-pointer transition">
										<p class="font-powerGroteskBold font-bold line-clamp-1 transition">
											{article.title}
										</p>

										<p class="text-neutral-40 [&>em]:text-red-500">
											{@html article?._snippetResult.content_excerpt.value}
										</p>

										<div
											class="flex items-center gap-2 divide-x divide-neutral-40 group-hover:divide-neutral-80 text-xs mt-1.5 text-neutral-40 group-hover:text-neutral-80 font-mono transition"
										>
											<p>20 Jan 2024</p>
											<p class="pl-2">5 min read</p>
										</div>
									</li>
								{/if}
							{/each}

							<!-- <li class="px-3 py-2.5 group cursor-pointer hover:bg-[#0CDEE9] transition">
								<p
									class="font-powerGroteskBold font-bold line-clamp-1 group-hover:text-[#022C2F] transition"
								>
									The Hitchhiker's Guide To Dark Pools In DeFi: Part One
								</p>

								<div
									class="flex items-center gap-2 divide-x divide-neutral-40 group-hover:divide-neutral-80 text-xs mt-1.5 text-neutral-40 group-hover:text-neutral-80 font-mono"
								>
									<p>20 Jan 2024</p>
									<p class="pl-2">5 min read</p>
								</div>
							</li> -->
						</ul>
					</div>
				{/if}

				{#if !$loading && $results.length === 0}
					<div>
						<EmptySearch className="mx-auto mb-6" />
						<p class="max-w-[219px] mx-auto">Looks like you haven’t searched for anything yet.</p>
					</div>
				{/if}
			</div>

			<div
				class="flex-shrink-0 px-5 pb-6 pt-4 border-t border-[#343434] flex items-center justify-between text-neutral-20 text-xs"
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
