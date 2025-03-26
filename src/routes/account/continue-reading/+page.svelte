<script lang="ts">
	import { goto } from '$app/navigation';
	import { Badge } from '$lib/components/ui/badge';
	import Grid from '$lib/components/ui/icons/Grid.svelte';
	import List from '$lib/components/ui/icons/List.svelte';
	import { getGhostArticleBySlug } from '$lib/services/article.service';
	import type { Article, ArticleMetadata } from '$lib/types/article';
	import { formatCategorySlug } from '$lib/utils/format';
	import { supabase } from '$lib/utils/supabase';
	import { cn } from '$lib/utils/ui-components';
	import { error } from '@sveltejs/kit';
	import { format } from 'date-fns';
	import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	type ArticleWithProgress = Article & { progress: string };

	let historyArticles = $state<ArticleWithProgress[]>([]);
	let isLoading = $state(true);

	const getReadHistory = async (id: string) => {
		const { data, error: readHistoryError } = await supabase
			.from('ReadHistory')
			.select('*')
			.eq('userId', id)
			.order('updated_at', { ascending: false });

		if (data && data.length > 0) {
			const articlesWithProgress = await Promise.all(
				data.map(async (item) => {
					const article = await getGhostArticleBySlug(item.articleId);
					return { ...article, progress: item.progress };
				})
			);

			historyArticles = articlesWithProgress;
		}

		if (readHistoryError) {
			throw error(500, 'Error fetching read history');
		}
	};

	const handleDataFetch = async () => {
		isLoading = true;
		try {
			const {
				data: { user }
			} = await supabase.auth.getUser();

			if (user) {
				await getReadHistory(user.id);

				isLoading = false;
			} else {
				goto('/signin?callback_url=/account/continue-reading');
			}
		} catch (errorData) {
			console.error(errorData);
			toast.error('Error loading read history. Please try again.');

			historyArticles = [];

			throw error(500, 'An error occured');
		}
	};

	function getPrimaryCategory(article: ArticleMetadata) {
		const primary = article.categories.find((category) => category.is_primary);

		return primary ?? article.categories[0];
	}

	$effect(() => {
		handleDataFetch();
	});

	let viewStyle = $state<'GRID' | 'LIST'>('GRID');

	const handleBackNavigate = () => {
		history.back();
	};
</script>

