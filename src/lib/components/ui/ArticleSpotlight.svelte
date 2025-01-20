<script lang="ts">
	import type { ArticleMetadata } from '$lib/types/article';
	import Badge from './badge/badge.svelte';

	const { article }: { article: ArticleMetadata } = $props();

	function getAuthorDisplayName(author: ArticleMetadata['authors'][number]): string {
		return author.full_name || author.username;
	}

	function getAuthorsText(authors: ArticleMetadata['authors'] | undefined): string {
		if (!authors?.length) return 'Unknown';
		return authors.map(getAuthorDisplayName).join(', ');
	}
</script>

<div class="flex flex-col gap-2 sm:gap-4">
	<!-- Categories row visible on mobile -->
	<div class="flex gap-1.5 overflow-x-auto sm:hidden px-4 py-2">
		{#each article.categories as category}
			<Badge 
				variant="outline" 
				class="shrink-0 text-xs px-2 py-1"
			>
				{category.name}
			</Badge>
		{/each}
	</div>

	<!-- Main spotlight content -->
	<a 
		href={`/${article.slug}`} 
		class="block relative w-full group overflow-hidden"
	>
		<div class="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2.4/1]">
			<img 
				src={article.thumb}
				alt={article.title}
				loading="eager"
				fetchpriority="high"
				decoding="async"
				class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
			/>
			<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
		</div>
		
		<div class="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8 flex flex-col gap-2 sm:gap-3 lg:gap-4">
			<!-- Categories hidden on mobile, shown on larger screens -->
			<div class="hidden sm:flex flex-wrap gap-1.5 items-start">
				{#each article.categories as category}
					<Badge 
						variant="outline" 
						class="bg-black/50 text-white border-white/20 text-xs lg:text-sm px-2 py-1"
					>
						{category.name}
					</Badge>
				{/each}
			</div>
			
			<h1 class="font-soehne text-xl sm:text-3xl lg:text-5xl font-medium text-white leading-tight tracking-tight">
				{article.title}
			</h1>
			
			<p class="text-xs sm:text-base lg:text-lg text-gray-200 line-clamp-2 leading-relaxed">
				{article.summary}
			</p>
			
			<p class="font-medium text-gray-300 text-xs sm:text-sm lg:text-base">
				By {getAuthorsText(article.authors)}
			</p>
		</div>
	</a>
</div>

<style>
	img {
		content-visibility: auto;
		transform-origin: center;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}
</style>
