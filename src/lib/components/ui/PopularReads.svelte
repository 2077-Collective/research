<script lang="ts">
	import { goto } from '$app/navigation';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import type { ArticleMetadata } from '$lib/types/article';
	import { toTitleCase } from '$lib/utils/titleCase';
	import { format } from 'date-fns';
	import Badge from './badge/badge.svelte';

	export let articles: ArticleMetadata[];

	let api: CarouselAPI | undefined;
	let current = 0;
	let count = 0;

	$: if (api) {
		count = api.scrollSnapList()?.length ?? 0;
		current = (api.selectedScrollSnap?.() ?? 0) + 1;

		api.on?.('select', () => {
			current = (api?.selectedScrollSnap?.() ?? 0) + 1;
		});
	}

	function handleCategoryClick(categoryName: string) {
		goto(`/category/${categoryName}`);
	}

	function handleKeydown(event: CustomEvent<KeyboardEvent>, categoryName: string) {
		if (event.detail.key === 'Enter') {
			handleCategoryClick(categoryName);
		}
	}

	function getPrimaryCategory(article: ArticleMetadata) {
		return article.categories.find((category) => category.is_primary);
	}
</script>

<div class="flex max-md:flex-col">
	<div
		class="bg-[#010102] md:bg-[#022728] flex-1 overflow-hidden pt-10 md:pt-[70px] max-md:px-5 max-md:pb-28"
	>
		<div class="flex flex-col w-full">
			<Carousel.Root bind:api class="w-full relative" opts={{ loop: true }}>
				<div class="flex items-center justify-between container mb-9">
					<h2 class="text-2xl md:text-[32px] font-soehne font-medium">Trending Articles</h2>

					<div class="flex items-center gap-[30px] font-medium max-md:hidden">
						<p>What everyone is reading right now</p>

						<div class="relative flex items-center gap-3">
							<Carousel.Previous
								class="bg-transparent border-none [&_svg]:size-6 md:[&_svg]:size-8 !text-neutral-40 hover:!text-neutral-60 hover:bg-transparent relative left-0 translate-y-0"
							/>

							<Carousel.Next
								class="bg-transparent border-none [&_svg]:size-6 md:[&_svg]:size-8 !text-neutral-40 hover:!text-neutral-60 hover:bg-transparent relative left-0 translate-y-0"
							/>
						</div>
					</div>
				</div>

				<hr class="border-[#07494B] max-md:hidden" />

				<Carousel.Content>
					{#each articles as article}
						{@const primaryCategory = getPrimaryCategory(article)?.name}
						{@const formattedDate = format(article.updatedAt, 'dd MMM yyyy')}

						<Carousel.Item
							class="relative md:flex-none md:w-[265px] group overflow-hidden px-5 border-[#07494B] md:pt-7 md:pb-20"
						>
							<a href={`/${article.slug}`} class="absolute inset-0" aria-label="View article"></a>

							<div class="h-full w-px bg-[#07494B] absolute left-0 top-0 max-md:hidden"></div>

							{#if primaryCategory}
								<div>
									<Badge
										variant="rectangularFilled"
										class="font-mono text-xs cursor-pointer focus:ring-0 focus:ring-offset-0 font-bold !bg-white rounded-none border-none px-2 py-1.5 capitalize !text-neutral-80 relative z-50 hover:!bg-black hover:!text-white"
										role="link"
										tabindex="0"
										on:click={() => handleCategoryClick(primaryCategory)}
										on:keydown={(event) => handleKeydown(event, primaryCategory)}
									>
										{primaryCategory}
									</Badge>
								</div>
							{/if}

							<div
								class="flex max-md:aspect-[1/0.85] md:aspect-[15/17] items-center justify-center overflow-hidden"
							>
								<a href={`/${article.slug}`} class="!size-full">
									<img
										src={article.thumb}
										alt={`Thumbnail for article: ${article.title}`}
										loading="eager"
										fetchpriority="high"
										decoding="async"
										class="!size-full object-cover group-hover:scale-105 transition will-change-transform"
									/>
								</a>
							</div>

							<div class="max-md:bg-[#19191A] max-md:p-6 max-md:rounded-[8px]">
								<h3
									class="text-lg md:text-[20px] font-powerGroteskBold font-bold leading-[22px] line-clamp-3 mt-2.5 group-hover:underline underline-offset-[3px]"
								>
									{toTitleCase(article.title)}
								</h3>

								<div
									class="flex items-center gap-2 text-xs mt-[9px] text-neutral-40 divide-x-[1px] divide-neutral-40 font-mono max-md:mt-5"
								>
									<p>{formattedDate}</p>
									<p class="pl-2 line-clamp-1">5 min read</p>
								</div>
							</div>
						</Carousel.Item>
					{/each}
				</Carousel.Content>

				<div
					class="max-md:absolute max-md:-bottom-14 flex items-center gap-[13px] md:-top-[64px] absolute md:right-24 text-neutral-60 max-md:left-1/2 max-md:-translate-x-1/2 max-md:mt-8 md:hidden"
				>
					<Carousel.Previous
						class="bg-transparent border-none [&_svg]:size-6 md:[&_svg]:size-8 !text-neutral-40 hover:!text-neutral-60 hover:bg-transparent relative left-0 translate-y-0"
					/>

					<div
						class="text-center text-sm !text-[24px] md:!text-[32px] font-powerGroteskBold font-bold w-0"
					>
						<!-- <span class="text-white">{current}</span>/{count} -->
					</div>

					<Carousel.Next
						class="bg-transparent border-none [&_svg]:size-6 md:[&_svg]:size-8 !text-neutral-40 hover:!text-neutral-60 hover:bg-transparent relative left-0 translate-y-0"
					/>
				</div>
			</Carousel.Root>
		</div>
	</div>
</div>
