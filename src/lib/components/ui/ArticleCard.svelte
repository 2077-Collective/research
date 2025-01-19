<script lang="ts">
	import type { ArticleMetadata } from '$lib/types/article';
	import { slide } from 'svelte/transition';
	import Badge from './badge/badge.svelte';

	const {
		article,
		onBadgeClick
	}: { article: ArticleMetadata; onBadgeClick?: (val: string) => void } = $props();
</script>

<a href={`/${article.slug}`} class="block">
	<div
		transition:slide={{ duration: 300 }}
		class={`flex flex-col justify-center h-fit`}
		style={`background-color: ${article.isSponsored ? article.sponsorColor : 'transparent'}; color: ${article.isSponsored ? article.sponsorTextColor : 'inherit'};`}
	>
		<div class="flex flex-col w-full">
			<img src={article.thumb} alt={article.title} class="aspect-square w-full object-cover" />
		</div>

		<div class="flex flex-col py-6 w-full" class:px-6={article.isSponsored}>
			<div class="flex gap-1 items-start w-full text-sm tracking-wide">
				{#each article.categories as category}
					<Badge
						variant="outline"
						{...article.isSponsored ? { style: article.sponsorTextColor } : undefined}
						onclick={(e: MouseEvent) => {
							e.stopPropagation();
							e.preventDefault();
							if (onBadgeClick) {
								onBadgeClick(category.name);
							}
						}}
					>
						{category.name}
					</Badge>
				{/each}
			</div>
			<p class="font-soehne mt-4 text-2xl md:text-3xl font-medium leading-9 tracking-tight">
				{article.title}
			</p>
			<p class="mt-4 leading-6 tracking-normal">{article.summary}</p>
			<p class="mt-4 font-medium tracking-normal">
				By {article.authors?.map((author) => author.full_name || author.username).join(', ')}
			</p>
		</div>
	</div>
</a>
