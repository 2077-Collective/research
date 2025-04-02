<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { cn } from '$lib/utils/ui-components';
	import { ChevronDown, X } from 'lucide-svelte';

	const savedArticles = Array.from({ length: 5 });

	let selected = $state<'topics' | 'authors' | null>('topics');
	let isOpen = $state(true);

	const topics = [
		'Layer 1',
		'Infrastructure',
		'DeFi',
		'Privacy',
		'Layer 5',
		'Interoperability',
		'Scalability',
		'Tokenization'
	];

	const authors = ['Emmanuel Awosika', 'Ndu', 'Lyn', 'Bruno Almeida'];
</script>

<section class="pt-32 pb-[50px] bg-[#010102] relative overflow-hidden">
	<div class="container">
		<h1 class="text-[32px] font-powerGroteskBold">
			Following
			<sup class="text-lg">32</sup>
		</h1>

		<div class="flex items-center gap-4">
			<button
				class={cn(
					'flex items-center gap-1 text-sm !font-mono text-neutral-40',
					selected === 'topics' && 'text-[#0CDEE9]'
				)}
				onclick={() => {
					if (selected === 'authors') {
						selected = 'topics';
						isOpen = true;
					} else {
						isOpen = !isOpen;
					}
				}}
				>Topics: {topics.length}
				<ChevronDown
					class={cn('size-5 transition', (selected !== 'topics' || !isOpen) && 'rotate-180')}
				/>
			</button>

			<button
				class={cn(
					'flex items-center gap-1 text-sm !font-mono text-neutral-40',
					selected === 'authors' && 'text-[#0CDEE9]'
				)}
				onclick={() => {
					if (selected === 'topics') {
						selected = 'authors';
						isOpen = true;
					} else {
						isOpen = !isOpen;
					}
				}}
				>Authors: {authors.length}
				<ChevronDown
					class={cn('size-5 transition', (selected !== 'authors' || !isOpen) && 'rotate-180')}
				/>
			</button>
		</div>

		{#if isOpen}
			<div class="mt-[18.5px] max-w-[400px] flex items-center flex-wrap gap-1">
				{#if selected === 'topics'}
					{#each topics as topic}
						<div
							class="flex items-center gap-2.5 text-sm font-mono py-1.5 px-2.5 bg-[#181818] border border-[#1D1D1D] rounded-[7px]"
						>
							<p>{topic}</p>

							<button><X class="size-[14px]" /></button>
						</div>
					{/each}
				{:else}
					{#each authors as author}
						<div
							class="flex items-center gap-2.5 text-sm font-mono py-1.5 px-2.5 bg-[#181818] border border-[#1D1D1D] rounded-[7px]"
						>
							<p>{author}</p>

							<button><X class="size-[14px]" /></button>
						</div>
					{/each}
				{/if}
			</div>
		{/if}
	</div>

	<img
		src="/contritbutors-header.png"
		class="absolute top-0 right-0 pointer-events-none h-full"
		alt="header bg"
	/>
</section>

<div class="pt-5 pb-[124px] bg-[#0C0C0D]">
	<div class="container divide-y divide-[#191919]">
		{@render cardTopic()}
		{@render cardAuthor()}
		{@render cardTopic()}
		{@render cardAuthor()}
		{@render cardTopic()}
		{@render cardAuthor()}
		{@render cardTopic()}
		{@render cardAuthor()}
		{@render cardTopic()}
		{@render cardAuthor()}
	</div>
</div>

{#snippet cardTopic()}
	<div class="py-[31px] flex items-start justify-between">
		<div>
			<Badge class="hover:bg-[#181818] bg-[#181818] text-neutral-20 py-1.5 rounded-[7px]"
				>Layer 1</Badge
			>
			<div class="mt-3 max-w-[630px]">
				<h3 class="font-powerGroteskBold text-lg text-neutral-20 leading-6">
					Designing Cross-L2 Interoperability Standards: The Impact of Shared Resources
				</h3>

				<p class="text-neutral-40 mt-2">
					Exploring cross-L2 interoperability standards and the role of shared resources in
					enhancing blockchain scalability, security, and seamless communication.
				</p>

				<div
					class="mt-3 text-xs font-mono divide-x divide-[#333] text-neutral-40 flex items-center gap-2"
				>
					<p>20 Jan 2024</p>
					<p class="pl-2">5 min read</p>
				</div>
			</div>
		</div>

		<div class="w-[352.27px] max-w-full min-h-[154.026px] relative overflow-hidden">
			<img
				class="size-full object-cover group-hover:scale-110 transition will-change-transform"
				src="https://ghost-2077.arvensis.systems/content/images/2025/03/rsby3bojlx6dmvwsvt7a-1.webp"
				alt="thumbnail"
			/>
		</div>
	</div>
{/snippet}

{#snippet cardAuthor()}
	<div class="py-[31px] flex items-start justify-between">
		<div>
			<div class="flex items-center gap-3">
				<div class="size-9 rounded-full bg-[#0CDEE9]"></div>

				<div>
					<p class="text-sm font-mono text-neutral-20">by 2077Research</p>

					<div
						class="mt-1 text-xs font-mono divide-x divide-[#333] text-neutral-40 flex items-center gap-2"
					>
						<p>20 Jan 2024</p>
						<p class="pl-2">5 min read</p>
					</div>
				</div>
			</div>

			<div class="mt-3 max-w-[630px]">
				<h3 class="font-powerGroteskBold text-lg text-neutral-20 leading-6">
					Designing Cross-L2 Interoperability Standards: The Impact of Shared Resources
				</h3>

				<p class="text-neutral-40 mt-2">
					Exploring cross-L2 interoperability standards and the role of shared resources in
					enhancing blockchain scalability, security, and seamless communication.
				</p>

				<div class="mt-3 flex items-center gap-2 flex-wrap">
					<Badge class="hover:bg-[#181818] bg-[#181818] text-neutral-20 py-1.5 rounded-[7px]"
						>Layer 1</Badge
					>
					<Badge class="hover:bg-[#181818] bg-[#181818] text-neutral-20 py-1.5 rounded-[7px]"
						>Defi</Badge
					>
					<Badge class="hover:bg-[#181818] bg-[#181818] text-neutral-20 py-1.5 rounded-[7px]"
						>Arson</Badge
					>
				</div>
			</div>
		</div>

		<div class="w-[352.27px] max-w-full min-h-[154.026px] relative overflow-hidden">
			<img
				class="size-full object-cover group-hover:scale-110 transition will-change-transform"
				src="https://ghost-2077.arvensis.systems/content/images/2025/03/rsby3bojlx6dmvwsvt7a-1.webp"
				alt="thumbnail"
			/>
		</div>
	</div>
{/snippet}
