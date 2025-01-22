<script lang="ts">
	import { Accordion } from 'bits-ui';
	import { slide } from 'svelte/transition';
	import { ArrowDown } from 'lucide-svelte';
	import type { Component, Snippet } from 'svelte';
	const {
		class: className,
		items
	}: { class?: string; items: { title: string; content: string | Snippet }[] } = $props();
</script>

<Accordion.Root class={className} multiple>
	{#each items as item, i}
		<Accordion.Item value="${i}" class="group border-b border-dark-10 px-1.5">
			<Accordion.Header>
				<Accordion.Trigger
					class="flex w-full flex-1 items-center justify-between py-5 text-xl font-medium transition-all [&[data-state=open]>span>svg]:rotate-180 "
				>
					{item.title}
					<span
						class="inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent transition-all hover:bg-dark-10"
					>
						<ArrowDown class="size-[18px] transition-all duration-200" />
					</span>
				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content
				transition={slide}
				transitionConfig={{ duration: 200 }}
				class="pb-[25px] text-base tracking-[-0.01em]"
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
