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
        ]
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

        const sortedArticles = [...articles].sort((a, b) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );

        for (const article of sortedArticles) {
            for (const categoryName of categoryOrder) {
                if (categoryName.toLowerCase() === excludeCategory.toLowerCase()) continue;
                
                const belongsToCategory = article.categories.some(cat => cat.name === categoryName);
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
            .map(categoryName => ({
                category: categoryName,
                articles: categoryMap.get(categoryName) || []
            }))
            .filter(category => category.articles.length > 0);
    }

    $effect(() => {
        const articles = getArticles();
        if (articles?.length > 0) {
            categoryArticles = getRecentArticlesByCategory(articles);
        }
    });
</script>

<div class="flex flex-col gap-6">
    <h2 class="text-2xl md:text-4xl font-powerGroteskBold">Most recent</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each categoryArticles as { category, articles }}
            <div class="flex flex-col">
                <div class="flex items-center justify-between">
                    <Badge
                        variant="rectangularFilled"
                        href={`/category/${category.toLowerCase()}`}
                        class="font-mono font-bold border-white/20 text-xs lg:text-sm"
                    >
                        {category}
                    </Badge>
                    <a
                        href={`/category/${category.toLowerCase()}`}
                        class="flex font-mono items-center gap-1 text-xs hover:text-primary/60 transition-colors group"
                    >
                        View all
                        <ArrowRight class="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
                <div class="flex flex-col gap-3">
                    {#each articles as article}
                        <a href={`/${article.slug}`} class="group flex flex-col gap-2">
                            <div class="aspect-[4/3] overflow-hidden rounded-sm">
                                <img
                                    src={getThumbnailUrl(article)}
                                    alt=""
                                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    width="400"
                                    height="300"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <h3 class="font-powerGroteskBold font-medium text-base leading-tight tracking-tight line-clamp-2">
                                {article.title}
                            </h3>
                            <p class="text-xs font-mono text-gray-600 dark:text-gray-400">
                                By {getAuthorsText(article.authors)}
                            </p>
                        </a>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>

