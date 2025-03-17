<script lang="ts">
	import { goto } from '$app/navigation';
	import ArticleList from '$lib/components/ui/ArticleList.svelte';
	import { fetchGhostArticles } from '$lib/services/ghost.service';
	import { supabase } from '$lib/utils/supabase';
	import { cn } from '$lib/utils/ui-components';
	import { error } from '@sveltejs/kit';
	import { ArrowRight, Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let articles = $state<any[]>([]);
	let isLoading = $state(true);

	const handleFetchBookmarks = async () => {
		isLoading = true;
		try {
			const {
				data: { user }
			} = await supabase.auth.getUser();

			if (user) {
				const { data, error: dataError } = await supabase
					.from('UserBookmarks')
					.select('*')
					.eq('userId', user.id)
					.limit(1)
					.single();

				if (data) {
					const savedBookmarks: string[] = data.articleIds || [];

					if (savedBookmarks.length > 0) {
						const posts = await fetchGhostArticles(undefined, 1, 10000, savedBookmarks);

						articles = posts;
					}
				}

				if (dataError) {
					if (dataError.code === 'PGRST116') {
						const { error: createError } = await supabase
							.from('UserBookmarks')
							.insert({ userId: user.id, articleIds: [] });

						if (createError) {
							toast.error('An error occured. Please try again.');
						}
					} else {
						toast.error('Error fetching bookmarks');
						throw error(500, 'Error fetching bookmarks');
					}
				}

				isLoading = false;
			} else {
				goto('/signin?callback_url=/bookmarks');
				// isLoading = false;
			}
		} catch (errorData) {
			console.error(errorData);
			toast.error('Error loading bookmarks. Please try again.');

			articles = [];

			throw error(500, 'An error occured');
		}
	};

	$effect(() => {
		handleFetchBookmarks();
	});
</script>

{#if isLoading}
	<div class="min-h-screen flex items-center justify-center">
		<Loader2 class="size-5 animate-spin" />
	</div>
{/if}

<section class={cn('bg-[#010102] pt-32 pb-16 relative overflow-hidden', isLoading && 'hidden')}>
	<div class="container">
		<div class="max-w-[750px]">
			<h1 class="text-[24px] md:text-[32px] font-powerGroteskBold leading-9 font-bold">
				Bookmarks
			</h1>

			<p class="text-neutral-10 mt-4">
				Our contributors are researchers, builders, and thinkers pushing the boundaries of Ethereum
				and Web3. Explore their work, insights, and the ideas driving decentralization forward.
			</p>
		</div>
	</div>

	<enhanced:img
		src="/static/contritbutors-header.png"
		class="absolute top-0 right-0 pointer-events-none h-full"
		alt="header bg"
		loading="lazy"
		decoding="async"
	/>
</section>

<div class={cn(isLoading && 'hidden')}>
	{#if articles.length > 0}
		<ArticleList {articles} articlesPerPage={100} hideFeatured />
	{:else}
		<div class="flex flex-col items-center justify-center text-center py-32 gap-4">
			<p class="text-xl font-mono font-medium">Nothing in your bookmarks yet.</p>

			<a
				href="/reports"
				class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#0BC8D2] text-neutral-80 hover:bg-[#0BC8D2]/90 h-9 px-4 py-2 font-ibm group"
			>
				Go to Research

				<ArrowRight class="size-4 group-hover:translate-x-[2px] transition will-change-transform" />
			</a>
		</div>
	{/if}
</div>
