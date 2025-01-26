<script lang="ts">
	import type { Article } from '$lib/types/article';
	import { getArticleBySlug } from '$lib/services/article.service';
	import { onMount } from 'svelte';

	const { slug }: { slug: string } = $props();
	let article: Article | null = $state(null);
	let loading = $state(true);

	onMount(async () => {
		try {
			article = await getArticleBySlug(slug);
		} catch (error) {
			console.error('Error fetching article:', error);
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}
	<div class="animate-pulse">
		<!-- Category placeholder -->
		<div class="w-1/3 h-8 bg-secondary"></div>

		<div class="relative overflow-hidden">
			<!-- Image placeholder -->
			<div class="w-full aspect-square bg-secondary/50"></div>

			<!-- Content placeholder -->
			<div class="p-4 bg-secondary">
				<!-- Title placeholder -->
				<div class="h-6 bg-secondary-foreground/10 rounded w-3/4 mb-4"></div>

				<!-- Author placeholder -->
				<div class="h-4 bg-secondary-foreground/10 rounded w-1/2"></div>
			</div>
		</div>
	</div>
{:else if article}
	<div>
		{#if article.categories?.[0]}
			<a
				href={`/reports`}
				class="text-xs font-bold px-4 py-2 bg-white text-black rounded-sm hover:underline"
			>
				{article.categories[0].name}
			</a>
		{/if}
		<div class="relative overflow-hidden">
			<span class="block group">
				<a href={`/${article.slug}`}>
					<img
						src={article.thumb}
						alt={article.title}
						class="w-full h-full object-cover rounded-sm transition-transform duration-300 group-hover:scale-105"
					/>

					<!-- Content -->
					<div class="p-4">
						<h2
							class="font-soehne text-lg font-medium leading-tight tracking-tight line-clamp-2 text-ellipsis overflow-hidden"
						>
							{article.title}
						</h2>
						<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
							By {#each article.authors as author, index}
								<span>{author.fullName}</span>
								{#if index < article.authors.length - 2}
									<span>,&nbsp;</span>
								{:else if index < article.authors.length - 1}
									<span>and&nbsp;</span>
								{/if}
							{/each}
						</p>
					</div>
				</a>
			</span>
		</div>
	</div>
{/if}

<style>
	img {
		content-visibility: auto;
		transform-origin: center;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}
</style>
