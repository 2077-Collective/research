<script lang="ts">
	import ScrollToTopButton from '$lib/components/ui/ScrollToTopButton.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { posts } = data;

	let searchQuery = '';
	let filteredPosts: typeof posts = [];
	let searchTimeout: ReturnType<typeof setTimeout>;

	onMount(() => {
		filteredPosts = posts ?? [];
	});

	function handleSearch(query: string) {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			const searchLower = query.toLowerCase();
			filteredPosts =
				posts?.filter(
					(post) =>
						!query ||
						post.title.toLowerCase().includes(searchLower) ||
						post.preview_text.toLowerCase().includes(searchLower)
				) ?? [];
		}, 300);
	}

	$: if (searchQuery) handleSearch(searchQuery);

	function formatDate(timestamp: number | null): string {
		if (!timestamp) return '';

		try {
			const date = new Date(timestamp * 1000);
			if (isNaN(date.getTime())) {
				return '';
			}

			const now = new Date();
			const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

			if (diffInMinutes < 60) {
				return `${Math.floor(diffInMinutes)} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
			} else if (diffInMinutes < 1440) {
				const hours = Math.floor(diffInMinutes / 60);
				return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
			} else {
				return new Date(timestamp * 1000).toLocaleDateString('en-US', {
					month: 'short',
					day: '2-digit',
					year: 'numeric'
				});
			}
		} catch (error) {
			console.error('Error formatting date:', error);
			return '';
		}
	}

	$: hasPosts = filteredPosts && Array.isArray(filteredPosts) && filteredPosts.length > 0;
</script>

<div class="min-h-screen text-white pt-32 container">
	<header class="text-center pb-16">
		<img
			src="https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/publication/logo/cbd91fa6-23cb-4f0c-9fe4-b7313cd81b5b/eth_navigator_Logo.jpg"
			alt="Ethereum Navigator Logo"
			class="w-16 h-16 mx-auto mb-6"
		/>
		<h1 class="text-4xl font-bold mb-8 font-powerGroteskBold">Ethereum Navigator</h1>

		<div class="max-w-xl mx-auto mb-8">
			<iframe
				title="Ethereum Navigator Newsletter Signup"
				src="https://embeds.beehiiv.com/3fa93279-4c5c-46a8-9a05-53492983f1a4"
				data-test-id="beehiiv-embed"
				width="100%"
				height="320"
				frameborder="0"
				scrolling="no"
				sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
				referrerpolicy="no-referrer-when-downgrade"
				aria-label="Newsletter signup form"
			></iframe>
		</div>

		<div class="text-neutral-40 text-sm">
			<p class="mb-1">Written By</p>
			<p class="font-medium">Ethereum Navigator</p>
		</div>
	</header>

	<div class="pb-16">
		<div class="flex flex-col gap-6 mb-8">
			<h2 class="text-3xl font-bold">Archive</h2>

			<div class="relative w-full md:w-3/4">
				<input
					type="search"
					placeholder="Search posts..."
					bind:value={searchQuery}
					aria-label="Search posts"
					class="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent"
				/>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 pointer-events-none"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
		</div>

		{#if hasPosts}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each filteredPosts as post}
					<article
						class="group bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors rounded-lg overflow-hidden"
					>
						<a href={`/ethereum-navigator/${post.slug}`} class="block">
							{#if post.thumbnail_url}
								<img
									src={post.thumbnail_url}
									alt={post.title}
									class="w-full aspect-[16/9] object-cover"
								/>
							{/if}

							<div class="p-6">
								<div class="flex items-center justify-between mb-2">
									<time class="text-sm text-neutral-40 font-mono">
										{formatDate(post.publish_date)}
									</time>
									<button class="text-zinc-400 hover:text-white" aria-label="Like post">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="w-4 h-4"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
											/>
										</svg>
									</button>
								</div>

								<h3
									class="text-xl font-bold mb-2 group-hover:text-teal-400 transition-colors font-powerGroteskBold"
								>
									{post.title}
								</h3>

								<p class="text-sm text-neutral-40 mb-4">
									{post.preview_text}
								</p>

								<div class="flex items-center">
									{#if post.authors && post.authors.length > 0}
										{#each post.authors as author}
											<div class="flex items-center gap-2">
												<img
													src="https://beehiiv-images-production.s3.amazonaws.com/uploads/user/profile_picture/5b0c5e78-b7a5-4966-afb6-572c8f3304c8/2077_.png"
													alt=""
													class="w-5 h-5 rounded-full bg-black"
												/>
												<span class="text-sm text-neutral-40 font-mono">{author}</span>
											</div>
										{/each}
									{/if}
								</div>
							</div>
						</a>
					</article>
				{/each}
			</div>
		{:else}
			<div class="text-center py-12">
				<p class="text-zinc-400">
					{#if !posts}
						Failed to load posts
					{:else if searchQuery}
						No posts found matching your search
					{:else}
						No posts available
					{/if}
				</p>
			</div>
		{/if}
	</div>
</div>

<ScrollToTopButton />
