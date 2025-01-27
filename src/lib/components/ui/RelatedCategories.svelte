<script lang="ts">
    import type { ArticleMetadata } from '$lib/types/article';
    import { getArticles } from '$lib/stores/articles.svelte';
    import { goto } from '$app/navigation';
    import Badge from './badge/badge.svelte';

    const {
        currentCategory,
        maxCategories = 6
    }: {
        currentCategory: string;
        maxCategories?: number;
    } = $props();

    let relatedCategories = $state<{name: string; count: number}[]>([]);

    function getCategoryCount(categoryName: string, articles: ArticleMetadata[]): number {
        return articles.filter(article => 
            article.categories.some(cat => cat.name.toLowerCase() === categoryName.toLowerCase())
        ).length;
    }

    function getRelatedCategories(articles: ArticleMetadata[]): {name: string; count: number}[] {
        const categories = new Set<string>();
        articles.forEach(article => {
            article.categories.forEach(category => {
                if (category.name.toLowerCase() !== currentCategory.toLowerCase()) {
                    categories.add(category.name);
                }
            });
        });

        // Convert to array with counts and sort by count
        const categoriesWithCount = Array.from(categories).map(name => ({
            name,
            count: getCategoryCount(name, articles)
        }));

        return categoriesWithCount
            .sort((a, b) => b.count - a.count)
            .slice(0, maxCategories);
    }

    const handleCategoryClick = (categoryName: string) => {
        goto(`/category/${categoryName.toLowerCase()}`);
    };

    $effect(() => {
        const articles = getArticles();
        relatedCategories = getRelatedCategories(articles);
    });
</script>

<div class="flex flex-col">
    <h2 class="text-3xl md:text-5xl font-medium leading-9 mb-6 md:mb-12 font-soehne">
        Related categories
    </h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        {#each relatedCategories as category}
            <button
                class="group flex flex-col items-start p-6 border rounded-lg hover:bg-secondary transition-colors"
                onclick={() => handleCategoryClick(category.name)}
            >
                <Badge variant="outline" class="mb-2">
                    {category.name}
                </Badge>
                <span class="text-sm text-gray-500">
                    {category.count} {category.count === 1 ? 'article' : 'articles'}
                </span>
            </button>
        {/each}
    </div>
</div>