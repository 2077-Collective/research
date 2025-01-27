<script lang="ts">
    import ArticleList from '$lib/components/ui/ArticleList.svelte';
    import RelatedCategories from '$lib/components/ui/RelatedCategories.svelte';
    import type { PageData } from './$types';
    import { setArticles } from '$lib/stores/articles.svelte';
    import { onMount } from 'svelte';
    import BaseHead from '$lib/components/server/BaseHead.svelte';

    const { data }: { data: PageData } = $props();

    const articles = $derived(data.articles);
    const category = $derived(data.category);
    
    const formattedCategory = $derived(
        category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
    );

    onMount(() => {
        setArticles(data.articles);
    });
</script>

<BaseHead />
<div class="px-3 md:px-12 flex flex-col gap-10">
    <ArticleList 
        {articles} 
        articlesPerPage={100}
        title={`Latest ${formattedCategory}`}
        disableCategory={true}
    />
</div>