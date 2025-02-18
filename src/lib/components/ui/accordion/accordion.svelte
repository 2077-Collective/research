<script lang="ts">
	import { Accordion } from 'bits-ui';
	import { Plus } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	const {
		class: className,
		items
	}: { class?: string; items: { title: string; content: string | Snippet }[] } = $props();
</script>

<Accordion.Root class={className} multiple>
	{#each items as item, i}
		<Accordion.Item value="${i}" class="group bg-[#151516] mb-4 rounded-[8px] p-0">
			<Accordion.Header class="p-0">
				<Accordion.Trigger
					class="flex w-full flex-1 items-center justify-between py-5 text-xl font-medium transition-all [&[data-state=open]>span>svg]:rotate-45 [&[data-state=closed]]:text-neutral-60 max-md:py-3 md:pt-4 md:pb-6 px-4 md:px-6"
				>
					<p class="text-base md:text-xl font-powerGroteskBold font-bold">{item.title}</p>

					<span
						class="inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent transition-all hover:bg-dark-10 flex-shrink-0"
					>
						<!-- <Minus class="transition-all duration-200" /> -->
						<Plus class="transition-all duration-200 max-md:size-4" />
					</span>
				</Accordion.Trigger>
			</Accordion.Header>

			<Accordion.Content
				transition={slide}
				transitionConfig={{ duration: 200 }}
				class="pb-6 text-sm md:text-base px-4 md:px-6"
			>
				{#if typeof item.content === 'string'}
					{item.content}
				{:else}
					{@render item.content()}
				{/if}
			</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
