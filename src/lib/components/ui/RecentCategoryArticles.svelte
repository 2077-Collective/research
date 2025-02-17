<script lang="ts">
	import { getArticles } from '$lib/stores/articles.svelte';
	import type { ArticleMetadata } from '$lib/types/article';
	import { getAuthorsText } from '$lib/utils/authors';
	import { ArrowRight } from 'lucide-svelte';
	import Badge from './badge/badge.svelte';

	interface $$Props {
		articlesPerCategory?: number;
		excludeCategory?: string;
		customCategoryOrder?: string[];
		maxCategories?: number;
	}

	const {
		articlesPerCategory = 1,
		excludeCategory = '',
		customCategoryOrder = [
			'Layer 1',
			'Layer 2',
			'Interoperability',
			'DeFi',
			'Privacy',
			'DePIN',
			'Infrastructure'
		],
		maxCategories = 6
	} = $props();

	const categoryOrder = customCategoryOrder;
	let categoryArticles = $state<{ category: string; articles: ArticleMetadata[] }[]>([]);

	function getThumbnailUrl(article: ArticleMetadata): string {
		return typeof article.thumb === 'string'
			? article.thumb
			: article.thumb?.data?.attributes?.url || article.thumb_url || '';
	}

	function getRecentArticlesByCategory(articles: ArticleMetadata[]) {
		const categoryMap = new Map<string, ArticleMetadata[]>();
		const displayedArticles = new Set<string>();

		const sortedArticles = [...articles].sort(
			(a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
		);

		for (const article of sortedArticles) {
			for (const categoryName of categoryOrder) {
				if (categoryName.toLowerCase() === excludeCategory.toLowerCase()) continue;

				const belongsToCategory = article.categories.some((cat) => cat.name === categoryName);
				if (!belongsToCategory || displayedArticles.has(article.slug)) continue;

				if (!categoryMap.has(categoryName)) {
					categoryMap.set(categoryName, []);
				}

				const articlesForCategory = categoryMap.get(categoryName)!;

				if (articlesForCategory.length < articlesPerCategory) {
					articlesForCategory.push(article);
					displayedArticles.add(article.slug);
				}
			}
		}

		return categoryOrder
			.map((categoryName) => ({
				category: categoryName,
				articles: categoryMap.get(categoryName) || []
			}))
			.filter((category) => category.articles.length > 0)
			.slice(0, maxCategories);
	}

	$effect(() => {
		const articles = getArticles();
		if (articles?.length > 0) {
			categoryArticles = getRecentArticlesByCategory(articles);
		}
	});
</script>

<div class="flex flex-col gap-8">
	<h2 class="text-2xl md:text-[32px] font-powerGroteskBold font-bold">Most recent</h2>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 md:gap-y-16">
		{#each categoryArticles as { category, articles }}
			<div class="flex flex-col">
				<div class="flex items-center justify-between">
					<Badge
						variant="rectangularFilled"
						href={`/category/${category.toLowerCase()}`}
						class="bg-white text-neutral-80 py-1.5 px-2 mb-1"
					>
						{category}
					</Badge>

					<a
						href={`/category/${category.toLowerCase()}`}
						class="flex font-mono text-neutral-20 items-center gap-1 text-xs hover:text-primary/60 transition-colors group/button"
					>
						View All
						<ArrowRight class="w-3 h-3 group-hover/button:translate-x-1 transition-transform" />
					</a>
				</div>

				<div class="flex flex-col gap-3">
					{#each articles as article}
						<div class="space-y-2 group relative">
							<div class="aspect-[1/0.5] overflow-hidden rounded-sm">
								<img
									src={article.thumb_url}
									alt=""
									class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
									width="400"
									height="300"
									loading="lazy"
									decoding="async"
								/>
							</div>

							<h3
								class="font-powerGroteskBold text-[18px] leading-tight tracking-tight line-clamp-2 text-neutral-20 group-hover:underline underline-offset-[3px]"
							>
								{article.title}
							</h3>

							<a href={`/${article.slug}`} class="absolute inset-0" aria-label="Go to article"></a>
						</div>

						<p class="text-xs font-mono text-neutral-40">
							By {@html getAuthorsText(article.authors)}
						</p>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
