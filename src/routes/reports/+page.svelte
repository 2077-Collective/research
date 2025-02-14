<script lang="ts">
	import BaseHead from '$lib/components/server/BaseHead.svelte';
	import ArticleList from '$lib/components/ui/ArticleList.svelte';
	import { setArticles } from '$lib/stores/articles.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	// Get data from props
	const { data }: { data: PageData } = $props();
	const articles = $derived(data.articles);
	const articleCategories = $derived(data.articleCategories);

	// Set articles in the store on mount
	onMount(() => {
		setArticles(data.articles);
	});
</script>

<BaseHead />

<div class="px-3 md:px-12 flex flex-col gap-10">
	<ArticleList {articles} {articleCategories} articlesPerPage={100} />
</div>
