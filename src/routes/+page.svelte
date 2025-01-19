<script lang="ts">
	import ArticleSpotlight from '$lib/components/ui/ArticleSpotlight.svelte';
	import ArticleList from '$lib/components/ui/ArticleList.svelte';
	import type { PageData } from './$types';
	import { setArticles } from '$lib/stores/articles.svelte';
	import { onMount } from 'svelte';
	import Testimonials from '$lib/components/ui/Testimonials.svelte';
	import BaseHead from '$lib/components/server/BaseHead.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowDown, Mail } from 'lucide-svelte';

	const { data }: { data: PageData } = $props();
	const articles = $derived(data.articles);
	const articleCategories = $derived(data.articleCategories);

	onMount(() => {
		setArticles(data.articles);
	});
</script>

<BaseHead />

<div class="px-3 md:px-12 flex flex-col gap-10">
	<!-- These heights are arbitrary and never repeated throughout the website, that's why they're not in tailwind config -->
	<div
		class="font-soehne h-[420px] md:h-[714px] relative border-b flex flex-col justify-end bg-gradient-to-b from-gray-100 to-transparent dark:from-secondary dark:to-transparent"
	>
		<!-- leading-[69px] and max-w-[928px] are arbitrary and never repeated throughout the website, that's why it's not in tailwind config -->
		<h1
			class="font-soehne text-3xl md:leading-[69px] md:text-6xl font-medium max-w-[928px] mb-12 px-10"
		>
			State of the art research on Ethereum and the broader crypto ecosystem
		</h1>

		<img
			src="/hero.webp"
			width="928"
			height="698"
			fetchpriority="high"
			loading="eager"
			decoding="async"
			class="absolute top-0 right-0 w-1/2 animate-float"
			alt="Hero illustration"
		/>
	</div>

	<div class="flex justify-center md:hidden">
		<Button
			href="#subscribe"
			class="mt-2 flex items-center gap-1 justify-center w-fit px-8 bg-[#07BEBF]"
			onclick={() => {
				document.querySelector('#subscribe')?.scrollIntoView({ behavior: 'smooth' });
			}}
		>
			Subscribe to our newsletter
			<Mail class="w-4 h-4 ml-1" />
		</Button>
	</div>

	<ArticleSpotlight article={articles[0]} />

	<ArticleList {articles} {articleCategories} displayLoadMore={false} />
	<div class="flex justify-center py-4 md:py-10">
		<a
			href="/list"
			class="flex items-center gap-3 px-4 py-2 text-2xl transition-colors duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
		>
			See all research
			<div
				class="border rounded-full p-2 h-10 w-10 flex items-center justify-center group-hover:bg-primary group-hover:text-accent group-hover:translate-y-1 transition-transform duration-300"
			>
				<ArrowDown class="h-10 w-10 rounded-full" style="stroke-width: 1.4" />
			</div>
		</a>
	</div>
	<Testimonials />
</div>
