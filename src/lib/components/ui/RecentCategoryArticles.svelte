<script lang="ts">
	import { getArticles } from '$lib/stores/articles.svelte';
	import type { ArticleMetadata } from '$lib/types/article';
	import { getAuthorsText } from '$lib/utils/authors';
	import { ArrowRight } from 'lucide-svelte';
	import Badge from './badge/badge.svelte';

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
		]
	}: {
		maxCategories?: number;
		articlesPerCategory?: number;
		excludeCategory?: string;
		customCategoryOrder?: string[];
	} = $props();

	const categoryOrder = customCategoryOrder;

	let categoryArticles = $state<{ category: string; articles: ArticleMetadata[] }[]>([]);

	const isValidDate = (date: string): boolean => !isNaN(new Date(date).getTime());

	function getRecentArticlesByCategory(articles: ArticleMetadata[]) {
		const categoryMap = new Map<string, ArticleMetadata[]>();
		const displayedArticles = new Set<string>();

		const sortedArticles = [...articles].sort((a, b) => {
			if (!isValidDate(a.updatedAt) || !isValidDate(b.updatedAt)) {
				console.warn('Invalid date found in article:', !isValidDate(a.updatedAt) ? a.slug : b.slug);
				return 0;
			}
			return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
		});

		for (const article of sortedArticles) {
			for (const categoryName of categoryOrder) {
				if (categoryName.toLowerCase() === excludeCategory.toLowerCase()) continue;

				const belongsToCategory = article.categories.some((cat) => cat.name === categoryName);
				if (!belongsToCategory) continue;

				if (displayedArticles.has(article.slug)) continue;

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
			.filter((category) => category.articles.length > 0);
	}

	$effect(() => {
		const articles = getArticles();
		if (articles.length > 0) {
			categoryArticles = getRecentArticlesByCategory(articles);
		}
	});
</script>

<div class="flex flex-col gap-8">
	<h2 class="text-2xl md:text-[32px] font-powerGroteskBold font-bold">Most Recent</h2>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
		{#each categoryArticles as { category, articles }}
			<div class="flex flex-col">
				<div class="flex items-center justify-between">
					<Badge
						variant="rectangularFilled"
						class="font-mono font-bold border-white/20 text-xs lg:text-sm pointer-events-none"
					>
						{category}
					</Badge>
					<a
						href={`/category/${category.toLowerCase()}`}
						class="flex font-mono items-center gap-1 text-xs text-neutral-20 hover:text-primary/60 transition-colors group"
					>
						View All
						<ArrowRight class="w-3 h-3 group-hover:translate-x-1 transition-transform" />
					</a>
				</div>
				<div class="flex flex-col gap-3">
					{#each articles as article}
						<a href={`/${article.slug}`} class="group flex flex-col gap-2">
							<div class="aspect-[4/3] overflow-hidden rounded-sm">
								<img
									src={article.thumb}
									alt=""
									class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
									width="400"
									height="300"
									loading="lazy"
									decoding="async"
								/>
							</div>
							<h3
								class="font-powerGroteskBold font-medium text-[18px] leading-tight -tracking-[0.54px] line-clamp-2 text-neutral-20"
							>
								{article.title}
							</h3>

							<p class="text-xs font-mono text-neutral-40 dark:text-neutral-40 -tracking-[0.6px]">
								By {getAuthorsText(article.authors)}
							</p>
						</a>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
