<script lang="ts">
	import { goto } from '$app/navigation';
	import { Badge } from '$lib/components/ui/badge';
	import { fetchGhostArticles } from '$lib/services/ghost.service';
	import type { Article, ArticleMetadata } from '$lib/types/article';
	import { formatCategorySlug } from '$lib/utils/format';
	import { supabase } from '$lib/utils/supabase';
	import { cn } from '$lib/utils/ui-components';
	import { error } from '@sveltejs/kit';
	import { format } from 'date-fns';
	import { ArrowRight, ChevronRight } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	// const savedArticles = Array.from({ length: 10 });

	let savedArticles = $state<Article[]>([]);
	let isLoading = $state(true);

	const getBookmarks = async (id: string) => {
		const { data, error: dataError } = await supabase
			.from('UserBookmarks')
			.select('*')
			.eq('userId', id)
			.limit(1)
			.single();

		if (data) {
			const savedBookmarks: string[] = data.articleIds || [];

			if (savedBookmarks.length > 0) {
				const posts = await fetchGhostArticles(undefined, 1, 10000, savedBookmarks);

				savedArticles = posts.reverse();
			}
		}

		if (dataError) {
			if (dataError.code === 'PGRST116') {
				const { error: createError } = await supabase
					.from('UserBookmarks')
					.insert({ userId: id, articleIds: [] });

				if (createError) {
					toast.error('An error occured. Please try again.');
				}
			} else {
				toast.error('Error fetching bookmarks');
				throw error(500, 'Error fetching bookmarks');
			}
		}
	};

	const handleDataFetch = async () => {
		isLoading = true;
		try {
			const {
				data: { user }
			} = await supabase.auth.getUser();

			if (user) {
				await getBookmarks(user.id);

				isLoading = false;
			} else {
				goto('/signin?callback_url=/account');
			}
		} catch (errorData) {
			console.error(errorData);
			toast.error('Error loading bookmarks. Please try again.');

			savedArticles = [];

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
</script>

<section class="pt-32 pb-[50px] bg-[#010102] relative overflow-hidden">
	<div class="container">
		<h1 class="text-[32px] font-powerGroteskBold">Welcome back, Emmanuel.</h1>
	</div>

	<img
		src="/contritbutors-header.png"
		class="absolute top-0 right-0 pointer-events-none h-full"
		alt="header bg"
	/>
</section>

<div class="pt-[43px] pb-[60px]">
	<div class="container">
		<a href="/account/continue-reading" class="inline-flex items-center gap-4 group">
			<button
				class="text-xl !font-powerGroteskBold inline-flex items-center gap-1.5 hover:text-neutral-20 transition group"
				>Continue Reading
				<ChevronRight
					class="size-5 group-hover:translate-x-[2px] transition will-change-transform"
				/>
			</button>
			<p class="text-[#0AB2BA] text-sm font-mono opacity-0 group-hover:opacity-100 transition">
				View all
			</p>
		</a>

		<div class="mt-7 grid grid-cols-3 gap-6">
			{#each Array.from({ length: 3 }) as article}
				<div>
					<div class="flex items-center justify-between">
						<Badge class="rounded-none">Scaling</Badge>

						<button
							class="flex items-center gap-1 text-xs !font-mono text-neutral-20 hover:text-neutral-40 group transition"
							>View All <ArrowRight
								class="size-3.5 group-hover:translate-x-[2px] transition will-change-transform"
							/></button
						>
					</div>

					<div class="mt-1 group">
						<div class="h-[165px] relative overflow-hidden cursor-pointer">
							<img
								class="size-full object-cover group-hover:scale-110 transition will-change-transform"
								src="https://ghost-2077.arvensis.systems/content/images/2025/03/rsby3bojlx6dmvwsvt7a-1.webp"
								alt="thumbnail"
							/>
						</div>

						<div class="mt-4">
							<h3
								class="font-powerGroteskBold text-lg leading-[18.9px] group-hover:underline underline-offset-[3px]"
							>
								Futures of Ethereum I: From Beacon Chain to Beam Chain
							</h3>

							<div
								class="mt-2 text-xs font-mono divide-x divide-[#333] text-neutral-40 flex items-center gap-2"
							>
								<p>20 Jan 2024</p>
								<p class="pl-2">5 min read</p>
							</div>
						</div>

						<div
							class="mt-3 text-xs font-mono text-neutral-10 flex items-center justify-between gap-10"
						>
							<div class="bg-[#272728] h-2.5 flex-1 rounded-[40px] relative overflow-hidden">
								<div class="bg-[#0AB2BA] absolute inset-y-0 w-1/2 rounded-[40px]"></div>
							</div>

							<p class="w-20 text-right leading-0">40% Complete</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<div class="pt-[30px]">
	<div class="container">
		<button
			class="text-xl !font-powerGroteskBold inline-flex items-center gap-1.5 hover:text-neutral-20 transition group"
			>Saved Articles
			<!-- <ChevronRight class="size-5 group-hover:translate-x-[2px] transition will-change-transform" /> -->
		</button>
	</div>

	<div class="mt-[18px] border-y border-[#202020]">
		<div class="container">
			<div class="grid grid-cols-5 border-l border-[#202020]">
				{#each savedArticles as article, i}
					{@const primaryCategory = getPrimaryCategory(article)?.name}
					{@const formattedDate = format(article.created_at, 'dd MMM yyyy')}
					<div
						class={cn(
							'px-5 pt-[31px] pb-[50px] border-r border-[#202020]'
							// i === 0 && 'border-l border-[#202020]',
							// savedArticles.length - 1 === i && '!border-r border-[#202020]'
						)}
					>
						<a
							href={`/category/${formatCategorySlug(primaryCategory)}`}
							data-sveltekit-preload-data
						>
							<Badge class="rounded-none">{primaryCategory}</Badge></a
						>

						<div class="mt-1 group relative">
							<a href={`/${article.slug}`} data-sveltekit-preload-data>
								<div class="aspect-[1/1.1] relative overflow-hidden">
									<img
										class="size-full object-cover group-hover:scale-110 transition will-change-transform"
										src={article.thumb_url}
										alt={`Thumbnail for article: ${article.title}`}
										loading="eager"
									/>
								</div>

								<div class="mt-4">
									<h3
										class="font-powerGroteskBold text-xl leading-[22px] group-hover:underline underline-offset-[3px]"
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
							</a>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<div class="pt-[52px] pb-[112px]">
	<div class="container">
		<button
			class="text-xl !font-powerGroteskBold inline-flex items-center gap-1.5 hover:text-neutral-20 transition group"
			>Highlights
			<ChevronRight class="size-5 group-hover:translate-x-[2px] transition will-change-transform" />
		</button>

		<div class="mt-7 grid grid-cols-3 gap-4">
			<div>
				<div class="bg-[#161617] pt-4 px-5 pb-5 rounded-[8px] group">
					<div class="flex items-center gap-[14px]">
						<div class="size-14 rounded-[8px] flex-shrink-0 relative overflow-hidden">
							<img
								class="size-full object-cover group-hover:scale-110 transition will-change-transform"
								src="https://ghost-2077.arvensis.systems/content/images/2025/03/rsby3bojlx6dmvwsvt7a-1.webp"
								alt="thumbnail"
							/>
						</div>

						<div>
							<h3 class="font-powerGroteskBold leading-[17.6px]">
								DePIN On Ethereum: Redefining Coordination Systems
							</h3>

							<p class="text-xs text-neutral-40 font-mono mt-[2px]">by sm-stack</p>
						</div>
					</div>

					<p class="mt-4 text-sm text-neutral-10">
						Also known as “soft confirmations”, the sequencer’s confirmation of transaction success
						(or failure) are useful for time-sensitive users who want to avoid waiting for
						transactions to finalize on Ethereum L1 before knowing a transaction’s status.
					</p>
				</div>
			</div>

			<div>
				<div class="bg-[#161617] pt-4 px-5 pb-5 rounded-[8px] group">
					<div class="flex items-center gap-[14px]">
						<div class="size-14 rounded-[8px] flex-shrink-0 relative overflow-hidden">
							<img
								class="size-full object-cover group-hover:scale-110 transition will-change-transform"
								src="https://ghost-2077.arvensis.systems/content/images/2025/03/rsby3bojlx6dmvwsvt7a-1.webp"
								alt="thumbnail"
							/>
						</div>

						<div>
							<h3 class="font-powerGroteskBold leading-[17.6px]">
								DePIN On Ethereum: Redefining Coordination Systems
							</h3>

							<p class="text-xs text-neutral-40 font-mono mt-[2px]">by sm-stack</p>
						</div>
					</div>

					<p class="mt-4 text-sm text-neutral-10">
						However, this "honeymoon period" did not last long. As various L2s began competing for
						TVL, users’ assets became increasingly fragmented across different L2s, exposing
						numerous challenges in user experience (UX), particularly in cross-L2 interactions.
					</p>
				</div>
			</div>

			<div>
				<div class="bg-[#161617] pt-4 px-5 pb-5 rounded-[8px] group">
					<div class="flex items-center gap-[14px]">
						<div class="size-14 rounded-[8px] flex-shrink-0 relative overflow-hidden">
							<img
								class="size-full object-cover group-hover:scale-110 transition will-change-transform"
								src="https://ghost-2077.arvensis.systems/content/images/2025/03/rsby3bojlx6dmvwsvt7a-1.webp"
								alt="thumbnail"
							/>
						</div>

						<div>
							<h3 class="font-powerGroteskBold leading-[17.6px]">
								DePIN On Ethereum: Redefining Coordination Systems
							</h3>

							<p class="text-xs text-neutral-40 font-mono mt-[2px]">by sm-stack</p>
						</div>
					</div>

					<p class="mt-4 text-sm text-neutral-10">
						All attempts to address this issue inherently rely on leveraging shared resources.
					</p>
				</div>
			</div>

			<div>
				<div class="bg-[#161617] pt-4 px-5 pb-5 rounded-[8px] group">
					<div class="flex items-center gap-[14px]">
						<div class="size-14 rounded-[8px] flex-shrink-0 relative overflow-hidden">
							<img
								class="size-full object-cover group-hover:scale-110 transition will-change-transform"
								src="https://ghost-2077.arvensis.systems/content/images/2025/03/rsby3bojlx6dmvwsvt7a-1.webp"
								alt="thumbnail"
							/>
						</div>

						<div>
							<h3 class="font-powerGroteskBold leading-[17.6px]">
								DePIN On Ethereum: Redefining Coordination Systems
							</h3>

							<p class="text-xs text-neutral-40 font-mono mt-[2px]">by sm-stack</p>
						</div>
					</div>

					<p class="mt-4 text-sm text-neutral-10">
						All attempts to address this issue inherently rely on leveraging shared resources.
					</p>
				</div>
			</div>

			<div>
				<div class="bg-[#161617] pt-4 px-5 pb-5 rounded-[8px] group">
					<div class="flex items-center gap-[14px]">
						<div class="size-14 rounded-[8px] flex-shrink-0 relative overflow-hidden">
							<img
								class="size-full object-cover group-hover:scale-110 transition will-change-transform"
								src="https://ghost-2077.arvensis.systems/content/images/2025/03/rsby3bojlx6dmvwsvt7a-1.webp"
								alt="thumbnail"
							/>
						</div>

						<div>
							<h3 class="font-powerGroteskBold leading-[17.6px]">
								DePIN On Ethereum: Redefining Coordination Systems
							</h3>

							<p class="text-xs text-neutral-40 font-mono mt-[2px]">by sm-stack</p>
						</div>
					</div>

					<p class="mt-4 text-sm text-neutral-10">
						Also known as “soft confirmations”, the sequencer’s confirmation of transaction success
						(or failure) are useful for time-sensitive users who want to avoid waiting for
						transactions to finalize on Ethereum L1 before knowing a transaction’s status.
					</p>
				</div>
			</div>
			<div>
				<div class="bg-[#161617] pt-4 px-5 pb-5 rounded-[8px] group">
					<div class="flex items-center gap-[14px]">
						<div class="size-14 rounded-[8px] flex-shrink-0 relative overflow-hidden">
							<img
								class="size-full object-cover group-hover:scale-110 transition will-change-transform"
								src="https://ghost-2077.arvensis.systems/content/images/2025/03/rsby3bojlx6dmvwsvt7a-1.webp"
								alt="thumbnail"
							/>
						</div>

						<div>
							<h3 class="font-powerGroteskBold leading-[17.6px]">
								DePIN On Ethereum: Redefining Coordination Systems
							</h3>

							<p class="text-xs text-neutral-40 font-mono mt-[2px]">by sm-stack</p>
						</div>
					</div>

					<p class="mt-4 text-sm text-neutral-10">
						However, this "honeymoon period" did not last long. As various L2s began competing for
						TVL, users’ assets became increasingly fragmented across different L2s, exposing
						numerous challenges in user experience (UX), particularly in cross-L2 interactions.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
