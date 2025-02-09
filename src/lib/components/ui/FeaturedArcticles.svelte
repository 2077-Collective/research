<script lang="ts">
	import { goto } from '$app/navigation';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import type { ArticleMetadata } from '$lib/types/article';
	import { getAuthorsText } from '$lib/utils/authors';
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

<h2 class="text-2xl md:text-[32px] font-powerGroteskBold mb-4 md:mb-8">Featured Research</h2>

<Carousel.Root bind:api class="w-full relative">
	<Carousel.Content>
		{#each articles as article}
			{@const primaryCategory = getPrimaryCategory(article)?.name}
			{@const formattedDate = format(article.updatedAt, 'dd MMM yyyy')}

			<Carousel.Item class="relative">
				<div class="flex md:aspect-[1/0.5] items-center justify-center">
					<a href={`/${article.slug}`} class="!size-full">
						<img
							src={article.thumb}
							alt={`Thumbnail for article: ${article.title}`}
							loading="eager"
							fetchpriority="high"
							decoding="async"
							class="!w-full lg:w-4/6 object-cover"
						/>
					</a>
				</div>

				<div
					class="relative md:absolute md:w-[350px] max-w-full bg-[#19191A] md:bottom-0 md:left-[93px] rounded-[8px] max-md:rounded-t-none pt-6"
				>
					{#if primaryCategory}
						<div class="px-6">
							<Badge
								variant="rectangularFilled"
								class="font-mono font-normal text-xs cursor-pointer focus:ring-2 focus:ring-offset-2 rounded-[34px] !bg-[#0CDEE9] border-none px-3 py-1.5 capitalize !text-neutral-80"
								role="link"
								tabindex="0"
								on:click={() => handleCategoryClick(primaryCategory)}
								on:keydown={(event) => handleKeydown(event, primaryCategory)}
							>
								{primaryCategory}
							</Badge>
						</div>
					{/if}

					<a href={`/${article.slug}`} class="px-6 max-md:pb-6 block">
						<h3
							class="text-[28px] md:text-[32px] font-powerGroteskBold font-bold leading-8 line-clamp-3 mt-4"
						>
							{toTitleCase(article.title)}
						</h3>

						<p class="md:hidden mt-2 text-sm text-neutral-40 line-clamp-3">{article.summary}</p>

						<div
							class="flex items-center gap-2 text-xs py-2.5 text-neutral-40 divide-x-[1px] divide-neutral-40 font-mono max-md:mt-5"
						>
							<p>{formattedDate}</p>
							<p class="pl-2 line-clamp-1">By {getAuthorsText(article.authors)}</p>
						</div>
					</a>
				</div>
			</Carousel.Item>
		{/each}
	</Carousel.Content>

	<div
		class="flex items-center gap-[13px] md:-top-[64px] absolute md:right-12 text-neutral-60 max-md:left-1/2 max-md:-translate-x-1/2 max-md:mt-8"
	>
		<Carousel.Previous
			class="bg-transparent border-none [&_svg]:size-6 md:[&_svg]:size-8 text-neutral-60 hover:bg-transparent"
		/>

		<div
			class="text-center text-sm !text-[24px] md:!text-[32px] font-powerGroteskBold font-bold w-16"
		>
			<span class="text-white">{current}</span>/{count}
		</div>

		<Carousel.Next
			class="bg-transparent border-none [&_svg]:size-6 md:[&_svg]:size-8 hover:bg-transparent"
		/>
	</div>
</Carousel.Root>
