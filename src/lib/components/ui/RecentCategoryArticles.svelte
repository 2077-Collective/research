<script lang="ts">
    import type { Article, ArticleMetadata } from '$lib/types/article';
    import { getArticles } from '$lib/stores/articles.svelte';
    import { onMount } from 'svelte';
    import { ArrowRight } from 'lucide-svelte';
    import Badge from './badge/badge.svelte';
    
    const { 
        maxCategories = 7,
        articlesPerCategory = 1,
        excludeCategory = ''
    }: { 
        maxCategories?: number;
        articlesPerCategory?: number;
        excludeCategory?: string;
    } = $props();

    const categoryOrder = [
        'Layer 1',
        'Layer 2',
        'Interoperability',
        'DeFi',
        'Privacy',
        'DePIN',
        'Infrastructure'
    ];

    let categoryArticles = $state<{ category: string; articles: ArticleMetadata[] }[]>([]);

    function getRecentArticlesByCategory(articles: ArticleMetadata[]) {
        const categoryMap = new Map<string, ArticleMetadata[]>();

        for (const categoryName of categoryOrder) {
            if (categoryName.toLowerCase() === excludeCategory.toLowerCase()) continue;
            
            const articlesForCategory = articles.filter(article => 
                article.categories.some(cat => cat.name === categoryName)
            );

            const sortedArticles = articlesForCategory.sort((a, b) => 
                new Date(b.scheduledPublishTime).getTime() - 
                new Date(a.scheduledPublishTime).getTime()
            );

            if (sortedArticles.length > 0) {
                categoryMap.set(categoryName, sortedArticles.slice(0, articlesPerCategory));
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
        if (articles.length > 0) {
            categoryArticles = getRecentArticlesByCategory(articles);
        }
    });
</script>

<div class="flex flex-col gap-6">
    <h2 class="text-2xl md:text-4xl font-soehne px-3 md:px-12">Most recent</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each categoryArticles as { category, articles }}
            <div class="flex flex-col">
                <div class="flex items-center justify-between">
                    <Badge 
                        variant="rectangularFilled" 
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
                        <a 
                            href={`/${article.slug}`}
                            class="group flex flex-col gap-2"
                        >
                            <div class="aspect-[4/3] overflow-hidden rounded-sm">
                                <img
                                    src={article.thumb}
                                    alt={article.title}
                                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                            <h3 class="font-powerGroteskBold text-base leading-tight tracking-tight line-clamp-2">
                                {article.title}
                            </h3>
                            <p class="text-xs font-mono text-gray-600 dark:text-gray-400">
                                By {#each article.authors as author, index}
                                    <span>{author.full_name}</span>
                                    {#if index < article.authors.length - 2}
                                        <span>,&nbsp;</span>
                                    {:else if index < article.authors.length - 1}
                                        <span>&nbsp;and&nbsp;</span>
                                    {/if}
                                {/each}
                            </p>
                        </a>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>