<script lang="ts">
	import X from '$lib/components/ui/icons/X.svelte';
	import ScrollToTopButton from '$lib/components/ui/ScrollToTopButton.svelte';
	import { cn } from '$lib/utils/ui-components';
	import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-svelte';
	import type { PageData } from '../$types';

	let activeContributor = $state('');

	const { data } = $props<{ data: PageData }>();
	const contributors = data.authors;
</script>

<section class="bg-[#010102] pt-32 pb-16 relative overflow-hidden">
	<div class="container">
		<div class="max-w-[750px]">
			<h1 class="text-[24px] md:text-[32px] font-powerGroteskBold leading-9 font-bold">
				Contributors
			</h1>

			<p class="text-neutral-10 mt-4">
				Our contributors are researchers, builders, and thinkers pushing the boundaries of Ethereum
				and Web3. Explore their work, insights, and the ideas driving decentralization forward.
			</p>
		</div>
	</div>

	<img
		src="/contritbutors-header.png"
		class="absolute top-0 right-0 pointer-events-none h-full"
		alt="header bg"
	/>
</section>

<section class="divide-y divide-[#202020] border-b border-[#202020]">
	{#each contributors as contributor}
		{@const isActive = contributor.id === activeContributor}

		<div
			class={cn('pt-7 md:pt-[51px] pb-7 md:pb-[46px] transition', isActive && 'bg-[#161617]')}
			role="button"
			onclick={() => {
				if (isActive) {
					activeContributor = '';
				} else {
					activeContributor = contributor.id;
				}
			}}
			onkeydown={() => {
				if (isActive) {
					activeContributor = '';
				} else {
					activeContributor = contributor.id;
				}
			}}
			tabindex="0"
		>
			<div class="container">
				<div class="flex items-center justify-between">
					<div>
						<h3 class="text-2xl font-powerGroteskBold font-bold capitalize">
							{contributor.full_name}
						</h3>

						{#if isActive && contributor.twitter_username}
							<div class="flex items-center gap-3 md:hidden mt-[18px]">
								<a
									href={`https://x.com/${contributor.twitter_username}`}
									class="hover:text-[#0CDEE9] transition"
								>
									<X size="20px" />
								</a>
							</div>{/if}
					</div>

					{#if isActive && contributor.twitter_username}
						<div class="flex items-center gap-3 max-md:hidden">
							<a
								href={`https://x.com/${contributor.twitter_username}`}
								class="hover:text-[#0CDEE9] transition"
							>
								<X size="20px" />
							</a>
						</div>
					{/if}

					{#if !isActive}
						<button
							class="text-sm text-[#0CDEE9] !font-mono flex items-center gap-2 max-md:hidden"
							onclick={(e) => {
								e.stopPropagation();
								activeContributor = contributor.id;
							}}
						>
							See more
							<ChevronDown class="size-4" />
						</button>
					{/if}
				</div>

				{#if !isActive && contributor.twitter_username}
					<div class="flex items-center gap-3 mt-[18px]">
						<a
							href={`https://x.com/${contributor.twitter_username}`}
							class="hover:text-[#0CDEE9] transition"
						>
							<X size="20px" />
						</a>
					</div>
				{/if}

				{#if isActive}
					<div class="overflow-hidden mt-4 md:mt-2">
						<p
							class={cn(
								'max-w-[692px] text-neutral-10 max-md:text-sm',
								!contributor.bio && 'font-mono'
							)}
						>
							{contributor.bio || 'No bio'}
						</p>

						<div class="flex items-end justify-between mt-4">
							<a
								href={`/authors/${contributor.username}`}
								class="h-9 flex items-center gap-2 rounded-[4px] bg-neutral-80 text-neutral-10 py-1.5 px-4 group text-sm !font-mono hover:opacity-80 transition"
								onclick={(e) => e.stopPropagation()}
								data-sveltekit-preload-data
							>
								View all articles by {contributor.full_name}

								<ArrowRight
									class="group-hover:translate-x-[2px] transition will-change-transform size-4"
								/>
							</a>

							<button
								class="text-sm text-[#0CDEE9] !font-mono flex items-center gap-2 max-md:hidden"
								onclick={(e) => {
									e.stopPropagation();
									activeContributor = '';
								}}
							>
								Hide details
								<ChevronUp class="size-4" />
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/each}
</section>

<ScrollToTopButton />
