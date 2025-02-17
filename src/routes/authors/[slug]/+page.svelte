<script lang="ts">
	import { goto } from '$app/navigation';
	import BaseHead from '$lib/components/server/BaseHead.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import X from '$lib/components/ui/icons/X.svelte';
	import type { ArticleMetadata } from '$lib/types/article';
	import { formatCategorySlug } from '$lib/utils/format';
	import { format } from 'date-fns';
	import { ArrowRight } from 'lucide-svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	const author = $derived(data.author);

	const articles = $derived(data.author.articles);

	function handleCategoryClick(category: string) {
		goto(`/category/${formatCategorySlug(category)}`);
	}

	function handleKeydown(event: CustomEvent<KeyboardEvent>, categoryName: string) {
		if (event.detail.key === 'Enter') {
			handleCategoryClick(categoryName);
		}
	}

	function getPrimaryCategory(article: ArticleMetadata) {
		return article.categories.find((category: any) => category.is_primary);
	}
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

				<p class="text-lg mt-[15px] font-light">
					{#if author.bio}
						{author.bio}
					{:else}
						Edd Gent is a freelance science and technology writer based in Bengaluru, India. His
						writing focuses on emerging technologies across computing, engineering, energy and
						bioscience. He's on Twitter at @EddytheGent and email at edd dot gent at outlook dot
						com. His PGP fingerprint is ABB8 6BB3 3E69 C4A7 EC91 611B 5C12 193D 5DFC C01B. His
						public key is here. DM for Signal info.
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
									class="hover:opacity-80 transition"
								>
									<X size="16px" />
								</a>
							{/if}

							<!-- <a href="/" class="hover:opacity-80 transition">
							<Farcaster size="24px" />
						</a> -->
						</div>
					</div>
				{/if}
			</div>
		</div>

		<img
			class="w-[1144.5px] absolute bottom-0 right-0 pointer-events-none max-md:hidden"
			src="/about-us-hero.png"
			alt="Half sun"
		/>
	</section>

	<section class="bg-[#0C0C0D]">
		<div class="container">
			<h2
				id="team"
				class="text-2xl md:text-[32px] leading-9 mb-4 md:mb-7 font-powerGroteskBold tracking-tight font-bold"
			>
				Articles
			</h2>

			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-x-6 md:gap-y-20">
				{#each articles as article}
					{@const category = getPrimaryCategory(article)}
					{@const formattedDate = format(article.updated_at, 'dd MMM yyyy')}

					<div class="relative">
						<div class="flex items-center justify-between">
							<Badge
								variant="rectangularFilled"
								href={`/category/${formatCategorySlug(category?.name || '')}`}
								class="bg-white text-neutral-80 py-1.5 px-2 mb-1"
							>
								{category?.name}
							</Badge>

							<a
								href={`/category/${formatCategorySlug(category?.name || '')}`}
								class="flex font-mono text-neutral-20 items-center gap-1 text-xs hover:text-primary/60 transition-colors group/button"
							>
								View All
								<ArrowRight class="w-3 h-3 group-hover/button:translate-x-1 transition-transform" />
							</a>
						</div>

						<div class="relative group">
							<a href={`/${article.slug}`} class="absolute inset-0 z-20" aria-label="Go to article"
							></a>

							<div class="overflow-hidden">
								<img
									src={article.thumb_url}
									alt=""
									class="aspect-[1/0.5] w-full object-cover rounded-t-lg group-hover:scale-105 transition will-change-transform"
								/>
							</div>

							<div class="mt-4">
								<h3
									class="font-powerGroteskBold text-[18px] leading-tight tracking-tight line-clamp-2 text-neutral-20 group-hover:underline underline-offset-[3px]"
								>
									{article.title}
								</h3>

								<div
									class="flex items-center gap-2 text-xs my-2 text-neutral-40 divide-x-[1px] divide-neutral-40 font-mono max-md:mt-5"
								>
									<p>{formattedDate}</p>

									{#if article.min_read}
										<p class="pl-2 line-clamp-1">{article.min_read} min read</p>
									{/if}
								</div>

								<p class="line-clamp-3 text-neutral-40 group-hover:text-neutral-60 transition">
									{article.summary}
								</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>
</div>
