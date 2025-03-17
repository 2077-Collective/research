<script lang="ts">
	import { goto } from '$app/navigation';
	import BaseHead from '$lib/components/server/BaseHead.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Grid from '$lib/components/ui/icons/Grid.svelte';
	import List from '$lib/components/ui/icons/List.svelte';
	import X from '$lib/components/ui/icons/X.svelte';
	import type { ArticleMetadata } from '$lib/types/article';
	import { formatCategorySlug } from '$lib/utils/format';
	import { cn } from '$lib/utils/ui-components';
	import { Image } from '@unpic/svelte';
	import { format } from 'date-fns';
	import { ArrowRight } from 'lucide-svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	const author = $derived(data.author);

	const articles = $derived(data.author.articles || []);

	function handleCategoryClick(category: string) {
		goto(`/category/${formatCategorySlug(category)}`);
	}

	function handleKeydown(event: CustomEvent<KeyboardEvent>, categoryName: string) {
		if (event.detail.key === 'Enter') {
			handleCategoryClick(categoryName);
		}
	}

	function getPrimaryCategory(article: ArticleMetadata) {
		const primary = article.categories.find((category: any) => category.is_primary);
		return primary ?? article.categories[0];
	}

	let viewStyle = $state<'GRID' | 'LIST'>('GRID');

	const handleToggleViewStyle = () => {
		if (viewStyle === 'GRID') {
			viewStyle = 'LIST';
		} else {
			viewStyle = 'GRID';
		}
	};
</script>

<BaseHead />

