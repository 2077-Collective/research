<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import Grid from '$lib/components/ui/icons/Grid.svelte';
	import List from '$lib/components/ui/icons/List.svelte';
	import { cn } from '$lib/utils/ui-components';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';

	const articles = Array.from({ length: 5 });

	let viewStyle = $state<'GRID' | 'LIST'>('GRID');

	const handleBackNavigate = () => {
		history.back();
	};
</script>

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
				<div class="grid grid-cols-3 gap-6">
					{#each articles as article}
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
			{/if}

			{#if viewStyle === 'LIST'}
				<div class="space-y-[42px]">
					{#each articles as article}
						<div class="flex items-center gap-6">
							<div class="w-[180px] h-[118.636px] relative">
								<img
									class="size-full object-cover group-hover:scale-110 transition will-change-transform"
									src="https://ghost-2077.arvensis.systems/content/images/2025/03/rsby3bojlx6dmvwsvt7a-1.webp"
									alt="thumbnail"
								/>
							</div>

							<div class="group space-y-2.5 flex-1">
								<Badge class="bg-white rounded-[2px] text-neutral-80 px-1.5 py-1 h-[22px]"
									>Scaling</Badge
								>

								<h3
									class="font-powerGroteskBold text-lg leading-[18.9px] group-hover:underline underline-offset-[3px] max-w-[782px]"
								>
									Futures of Ethereum I: From Beacon Chain to Beam Chain
								</h3>

								<div
									class="text-xs font-mono divide-x divide-[#333] text-neutral-40 flex items-center gap-2"
								>
									<p>20 Jan 2024</p>
									<p class="pl-2">5 min read</p>
								</div>

								<div
									class="text-xs font-mono text-neutral-10 flex items-center justify-between gap-10"
								>
									<div
										class="bg-[#272728] h-2.5 flex-1 rounded-[40px] relative overflow-hidden max-w-[782px]"
									>
										<div class="bg-[#0AB2BA] absolute inset-y-0 w-1/2 rounded-[40px]"></div>
									</div>

									<p class="w-20 text-right leading-0">40% Complete</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