{#if isLoading}
	<div
		class="fixed h-dvh w-dvw bg-background z-[9999999999999] top-0 left-0 flex items-center justify-center"
	>
		<Loader2 class="size-5 animate-spin" />
	</div>
{/if}

<div class="pt-32 pb-[60px]">
	<div class="container">
		<div class="flex items-center justify-between mb-10">
			<div class="flex items-center gap-3">
				<button class="flex-shrink-0" onclick={handleBackNavigate}>
					<ArrowLeft />
				</button>
				<h1 class="text-[24px] font-powerGroteskBold">Continue reading</h1>
			</div>

			<div class="max-md:hidden flex items-center gap-2">
				<button
					class={cn(
						'md:bg-[#19191A] h-10 flex items-center justify-center gap-1 text-sm p-1.5 md:p-2.5 rounded-[8px] transition',
						viewStyle === 'GRID' && 'opacity-50'
					)}
					aria-label="Switch to list view"
					onclick={() => (viewStyle = 'LIST')}
				>
					<List />

					<span class="max-md:hidden">List View</span>
				</button>

				<button
					class={cn(
						'md:bg-[#19191A] h-10 flex items-center justify-center gap-1 text-sm p-1.5 md:p-2.5 rounded-[8px] transition',
						viewStyle === 'LIST' && 'opacity-50'
					)}
					aria-label="Switch to list view"
					onclick={() => (viewStyle = 'GRID')}
				>
					<Grid />

					<span class="max-md:hidden">Grid View</span>
				</button>
			</div>
		</div>

		<div class="mt-7">
			{#if viewStyle === 'GRID'}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each historyArticles as article}
						{@const primaryCategory = getPrimaryCategory(article)?.name}
						{@const formattedDate = format(article.created_at, 'dd MMM yyyy')}
						{@const progress = Math.floor(Number(article.progress))}

						<div>
							<div class="flex items-center justify-between">
								<a
									href={`/category/${formatCategorySlug(primaryCategory)}`}
									data-sveltekit-preload-data
								>
									<Badge class="rounded-none">{primaryCategory}</Badge></a
								>

								<a
									href={`/category/${formatCategorySlug(primaryCategory)}`}
									data-sveltekit-preload-data
								>
									<button
										class="flex items-center gap-1 text-xs !font-mono text-neutral-20 hover:text-neutral-40 group transition"
										>View All <ArrowRight
											class="size-3.5 group-hover:translate-x-[2px] transition will-change-transform"
										/></button
									></a
								>
							</div>

							<a href={`/${article.slug}`} data-sveltekit-preload-data>
								<div class="mt-1 group">
									<div class="h-[165px] relative overflow-hidden cursor-pointer">
										<img
											class="size-full object-cover group-hover:scale-110 transition will-change-transform"
											src={article.thumb_url}
											alt={`Thumbnail for article: ${article.title}`}
											loading="eager"
										/>
									</div>

									<div class="mt-4">
										<h3
											class="font-powerGroteskBold text-lg leading-[18.9px] group-hover:underline underline-offset-[3px]"
										>
											{article.title}
										</h3>

										<div
											class="mt-2 text-xs font-mono divide-x divide-[#333] text-neutral-40 flex items-center gap-2"
										>
											<p>{formattedDate}</p>
											<p class="pl-2">{article.min_read} min read</p>
										</div>
									</div>

									<div
										class="mt-3 text-xs font-mono text-neutral-10 flex items-center justify-between gap-10"
									>
										<div class="bg-[#272728] h-2.5 flex-1 rounded-[40px] relative overflow-hidden">
											<div
												class="bg-[#0AB2BA] absolute inset-y-0 rounded-[40px]"
												style={`width: ${progress}%`}
											></div>
										</div>

										<p class="w-20 text-right leading-0">
											{progress}% Complete
										</p>
									</div>
								</div></a
							>
						</div>
					{/each}
				</div>
			{/if}

			{#if viewStyle === 'LIST'}
				<div class="space-y-[42px]">
					{#each historyArticles as article}
						{@const primaryCategory = getPrimaryCategory(article)?.name}
						{@const formattedDate = format(article.created_at, 'dd MMM yyyy')}
						{@const progress = Math.floor(Number(article.progress))}

						<div class="flex items-center gap-6">
							<div class="w-[180px] h-[118.636px] relative">
								<img
									class="size-full object-cover group-hover:scale-110 transition will-change-transform"
									src={article.thumb_url}
									alt={`Thumbnail for article: ${article.title}`}
									loading="eager"
								/>
							</div>

							<div class="group space-y-2.5 flex-1">
								<a
									href={`/category/${formatCategorySlug(primaryCategory)}`}
									data-sveltekit-preload-data
								>
									<Badge class="bg-white rounded-[2px] text-neutral-80 px-1.5 py-1 h-[22px]"
										>{primaryCategory}</Badge
									></a
								>

								<a class="block space-y-2.5" href={`/${article.slug}`} data-sveltekit-preload-data>
									<h3
										class="font-powerGroteskBold text-lg leading-[18.9px] group-hover:underline underline-offset-[3px] max-w-[782px]"
									>
										{article.title}
									</h3>

									<div
										class="text-xs font-mono divide-x divide-[#333] text-neutral-40 flex items-center gap-2"
									>
										<p>{formattedDate}</p>
										<p class="pl-2">{article.min_read} min read</p>
									</div>

									<div
										class="text-xs font-mono text-neutral-10 flex items-center justify-between gap-10"
									>
										<div
											class="bg-[#272728] h-2.5 flex-1 rounded-[40px] relative overflow-hidden max-w-[782px]"
										>
											<div
												class="bg-[#0AB2BA] absolute inset-y-0 rounded-[40px]"
												style={`width: ${progress}%`}
											></div>
										</div>

										<p class="w-20 text-right leading-0">{progress}% Complete</p>
									</div>
								</a>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