<div class="flex flex-col gap-8">
	<section class="bg-[#010102] pt-32 pb-14 md:pb-20 relative">
		<div class="container z-20 relative">
			<div class="">
				<span
					class="text-sm font-mono text-[#0CDEE9] block md:inline-block align-middle max-md:mb-3"
					>{`</Author>`}</span
				>

				<h1 class="text-[24px] md:text-[32px] font-powerGroteskBold leading-9 font-bold mt-3">
					{author.full_name}
				</h1>

				<p
					class={cn(
						'text-lg mt-[15px] font-light',
						!author.bio && 'font-mono text-neutral-20 text-sm'
					)}
				>
					{#if author.bio}
						{author.bio}
					{:else}
						No bio available
					{/if}
				</p>

				{#if author.twitter_username}
					<div class="mt-10">
						<p class="text-sm font-mono text-neutral-40">Author on the Interwebs</p>

						<div class="mt-4 flex items-center gap-6">
							{#if author.twitter_username}
								<a
									href={author.twitter_username}
									target="_blank"
									class="transition hover:text-[#0CDEE9]"
								>
									<X size="16px" />
								</a>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>

		<enhanced:img
			class="w-[1144.5px] absolute bottom-0 right-0 pointer-events-none max-md:hidden"
			src="/static/about-us-hero.png"
			alt="Half sun"
			decoding="async"
		/>
	</section>

	<section class="bg-[#0C0C0D] md:pt-16 pb-28">
		{#if articles.length > 0}
			<div class="container">
				<div
					class={cn(
						'mb-4 md:mb-8 flex items-center justify-between',
						viewStyle === 'LIST' && 'md:mb-0'
					)}
				>
					<h2 id="team" class="text-2xl md:text-[32px] leading-9 font-powerGroteskBold font-bold">
						Articles
					</h2>

					<div class="hidden md:flex items-center gap-2">
						<button
							class={cn(
								'md:bg-[#19191A] h-10 flex items-center justify-center gap-1 text-sm p-1.5 md:p-2.5 rounded-[8px] transition',
								viewStyle === 'GRID' && 'opacity-50'
							)}
							aria-label="Switch to list view"
							onclick={() => (viewStyle = 'LIST')}
						>
							<List />

							<span class="max-md:hidden">List View</span>
						</button>

						<button
							class={cn(
								'md:bg-[#19191A] h-10 flex items-center justify-center gap-1 text-sm p-1.5 md:p-2.5 rounded-[8px] transition',
								viewStyle === 'LIST' && 'opacity-50'
							)}
							aria-label="Switch to list view"
							onclick={() => (viewStyle = 'GRID')}
						>
							<Grid />

							<span class="max-md:hidden">Grid View</span>
						</button>
					</div>
				</div>

				{#if viewStyle === 'GRID'}
					<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-x-6 md:gap-y-20">
						{#each articles as article}
							{@const category = getPrimaryCategory(article)}
							{@const formattedDate = format(article.updated_at, 'dd MMM yyyy')}

							<div class="relative">
								<div class="flex items-center justify-between">
									<a
										href={`/category/${formatCategorySlug(category?.name || '')}`}
										data-sveltekit-preload-data
									>
										<Badge
											variant="rectangularFilled"
											class="bg-white text-neutral-80 py-1.5 px-2 mb-1 hover:bg-neutral-20"
										>
											{category?.name}
										</Badge>
									</a>

									<a
										href={`/category/${formatCategorySlug(category?.name || '')}`}
										class="flex font-mono text-neutral-20 items-center gap-1 text-xs hover:text-primary/60 transition-colors group/button"
										data-sveltekit-preload-data
									>
										View all
										<ArrowRight
											class="w-3 h-3 group-hover/button:translate-x-1 transition-transform"
										/>
									</a>
								</div>

								<div class="relative group">
									<a
										href={`/${article.slug}`}
										data-sveltekit-preload-data
										class="absolute inset-0 z-20"
										aria-label="Go to article"
									></a>

									<div class="overflow-hidden">
										<Image
											src={article.thumb_url || ''}
											alt=""
											class="aspect-[1/0.5] w-full object-cover rounded-t-lg group-hover:scale-105 transition will-change-transform"
											decoding="async"
										/>
									</div>

									<div class="mt-4">
										<h3
											class="font-powerGroteskBold text-[18px] leading-tight text-neutral-20 group-hover:underline underline-offset-[3px]"
										>
											{article.title}
										</h3>

										<div
											class="flex items-center gap-2 text-xs my-2 text-neutral-40 divide-x-[1px] divide-neutral-40 font-mono max-md:mt-5"
										>
											<p>{formattedDate}</p>

											{#if article.min_read}
												<p class="pl-2">{article.min_read} min read</p>
											{/if}
										</div>

										<p class="text-neutral-40 group-hover:text-neutral-60 transition">
											{article.summary}
										</p>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}

				{#if viewStyle === 'LIST'}
					<div class="divide-y divide-[#1F1F1F]">
						{#each articles as article}
							{@const category = getPrimaryCategory(article)}
							{@const formattedDate = format(article.updated_at, 'dd MMM yyyy')}

							<div class="flex items-center flex-wrap gap-[46px] py-8 relative group">
								<a
									href={`/${article.slug}`}
									data-sveltekit-preload-data
									class="absolute inset-0 z-20"
									aria-label="Go to article"
								></a>

								<div class="w-full max-w-[377.368px] min-h-[165px] flex-shrink-0 overflow-hidden">
									<Image
										src={article.thumb_url || ''}
										alt=""
										class="size-full object-cover group-hover:scale-105 transition will-change-transform"
										decoding="async"
									/>
								</div>

								<div class="flex-1 space-y-2.5">
									<a
										href={`/category/${formatCategorySlug(category?.name || '')}`}
										data-sveltekit-preload-data
									>
										<Badge
											variant="rectangularFilled"
											class="bg-white text-neutral-80 py-1.5 px-2 font-mono relative z-50"
										>
											{category?.name}
										</Badge>
									</a>

									<h3
										class="font-powerGroteskBold text-[18px] md:text-[28px] leading-tight text-neutral-20 group-hover:underline underline-offset-[3px]"
									>
										{article.title}
									</h3>

									<div
										class="flex items-center gap-2 text-xs my-2 text-neutral-40 divide-x-[1px] divide-neutral-40 font-mono max-md:mt-5"
									>
										<p>{formattedDate}</p>

										{#if article.min_read}
											<p class="pl-2">{article.min_read} min read</p>
										{/if}
									</div>

									<p class="text-neutral-40 max-md:text-sm">
										{article.summary}
									</p>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{:else}
			<div class="container text-center font-mono font-normal text-neutral-20">
				<p>No articles here yet.</p>
			</div>
		{/if}
	</section>
</div>
